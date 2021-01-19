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
                           style="width: 300px;"></el-autocomplete>
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
               label-width="110px"
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
        <el-form-item label="企业名称"
                      prop="companyName">
          <el-autocomplete v-model="dataForm.companyName"
                           :fetch-suggestions="queryCompanyAsync"
                           placeholder="请选择企业名称"
                           @select="handleCompanySelect"
                           style="width: 100%;"></el-autocomplete>
        </el-form-item>
        <el-form-item label="会员开始日期"
                      prop="memberBegin">
          <el-date-picker v-model="dataForm.memberBegin"
                          type="date"
                          placeholder="会员开始日期"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="会员结束日期"
                      prop="memberEnd">
          <el-date-picker v-model="dataForm.memberEnd"
                          type="date"
                          placeholder="会员结束日期"
                          style="width: 100%;"></el-date-picker>
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
import { formatDate } from '@/utils/datetime'
export default {
  components: {
    KtTable,
    KtButton,
  },
  data() {
    return {
      size: 'small',
      filters: {
        companyId: '',
      },
      columns: [
        { prop: 'companyName', label: '企业名称', minWidth: 100 },
        {
          prop: 'trialBegin',
          label: '开始试用日期',
          minWidth: 80,
          formatter: this.dateFormatter,
        },
        {
          prop: 'memberBegin',
          label: '会员开始日期',
          minWidth: 80,
          formatter: this.dateFormatter,
        },
        {
          prop: 'memberEnd',
          label: '会员结束日期',
          minWidth: 80,
          formatter: this.dateFormatter,
        },
      ],
      pageRequest: { pageNumber: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        companyId: [
          { required: true, message: '请选择企业ID', trigger: 'blur' },
        ],
        companyName: [
          { required: true, message: '请选择企业', trigger: 'change' },
        ],
        memberBegin: [
          { required: true, message: '请选择会员开始时间', trigger: 'blur' },
        ],
        memberEnd: [
          { required: true, message: '请选择结束开始时间', trigger: 'blur' },
        ],
      },
      // 新增编辑界面数据
      dataForm: {},
    }
  },
  methods: {
    // 获取分页数据
    findPage: function (data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest
      }
      this.pageRequest.companyId = this.filters.companyId
      this.$api.companyMember
        .page(this.pageRequest)
        .then((res) => {
          this.pageResult = res.data
        })
        .then(data != null ? data.callback : '')
    },
    // 删除
    handleDelete: function (data) {
      this.$api.companyMember
        .deleteById(data.ids)
        .then(data != null ? data.callback : '')
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogVisible = true
      this.operation = true
      this.editLoading = false
      this.dataForm = {}
    },
    // 显示编辑界面
    handleEdit: function (params) {
      this.dialogVisible = true
      this.operation = false
      this.editLoading = true
      this.$api.companyMember.get({ id: params.row.id }).then((res) => {
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
          if (this.operation) {
            this.$api.companyMember.insert(params).then((res) => {
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
            this.$api.companyMember.update(params).then((res) => {
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
    handleCompanySelectQuery(item) {
      this.filters.companyId = item.id
    },
    handleCompanySelect(item) {
      this.dataForm.companyId = item.id
      // console.log(this.dataForm.companyName)
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
    // 日期格式化
    dateFormatter: function (row, column, cellValue, index) {
      return formatDate(row[column.property])
    },
  },
  mounted() {},
}
</script>

<style scoped>
</style>