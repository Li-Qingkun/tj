<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar"
         style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true"
               :model="filters"
               :size="size">
        <el-form-item>
          <el-input v-model="filters.username"
                    placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search"
                     :label="$t('action.search')"
                     perms="sys:role:view"
                     type="primary"
                     @click="findPage(null)" />
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-plus"
                     :label="$t('action.add')"
                     perms="sys:user:insert"
                     type="primary"
                     @click="handleAdd" />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <kt-table permsEdit="sys:user:update"
              permsDelete="sys:user:delete"
              permsDetails="sys:user:view"
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
               :size="size"
               label-position="right">
        <el-form-item label="ID"
                      prop="id"
                      v-if="false">
          <el-input v-model="dataForm.id"
                    :disabled="true"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="dataForm.username"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称"
                      prop="nickname">
          <el-input v-model="dataForm.nickname"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门"
                      prop="departmentName">
          <popup-tree-input :data="deptData"
                            :props="deptTreeProps"
                            :prop="dataForm.departmentName"
                            :nodeKey="''+dataForm.departmentId"
                            :currentChangeHandle="deptTreeCurrentChangeHandle">
          </popup-tree-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="dataForm.email"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="dataForm.mobile"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色"
                      prop="roleList">
          <el-tree :data="roleData"
                   size="mini"
                   show-checkbox
                   node-key="id"
                   :props="defaultProps"
                   :prop="dataForm.roleList"
                   :default-checked-keys="checkKeys"
                   style="width: 100%;pading-top:20px;"
                   ref="roleTree"
                   :render-content="renderContent"
                   v-loading="roleLoading"
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
          <th>用户名</th>
          <td>
            {{dataTable.username}}
          </td>
        </tr>
        <tr>
          <th>昵称</th>
          <td>{{dataTable.nickname}}</td>
        </tr>
        <tr>
          <th>邮箱</th>
          <td>{{dataTable.email}}</td>
        </tr>
        <tr>
          <th>手机号</th>
          <td>{{dataTable.mobile}}</td>
        </tr>
        <tr>
          <th>状态</th>
          <td>{{dataTable.state}}</td>
        </tr>
        <tr>
          <th>部门</th>
          <td>{{dataTable.departmentName}}</td>
        </tr>
        <tr>
          <th>角色</th>
          <td>{{dataTable.roleList}}</td>
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
import TableColumnFilterDialog from '@/views/Core/TableColumnFilterDialog'
import { formatTime } from '@/utils/datetime'
export default {
  components: {
    PopupTreeInput,
    KtTable,
    KtButton,
    TableColumnFilterDialog,
  },
  data() {
    return {
      size: 'small',
      filters: {
        name: '',
      },
      columns: [
        { prop: 'username', label: '用户名', minWidth: 120 },
        { prop: 'nickname', label: '昵称', minWidth: 120 },
        { prop: 'departmentName', label: '机构', minWidth: 120 },
        { prop: 'email', label: '邮箱', minWidth: 120 },
        { prop: 'mobile', label: '手机', minWidth: 100 },
        {
          prop: 'state',
          label: '状态',
          minWidth: 70,
          formatter: this.stateFormat,
        },
      ],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 8 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      roleLoading: false,
      detailsVisible: false, //详情界面
      dataFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z][-_a-zA-Z0-9]{3,19}$/,
            message: '用户名只能输入字母开头的4-20位',
          },
        ],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        departmentName: [
          { required: true, message: '请选择部门', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: '\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*',
            message: '请输入正确的邮箱',
          },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: '1\\d{10}',
            message: '请输入正确的手机号',
          },
        ],
      },
      // 新增编辑界面数据
      dataForm: {
        id: 0,
        username: '',
        deptId: 1,
        deptName: '',
        email: 'test@qq.com',
        mobile: '13889700023',
        status: 1,
        userRoles: [],
        roleIds: '',
      },
      deptData: [],
      deptTreeProps: {
        label: 'name',
        children: 'children',
      },
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      roles: [],
      roleData: [],
      checkKeys: [],
      dataTable: {},
    }
  },
  methods: {
    // 获取分页数据
    findPage: function (data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest
      }
      this.pageRequest.username = this.filters.username
      this.$api.user
        .findPage(this.pageRequest)
        .then((res) => {
          this.pageResult = res.data
        })
        .then(data != null ? data.callback : '')
    },
    // 批量删除
    handleDelete: function (data) {
      this.$api.user
        .batchDelete(data.ids)
        .then(data != null ? data.callback : '')
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogVisible = true
      this.operation = true
      this.dataForm = {
        id: 0,
        name: '',
        password: '',
        departmentId: 1,
        departmentName: '',
        email: 'test@qq.com',
        mobile: '13889700023',
        status: 1,
        userRoles: [],
        roleIds: '',
      }
    },
    // 显示编辑界面
    handleEdit: function (params) {
      this.dialogVisible = true
      this.operation = false
      this.$nextTick(() => {
        this.$refs.roleTree.setCheckedKeys([])
      })
      this.$api.user
        .getById(params.row.id)
        .then((res) => {
          this.dataForm = res.data
          this.checkKeys = []
          for (let i in res.data.roleList) {
            this.checkKeys.push(res.data.roleList[i].id)
          }
        })
        .then(params != null ? params.callback : '')
    },
    //显示详情页面
    handleDetails: function (params) {
      this.detailsVisible = true
      this.$api.user.getById(params.row.id).then((res) => {
        if (res.code == 200) {
          this.dataTable = Object.assign({}, res.data)
          this.dataTable.state = this.dataTable.state === 1 ? '在职' : '离职'
          let rolelist = ''
          for (let i in this.dataTable.roleList) {
            rolelist += this.dataTable.roleList[i].remark + ','
          }
          rolelist = rolelist.slice(0, rolelist.length - 1)
          this.dataTable.roleList = rolelist
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
            let params = Object.assign({}, this.dataForm)
            let roleTree = this.$refs.roleTree.getCheckedNodes(false, true)
            params.roleIds = ''
            for (let i in roleTree) {
              if (!roleTree[i].disabled) {
                params.roleIds += roleTree[i].id + ','
              }
            }
            params.roleIds = params.roleIds.slice(0, params.roleIds.length - 1)
            this.$api.user.checkUserName(params.username).then((res) => {
              if (this.operation) {
                if (res.message === null) {
                  this.$api.user.save(params).then((res) => {
                    if (res.code == 200) {
                      this.$message({ message: '操作成功', type: 'success' })
                      this.dialogVisible = false
                      this.$refs['dataForm'].resetFields()
                    } else {
                      this.$message({
                        message: '操作失败, ' + res.message,
                        type: 'error',
                      })
                    }
                    this.findPage(null)
                  })
                } else {
                  this.$message({
                    message: res.message,
                    type: 'error',
                  })
                }
              } else {
                this.$api.user.batchUpdate(params).then((res) => {
                  if (res.code == 200) {
                    this.$message({ message: '操作成功', type: 'success' })
                    this.dialogVisible = false
                    this.$refs['dataForm'].resetFields()
                  } else {
                    this.$message({
                      message: '操作失败, ' + res.message,
                      type: 'error',
                    })
                  }
                  this.findPage(null)
                })
              }
            })
            this.editLoading = false
          })
        }
      })
    },
    // 获取部门列表
    findDeptTree: function () {
      this.$api.dept.findDeptTree().then((res) => {
        this.deptData = res.data
      })
    },
    // 获取角色数据
    findRoleTreeData: function () {
      this.roleLoading = true
      this.$api.role.findRoleMenus().then((res) => {
        this.roleData = res.data
      })
      this.roleLoading = false
    },
    // 菜单树选中
    deptTreeCurrentChangeHandle(data, node) {
      this.dataForm.departmentId = data.id
      this.dataForm.departmentName = data.name
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="column-container">
          <span style="text-algin:center;margin-right:80px;">{data.name}</span>
          <span style="text-algin:center;margin-right:80px;">
            <el-tag type={data.disabled ? '' : 'success'} size="small">
              {data.disabled ? '机构' : '角色'}
            </el-tag>
          </span>
        </div>
      )
    },
    // 状态格式化
    stateFormat: function (row, column, cellValue, index) {
      let state = row[column.property]
      state = state === 1 ? '在职' : '离职'
      return state
    },
  },
  mounted() {
    this.findDeptTree()
    this.findRoleTreeData()
  },
}
</script>

<style scoped>
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