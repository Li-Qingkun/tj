<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar"
         style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true"
               :model="filters"
               :size="size">
        <el-form-item>
          <el-input v-model="filters.district"
                    placeholder="行政区划"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.ip"
                    placeholder="IP"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search"
                     label="查询"
                     perms="ep:platformAddress:view"
                     type="primary"
                     @click="findPage(null)" />
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-plus"
                     label="新增"
                     perms="ep:platformAddress:insert"
                     type="primary"
                     @click="handleAdd" />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table permsDetails="ep:platformAddress:view"
              permsEdit="ep:platformAddress:update"
              permsDelete="ep:platformAddress:delete"
              :data="pageResult"
              :columns="columns"
              @findPage="findPage"
              @handleDetails="handleDetails"
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
        <el-form-item label="行政区划"
                      prop="district">
          <el-cascader v-model="dataForm.district"
                       :options="districtsTree"
                       :props="{ checkStrictly: true }"
                       style="width: 100%;"></el-cascader>
        </el-form-item>
        <el-form-item label="请求类型"
                      prop="type">
          <el-select v-model="dataForm.type"
                     placeholder="请选择"
                     style="width: 100%;">
            <el-option v-for="item in types"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IP"
                      prop="ip">
          <el-input v-model="dataForm.ip"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="端口"
                      prop="port">
          <el-input v-model="dataForm.port"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="URL"
                      prop="url">
          <el-input v-model="dataForm.url"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数"
                      prop="param">
          <el-input v-model="dataForm.param"
                    type="textarea"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="请求方法"
                      prop="method">
          <el-select v-model="dataForm.method"
                     placeholder="请选择"
                     style="width: 100%;">
            <el-option v-for="item in methodTypes"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注"
                      prop="remark">
          <el-input v-model="dataForm.remark"
                    type="textarea"
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
    <!--详情界面-->
    <el-dialog :title="'详情'"
               width="40%"
               :visible.sync="detailsVisible"
               :close-on-click-modal="false">
      <table class="tab-details"
             :model="dataTable"
             label-width="80px"
             :rules="dataFormRules"
             ref="dataTable"
             :size="size">
        <tr>
          <th>行政区划</th>
          <td>
            {{dataTable.district}}
          </td>
        </tr>
        <tr>
          <th>请求类型</th>
          <td>{{dataTable.type}}</td>
        </tr>
        <tr>
          <th>IP</th>
          <td>{{dataTable.ip}}</td>
        </tr>
        <tr>
          <th>端口</th>
          <td>{{dataTable.port}}</td>
        </tr>
        <tr>
          <th>参数</th>
          <td>{{dataTable.param}}</td>
        </tr>
        <tr>
          <th>请求方法</th>
          <td>{{dataTable.method}}</td>
        </tr>
        <tr>
          <th>备注</th>
          <td>{{dataTable.remark}}</td>
        </tr>
      </table>
      <div slot="footer"
           class="dialog-footer">
        <el-button :size="size"
                   @click.native="detailsVisible = false">关闭</el-button>
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
        ip: '',
      },
      columns: [
        {
          prop: 'district',
          label: '行政区划',
          minWidth: 50,
          formatter: this.districtFormatter,
        },
        {
          prop: 'type',
          label: '请求类型',
          minWidth: 50,
          formatter: this.typeFormatter,
        },
        { prop: 'ip', label: 'IP', minWidth: 80 },
        { prop: 'port', label: '端口', minWidth: 40 },
        { prop: 'url', label: 'URL', minWidth: 100 },
        { prop: 'param', label: '参数', minWidth: 100 },
        {
          prop: 'method',
          label: '请求方法',
          minWidth: 50,
          formatter: this.methodFormatter,
        },
        { prop: 'remark', label: '备注', minWidth: 100 },
      ],
      pageRequest: { pageNumber: 1, pageSize: 10 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑详情界面是否显示
      editLoading: false,
      detailsVisible: false,
      dataFormRules: {
        district: [
          { required: true, message: '请选择行政区划', trigger: 'blur' },
        ],
        type: [{ required: true, message: '请选择请求类型', trigger: 'blur' }],
        ip: [{ required: true, message: '请输入IP', trigger: 'blur' }],
        port: [{ required: true, message: '请输入端口', trigger: 'blur' }],
        method: [
          { required: true, message: '请选择请求方法', trigger: 'blur' },
        ],
      },
      // 新增编辑界面数据
      dataForm: {},
      // 详情界面数据
      dataTable: {},
      districts: [],
      districtsTree: [],
      types: [],
      methodTypes: [],
    }
  },
  methods: {
    // 获取分页数据
    findPage: function (data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest
      }
      this.pageRequest.ip = this.filters.ip
      if (this.filters.district !== '') {
        let districts = store.state.app.districts
        for (let i = 0, len = districts.length; i < len; i++) {
          if (
            districts[i].label.toLowerCase().indexOf(this.filters.district) !==
            -1
          ) {
            this.pageRequest.district = districts[i].value
            break
          }
        }
      } else {
        this.pageRequest.district = this.filters.district
      }
      this.$api.platformAddress
        .page(this.pageRequest)
        .then((res) => {
          this.pageResult = res.data
        })
        .then(data != null ? data.callback : '')
    },
    // 删除
    handleDelete: function (data) {
      this.$api.platformAddress
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
      this.$api.platformAddress.get({ id: params.row.id }).then((res) => {
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
    // 显示详情界面
    handleDetails: function (params) {
      this.detailsVisible = true
      this.$api.platformAddress.get({ id: params.row.id }).then((res) => {
        if (res.code == 200) {
          this.dataTable = Object.assign({}, res.data)
          let districts = store.state.app.districts
          for (let i = 0, len = districts.length; i < len; i++) {
            if (districts[i].value === this.dataTable.district) {
              this.dataTable.district = districts[i].label
              break
            }
          }
          for (let i = 0, len = this.types.length; i < len; i++) {
            if (this.types[i].value === this.dataTable.type) {
              this.dataTable.type = this.types[i].label
              break
            }
          }
        } else {
          this.$message({
            message: res.message,
            type: 'error',
            duration: 10000,
            showClose: true,
          })
        }
      })
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
            this.$api.platformAddress.insert(params).then((res) => {
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
            this.$api.platformAddress.update(params).then((res) => {
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
    // 获取请求方法
    listMethod: function () {
      this.$api.dictionary.listByType({ type: 'HTTP请求方法' }).then((res) => {
        this.methodTypes = res.data
      })
    },
    // 请求方法格式化
    methodsFormatter: function (row, column, cellValue, index) {
      let result = ''
      let value = row[column.property]
      for (let i = 0, len = this.methodTypes.length; i < len; i++) {
        if (this.methodTypes[i].value === value) {
          result = this.methodTypes[i].label
          break
        }
      }
      return result
    },
    // 获取请求类型
    listType: function () {
      this.$api.dictionary
        .listByType({ type: '环保平台请求类型' })
        .then((res) => {
          this.types = res.data
          this.listMethod()
        })
    },
    // 请求类型格式化
    typeFormatter: function (row, column, cellValue, index) {
      let result = ''
      let value = row[column.property]
      for (let i = 0, len = this.types.length; i < len; i++) {
        if (this.types[i].value === value) {
          result = this.types[i].label
          break
        }
      }
      return result
    },
  },
  mounted() {
    this.districtsTree = store.state.app.districtsTree
    this.districts = store.state.app.districts
    this.listType()
  },
}
</script>

<style scoped >
.tab-details th {
  height: 30px;
  width: 100px;
  vertical-align: top;
  text-align: right;
  padding-top: 10px;
}
.tab-details td {
  text-align: left;
  padding: 10px 0 10px 30px;
}
</style>