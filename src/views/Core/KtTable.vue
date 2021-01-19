<template>
  <div>
    <!--表格栏-->
    <el-table :data="data.rows"
              :highlight-current-row="highlightCurrentRow"
              @selection-change="selectionChange"
              @current-change="handleCurrentChange"
              v-loading="loading"
              element-loading-text="拼命加载中"
              :border="border"
              :stripe="stripe"
              :show-overflow-tooltip="showOverflowTooltip"
              :max-height="maxHeight"
              :size="size"
              :align="align"
              style="width:100%;">
      <el-table-column type="selection"
                       width="40"
                       v-if="showOperation"></el-table-column>
      <el-table-column v-for="column in columns"
                       header-align="center"
                       align="center"
                       :prop="column.prop"
                       :label="column.label"
                       :width="column.width"
                       :min-width="column.minWidth"
                       :fixed="column.fixed"
                       :key="column.prop"
                       :type="column.type"
                       :formatter="column.formatter"
                       :show-overflow-tooltip="showOverflowTooltip">
      </el-table-column>
      <el-table-column label="操作"
                       width="175"
                       fixed="right"
                       v-if="showOperation"
                       header-align="center"
                       align="center">
        <template slot-scope="scope">
          <kt-button icon="fa fa-file-text-o"
                     :title="btndetail"
                     label=" "
                     :perms="permsDetails"
                     :size="size"
                     @click="handleDetails(scope.$index, scope.row)" />
          <kt-button icon="fa fa-edit"
                     :title="btnedit"
                     label=" "
                     :perms="permsEdit"
                     :size="size"
                     @click="handleEdit(scope.$index, scope.row)" />
          <kt-button icon="fa fa-trash"
                     :title="btndelete"
                     label=" "
                     :perms="permsDelete"
                     :size="size"
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar"
         style="padding:10px;">
      <kt-button label="批量删除"
                 :perms="permsDelete"
                 :size="size"
                 type="danger"
                 @click="handleBatchDelete()"
                 :disabled="this.selections.length===0"
                 style="float:left;"
                 v-if="showBatchDelete & showOperation" />
      <el-pagination layout="total, prev, pager, next, jumper"
                     @current-change="refreshPageRequest"
                     :current-page="pageRequest.pageNumber"
                     :page-size="pageRequest.pageSize"
                     :total="data.total"
                     style="float:right;">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import KtButton from '@/views/Core/KtButton'
export default {
  name: 'KtTable',
  components: {
    KtButton,
  },
  props: {
    columns: Array, // 表格列配置
    data: Object, // 表格分页数据
    permsDetails: String, // 详情权限标识
    permsEdit: String, // 编辑权限标识
    permsDelete: String, // 删除权限标识
    size: {
      // 尺寸样式
      type: String,
      default: 'mini',
    },
    align: {
      // 文本对齐方式
      type: String,
      default: 'left',
    },
    maxHeight: {
      // 表格最大高度
      type: Number,
      default: 440,
    },
    showOperation: {
      // 是否显示操作组件
      type: Boolean,
      default: true,
    },
    border: {
      // 是否显示边框
      type: Boolean,
      default: false,
    },
    stripe: {
      // 是否显示斑马线
      type: Boolean,
      default: true,
    },
    highlightCurrentRow: {
      // // 是否高亮当前行
      type: Boolean,
      default: true,
    },
    showOverflowTooltip: {
      // 是否单行显示
      type: Boolean,
      default: true,
    },
    showBatchDelete: {
      // 是否显示操作组件
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 分页信息
      pageRequest: {
        pageNumber: 1,
        pageSize: 9,
      },
      loading: false, // 加载标识
      selections: [], // 列表选中列
      btndetail: '详情',
      btnedit: '编辑',
      btndelete: '删除',
    }
  },
  methods: {
    // 分页查询
    findPage: function () {
      this.loading = true
      let callback = (res) => {
        this.loading = false
        if (this.data.rows.length === 0) {
          if (this.pageRequest.pageNumber > 1) {
            this.pageRequest.pageNumber -= 1
            this.findPage()
          }
        }
      }
      this.$emit('findPage', {
        pageRequest: this.pageRequest,
        callback: callback,
      })
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections
      this.$emit('selectionChange', { selections: selections })
    },
    // 选择切换
    handleCurrentChange: function (val) {
      this.$emit('handleCurrentChange', { val: val })
    },
    // 换页刷新
    refreshPageRequest: function (pageNumber) {
      this.pageRequest.pageNumber = pageNumber
      this.findPage()
    },
    // 详情
    handleDetails: function (index, row) {
      this.$emit('handleDetails', { index: index, row: row })
    },
    // 编辑
    handleEdit: function (index, row) {
      this.$emit('handleEdit', { index: index, row: row })
    },
    // 删除
    handleDelete: function (index, row) {
      this.delete(row.id)
    },
    // 批量删除
    handleBatchDelete: function () {
      let ids = this.selections.map((item) => item.id).toString()
      this.delete(ids)
    },
    // 删除操作
    delete: function (ids) {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
      })
        .then(() => {
          this.loading = true
          let callback = (res) => {
            if (res.code == 200 && res.message == null) {
              this.$message({ message: '删除成功', type: 'success' })
              this.findPage()
            } else {
              this.$message({
                message: res.message,
                type: 'error',
                duration: 0,
                showClose: true,
              })
            }
            this.loading = false
          }
          this.$emit('handleDelete', { ids: ids, callback: callback })
        })
        .catch(() => {})
    },
  },
  mounted() {
    this.refreshPageRequest(1)
  },
}
</script>

<style scoped>
</style>