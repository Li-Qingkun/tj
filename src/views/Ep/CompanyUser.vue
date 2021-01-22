<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar"
         style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true"
               :model="filters"
               :size="size">
        <el-form-item>
          <el-autocomplete v-model="filters.companyName"
                           :fetch-suggestions="queryCompanyAsync"
                           placeholder="请选择企业名称"
                           @select="handleCompanySelectQuery"
                           style="width: 250px;"></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search"
                     label="查询"
                     perms="ep:companyUser:view"
                     type="primary"
                     @click="findPage(null)" />
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-plus"
                     label="新增"
                     perms="ep:companyUser:insert"
                     type="primary"
                     @click="handleAdd" />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table permsEdit="ep:companyUser:update"
              permsDelete="ep:companyUser:delete"
              :data="pageResult"
              :columns="columns"
              @findPage="findPage"
              @handleEdit="handleEdit"
              @handleDelete="handleDelete">
    </kt-table>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'"
               width="40%"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false">
      <el-form :model="dataForm"
               label-width="80px"
               :rules="dataFormRules"
               ref="dataForm"
               :size="size">
        <el-form-item label="ID"
                      prop="id"
                      v-if="false">
          <el-input v-model="dataForm.id"
                    :disabled="true"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属企业"
                      prop="companyName">
          <el-autocomplete v-model="dataForm.companyName"
                           :fetch-suggestions="queryCompanyAsync"
                           placeholder="请选择企业名称"
                           @select="handleCompanySelect"
                           style="width: 100%;"></el-autocomplete>
        </el-form-item>
        <el-form-item label="行政区划"
                      prop="district">
          <el-cascader v-model="dataForm.district"
                       :options="districtsTree"
                       :props="{ checkStrictly: true }"
                       style="width: 100%;"></el-cascader>
        </el-form-item>
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="dataForm.username"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="dataForm.password"
                    auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button :size="size"
                   @click.native="dialogVisible = false">取消</el-button>
        <el-button :size="size"
                   type="primary"
                   @click.native="submitForm"
                   :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import KtTable from '@/views/Core/KtTable'
import KtButton from '@/views/Core/KtButton'
import { formatTime } from '@/utils/datetime'
export default {
  components: {
    KtTable,
    KtButton,
  },
  data() {
    return {
      size: 'small',
      filters: {
        username: '',
      },
      columns: [
        { prop: 'companyName', label: '所属企业', minWidth: 100 },
        {
          prop: 'district',
          label: '行政区划',
          minWidth: 80,
          formatter: this.districtFormatter,
        },
        { prop: 'username', label: '用户名', minWidth: 100 },
        { prop: 'password', label: '密码', minWidth: 80 },
      ],
      pageRequest: { pageNumber: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        district: [
          { required: true, message: '请选择行政区划', trigger: 'blur' },
        ],
        companyId: [
          { required: true, message: '请选择企业', trigger: 'change' },
        ],
        companyName: [
          { required: true, message: '请选择企业', trigger: 'change' },
        ],
      },
      // 新增编辑界面数据
      dataForm: {},
      districts: [],
      districtsTree: [],
    }
  },
  methods: {
    // 获取分页数据
    findPage: function (data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest
      }
      if (this.filters.companyName !== '') {
        this.pageRequest.companyId = this.filters.companyId
      } else {
        this.pageRequest.companyId = ''
      }
      this.$api.companyUser
        .page(this.pageRequest)
        .then((res) => {
          this.pageResult = res.data
        })
        .then(data != null ? data.callback : '')
    },
    // 删除
    handleDelete: function (data) {
      this.$api.companyUser
        .deleteById(data.ids)
        .then(data != null ? data.callback : '')
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogVisible = true
      this.operation = true
      this.editLoading = false
      this.dataForm = {
        district: '',
      }
    },
    // 显示编辑界面
    handleEdit: function (params) {
      this.dialogVisible = true
      this.operation = false
      this.editLoading = true
      this.$api.companyUser.get({ id: params.row.id }).then((res) => {
        if (res.code == 200) {
          this.dataForm = Object.assign({}, res.data)
        } else {
          this.$message({
            message: res.message,
            type: 'error',
            duration: 10000,
            showClose: true,
          })
        }
      })
      this.editLoading = false
    },
    // 新增/编辑
    submitForm: function () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.editLoading = true
          let params = Object.assign({}, this.dataForm)

          // 行政区划处理
          if (Array.isArray(params.district)) {
            let len = params.district.length
            params.district = params.district[len - 1]
          }

          if (this.operation) {
            this.$api.companyUser.insert(params).then((res) => {
              if (res.code == 200) {
                this.$message({ message: '新增成功', type: 'success' })
                this.dialogVisible = false
                this.$refs['dataForm'].resetFields()
              } else {
                this.$message({
                  message: res.message,
                  type: 'error',
                  duration: 10000,
                  showClose: true,
                })
              }
              this.findPage(null)
            })
          } else {
            this.$api.companyUser.update(params).then((res) => {
              if (res.code == 200) {
                this.$message({ message: '修改成功', type: 'success' })
                this.dialogVisible = false
                this.$refs['dataForm'].resetFields()
              } else {
                this.$message({
                  message: res.message,
                  type: 'error',
                  duration: 10000,
                  showClose: true,
                })
              }
              this.findPage(null)
            })
          }
          this.editLoading = false
        }
      })
    },
    //企业名称
    handleCompanySelectQuery(item) {
      this.filters.companyId = item.id
    },
    // 行政区划格式化
    districtFormatter: function (row, column, cellValue, index) {
      let result = ''
      let value = row[column.property]
      let districts = store.state.app.districts
      for (let i = 0, len = districts.length; i < len; i++) {
        if (districts[i].value === value) {
          result = districts[i].label
          break
        }
      }
      return result
    },
    handleCompanySelect(item) {
      this.dataForm.companyId = item.id
    },
    queryCompanyAsync(companyName, cb) {
      this.$api.company.listPage({ name: companyName }).then((res) => {
        let companies = res.data
        if (Array.isArray(companies)) {
          for (let i = 0; i < companies.length; i++) {
            companies[i].value = companies[i].name
          }
          cb(companies)
        }
      })
    },
  },
  mounted() {
    this.districtsTree = store.state.app.districtsTree
    this.districts = store.state.app.districts
  },
}
</script>

<style scoped>
</style>