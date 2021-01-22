<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar"
         style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true"
               :model="filters"
               :size="size">
        <el-form-item>
          <el-input v-model="filters.name"
                    placeholder="角色名"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search"
                     label="查询"
                     perms="sys:role:view"
                     type="primary"
                     @click="findPage(null)" />
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-plus"
                     label="新增"
                     perms="sys:role:insert"
                     type="primary"
                     @click="handleAdd" />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table permsEdit="sys:role:update"
              permsDelete="sys:role:delete"
              permsDetails="sys:role:view"
              :highlightCurrentRow="true"
              :stripe="false"
              :data="pageResult"
              :columns="columns"
              :showBatchDelete="false"
              @findPage="findPage"
              @handleDetails="handleDetails"
              @handleEdit="handleEdit"
              @handleDelete="handleDelete">
    </kt-table>
    <!-- </el-col> -->
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
        <el-form-item label="角色名"
                      prop="name">
          <el-input v-model="dataForm.name"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注 "
                      prop="remark">
          <el-input v-model="dataForm.remark"
                    auto-complete="off"
                    type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="机构"
                      prop="departmentName">
          <popup-tree-input :data="deptData"
                            :props="deptTreeProps"
                            :prop="dataForm.departmentName"
                            :nodeKey="''+dataForm.departmentId"
                            :currentChangeHandle="deptTreeCurrentChangeHandle">
          </popup-tree-input>
        </el-form-item>
        <el-form-item label="菜单授权"
                      prop="menuList">
          <el-tree :data="menuData"
                   size="mini"
                   show-checkbox
                   node-key="id"
                   :props="defaultProps"
                   :prop="dataForm.menuList"
                   :default-checked-keys="checkKeys"
                   style="width: 100%;pading-top:20px;"
                   ref="menuTree"
                   :render-content="renderContent"
                   v-loading="menuLoading"
                   element-loading-text="拼命加载中">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button :size="size"
                   @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size"
                   type="primary"
                   @click.native="submitForm"
                   :loading="editLoading">{{$t('action.submit')}}</el-button>
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
          <th>角色名</th>
          <td> {{dataTable.name}} </td>
        </tr>
        <tr>
          <th>备注</th>
          <td>{{dataTable.remark}}</td>
        </tr>
        <tr>
          <th>所属部门</th>
          <td>{{dataTable.departmentName}}</td>
        </tr>
        <!-- <tr>
          <th>授权菜单</th>
          <td>{{dataTable.menuList}}</td>
        </tr> -->
        <tr>
          <th>授权菜单</th>
          <td>
            <el-tree :data="menuDataDetail"
                     size="mini"
                     node-key="id"
                     :props="defaultProps"
                     :prop="dataForm.menuList"
                     :default-checked-keys="checkKeys"
                     style="width: 100%;pading-top:20px;"
                     ref="menuTree"
                     :render-content="renderContent"
                     v-loading="menuLoading"
                     element-loading-text="拼命加载中">
            </el-tree>
          </td>
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
import PopupTreeInput from '@/components/PopupTreeInput'
import KtTable from '@/views/Core/KtTable'
import KtButton from '@/views/Core/KtButton'
import TableTreeColumn from '@/views/Core/TableTreeColumn'
import { formatTime } from '@/utils/datetime'
export default {
  components: {
    PopupTreeInput,
    KtTable,
    KtButton,
    TableTreeColumn,
  },
  data() {
    return {
      size: 'small',
      filters: {
        name: '',
      },
      columns: [
        { prop: 'name', label: '角色名', minWidth: 120 },
        { prop: 'remark', label: '备注', minWidth: 120 },
        { prop: 'departmentName', label: '所属部门', minWidth: 120 },
      ],
      pageRequest: { pageNummber: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      detailsVisible: false, //显示详情页面
      dataTable: {}, //详情页数据
      dataFormRules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        departmentName: [
          { required: true, message: '请选择部门', trigger: 'blur' },
        ],
      },
      // 新增编辑界面数据
      dataForm: {
        id: 0,
        name: '',
        departmentId: 1,
        departmentName: '',
        menuIds: '',
        remark: '',
      },
      dataMenu: {
        parentId: 0,
        parentName: '',
      },
      selectRole: {},
      menuData: [],
      menuDataDetail: [], //详情页菜单树
      menuSelections: [],
      menuLoading: false,
      authLoading: false,
      checkAll: false,
      currentRoleMenus: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      tableTreeData: [],
      deptData: [],
      deptTreeProps: {
        label: 'name',
        children: 'children',
      },
      menuIdsList: [],
      checkKeys: [], //菜单默认选中的
    }
  },
  methods: {
    // 获取分页数据
    findPage: function (data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest
      }
      this.pageRequest.name = this.filters.name
      this.$api.role
        .findPage(this.pageRequest)
        .then((res) => {
          this.pageResult = res.data
          this.findTreeData()
        })
        .then(data != null ? data.callback : '')
    },
    // 批量删除
    handleDelete: function (data) {
      this.$api.role.batchDelete(data.ids).then(data.callback)
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogVisible = true
      this.operation = true
      this.dataForm = {
        id: 0,
        name: '',
        departmentId: 1,
        departmentName: '',
        menuIds: '',
        remark: '',
      }
      this.dataMenu = {
        parentId: 0,
        parentName: '',
      }
    },
    // 显示编辑界面
    handleEdit: function (params) {
      this.dialogVisible = true
      this.operation = false
      this.$nextTick(() => {
        this.$refs.menuTree.setCheckedKeys([])
      })
      this.$api.role.findById(params.row.id).then((res) => {
        this.dataForm = Object.assign({}, res.data)
        this.checkKeys = []
        for (let i in res.data.menuList) {
          for (let j in res.data.menuList) {
            if (res.data.menuList[i].id === res.data.menuList[j].parentId) {
              res.data.menuList[j].parentName = res.data.menuList[i].name
              res.data.menuList[i].children.push(res.data.menuList[j])
            }
          }
        }
        for (let i = 0; i < res.data.menuList.length; i++) {
          if (res.data.menuList[i].children.length === 0) {
            this.checkKeys.push(res.data.menuList[i].id)
          }
        }
      })
    },
    //显示详情页面
    handleDetails: function (params) {
      this.detailsVisible = true
      this.$api.role.findById(params.row.id).then((res) => {
        if (res.code == 200) {
          this.menuDataDetail = []
          for (let i in res.data.menuList) {
            for (let j in res.data.menuList) {
              if (res.data.menuList[i].id === res.data.menuList[j].parentId) {
                res.data.menuList[j].parentName = res.data.menuList[i].name
                res.data.menuList[i].children.push(res.data.menuList[j])
              }
            }
            if (res.data.menuList[i].parentId === null) {
              this.menuDataDetail.push(res.data.menuList[i])
            }
          }
          this.dataTable = Object.assign({}, res.data)
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
    // 编辑
    submitForm: function () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            let menu = this.$refs.menuTree.getCheckedNodes(false, true)
            let menuIds = ''
            for (let i = 0; i < menu.length; i++) {
              menuIds += menu[i].id + ','
            }
            menuIds = menuIds.slice(0, menuIds.length - 1)
            this.dataForm.menuIds = menuIds
            let params = Object.assign({}, this.dataForm)
            if (this.operation) {
              this.$api.role.save(params).then((res) => {
                if (res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                  this.dialogVisible = false
                  this.$refs['dataForm'].resetFields()
                } else {
                  this.$message({
                    message: '操作失败, ' + res.msg,
                    type: 'error',
                  })
                }
                this.findPage(null)
              })
            } else {
              this.$api.role.batchUpdate(params).then((res) => {
                if (res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                  this.dialogVisible = false
                  this.$refs['dataForm'].resetFields()
                } else {
                  this.$message({
                    message: '操作失败, ' + res.msg,
                    type: 'error',
                  })
                }
                this.findPage(null)
              })
            }
            this.editLoading = false
          })
        }
      })
    },
    // 获取数据
    findTreeData: function () {
      this.menuLoading = true
      this.$api.menu.tree().then((res) => {
        this.menuData = res.data
      })
      this.menuLoading = false
    },
    // 获取部门列表
    findDeptTree: function () {
      this.$api.dept.findDeptTree().then((res) => {
        this.deptData = res.data
      })
    },
    // 机构菜单树选中
    deptTreeCurrentChangeHandle(data, node) {
      this.dataForm.departmentId = data.id
      this.dataForm.departmentName = data.name
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="column-container">
          <span style="text-algin:center;margin-right:80px;">{data.name}</span>
          <span style="text-algin:center;margin-right:80px;">
            <el-tag
              type={data.type === 0 ? '' : data.type === 1 ? 'success' : 'info'}
              size="small"
            >
              {data.type === 0 ? '目录' : data.type === 1 ? '菜单' : '按钮'}
            </el-tag>
          </span>
        </div>
      )
    },
    // 时间格式化
    dateFormat: function (row, column, cellValue, index) {
      return format(row[column.property])
    },
  },
  mounted() {
    this.findDeptTree()
  },
}
</script>
<style scoped>
.menu-container {
  margin-top: 10px;
}
.menu-header {
  padding-left: 8px;
  padding-bottom: 5px;
  text-align: left;
  font-size: 16px;
  color: rgb(20, 89, 121);
}
.tab-details th {
  height: 30px;
  width: 130px;
  vertical-align: top;
  text-align: right;
  padding-top: 10px;
}
.tab-details td {
  text-align: left;
  padding: 10px 0 10px 30px;
}
</style>