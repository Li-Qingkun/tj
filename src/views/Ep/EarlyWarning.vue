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
          <kt-button icon="fa fa-search"
                     label="查询"
                     perms="ep:earlyWarning:view"
                     type="primary"
                     @click="findPage(null)" />
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-plus"
                     label="新增"
                     perms="ep:earlyWarning:insert"
                     type="primary"
                     @click="handleAdd" />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table permsEdit="ep:earlyWarning:update"
              :data="pageResult"
              :columns="columns"
              @findPage="findPage"
              @handleEdit="handleEdit">
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
        <el-form-item label="预警级别"
                      prop="color">
          <el-select v-model="dataForm.color"
                     placeholder="请选择"
                     style="width: 100%;">
            <el-option v-for="item in colors"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应急预案"
                      prop="level">
          <el-select v-model="dataForm.level"
                     placeholder="请选择"
                     style="width: 100%;">
            <el-option v-for="item in levels"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间"
                      prop="beginTime">
          <el-date-picker v-model="dataForm.beginTime"
                          type="datetime"
                          placeholder="开始时间"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间"
                      prop="endTime">
          <el-date-picker v-model="dataForm.endTime"
                          type="datetime"
                          placeholder="结束时间"
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
        { prop: 'color', label: '预警级别', minWidth: 50 },
        { prop: 'level', label: '应急预案', minWidth: 50 },
        { prop: 'content', label: '内容', minWidth: 100 },
        {
          prop: 'beginTime',
          label: '启动时间',
          minWidth: 100,
          formatter: this.dateFormatter,
        },
        {
          prop: 'endTime',
          label: '结束时间',
          minWidth: 100,
          formatter: this.dateFormatter,
        },
      ],
      pageRequest: { pageNumber: 1, pageSize: 10 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑详情界面是否显示
      editLoading: false,
      dataFormRules: {
        district: [
          { required: true, message: '请选择行政区划', trigger: 'blur' },
        ],
        color: [{ required: true, message: '请选择预警级别', trigger: 'blur' }],
        level: [{ required: true, message: '请选择应急预案', trigger: 'blur' }],
        beginTime: [
          { required: true, message: '请选择启动时间', trigger: 'blur' },
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' },
        ],
      },
      // 新增编辑界面数据
      dataForm: {},
      districts: [],
      districtsTree: [],
      color: [],
      levels: [],
    }
  },
  methods: {
    // 获取分页数据
    findPage: function (data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest
      }
      // this.pageRequest.ip = this.filters.ip
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
      this.$api.earlyWarning
        .page(this.pageRequest)
        .then((res) => {
          this.pageResult = res.data
        })
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
      this.$api.earlyWarning.get({ id: params.row.id }).then((res) => {
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
            this.$api.earlyWarning.insert(params).then((res) => {
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
            this.$api.earlyWarning.update(params).then((res) => {
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
    // 日期格式化
    dateFormatter: function (row, column, cellValue, index) {
      return formatTime(row[column.property])
    },
    // 获取预警级别
    listColor: function () {
      this.$api.dictionary
        .listByType({ type: '重污染天气预警级别' })
        .then((res) => {
          this.colors = res.data
          this.listMethod()
        })
    },
    // 获取预警级别
    listLevel: function () {
      this.$api.dictionary
        .listByType({ type: '重污染天气应急预案' })
        .then((res) => {
          this.levels = res.data
          this.listMethod()
        })
    },
  },
  mounted() {
    this.districtsTree = store.state.app.districtsTree
    this.listColor()
    this.listLevel()
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