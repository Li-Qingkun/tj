<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar"
         style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true"
               :model="filters"
               :size="size">
        <el-form-item>
          <el-autocomplete v-model="filters.companyId"
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
        <el-form-item label="支付方式"
                      prop="payType">
          <el-select v-model="dataForm.payType"
                     placeholder="请选择"
                     style="width: 100%;">
            <el-option v-for="item in payTypesLess"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付金额"
                      prop="totalAmount">
          <el-input v-model="dataForm.totalAmount"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付时间"
                      prop="payTime">
          <el-date-picker v-model="dataForm.payTime"
                          type="datetime"
                          placeholder="支付时间"
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
        companyId: '',
      },
      columns: [
        { prop: 'companyName', label: '企业名称', minWidth: 100 },
        {
          prop: 'payType',
          label: '支付方式',
          minWidth: 80,
          formatter: this.payTypeFormatter,
        },
        { prop: 'totalAmount', label: '支付金额', minWidth: 80 },
        {
          prop: 'payTime',
          label: '支付时间',
          minWidth: 100,
          formatter: this.timeFormatter,
        },
        { prop: 'outTradeNo', label: '订单号', minWidth: 80 },
        { prop: 'tradeNo', label: '交易流水号', minWidth: 80 },
        { prop: 'sellerId', label: '用户号', minWidth: 80 },
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
        payType: [
          { required: true, message: '请选择支付方式', trigger: 'blur' },
        ],
        totalAmount: [
          { required: true, message: '请输入支付金额', trigger: 'blur' },
        ],
        payTime: [
          { required: true, message: '请选择支付时间', trigger: 'blur' },
        ],
      },
      // 新增编辑界面数据
      dataForm: {},
      payTypes: [],
      payTypesLess: [],
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
      this.$api.companyPay
        .page(this.pageRequest)
        .then((res) => {
          this.pageResult = res.data
        })
        .then(data != null ? data.callback : '')
    },
    // 删除
    handleDelete: function (data) {
      this.$api.companyPay
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
      this.$api.companyPay.get({ id: params.row.id }).then((res) => {
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
            this.$api.companyPay.insert(params).then((res) => {
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
            this.$api.companyPay.update(params).then((res) => {
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
    // 支付方式格式化
    payTypeFormatter: function (row, column, cellValue, index) {
      let result = ''
      let value = row[column.property]
      let array = this.payTypes
      for (let i = 0, len = array.length; i < len; i++) {
        if (array[i].value === value) {
          result = array[i].label
          break
        }
      }
      return result
    },
    handleCompanySelectQuery(item) {
      this.filters.companyId = item.id
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
    // 获取支付方式
    listPayType: function () {
      this.$api.dictionary.listByType({ type: '支付方式' }).then((res) => {
        this.payTypes = res.data
        let array = this.payTypes
        if (array == null || array.length < 1) {
          return
        }
        let index = 0
        for (let i = 0, len = array.length; i < len; i++) {
          if (array[i].value === '1' || array[i].value === '2') {
            continue
          }
          this.payTypesLess[index] = array[i]
          index += 1
        }
      })
    },
    // 日期格式化
    dateFormatter: function (row, column, cellValue, index) {
      return formatDate(row[column.property])
    },
    // 时间格式化
    timeFormatter: function (row, column, cellValue, index) {
      return formatTime(row[column.property])
    },
  },
  mounted() {
    this.listPayType()
  },
}
</script>

<style scoped>
</style>