<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="filters.district" placeholder="行政区划"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" label="查询" perms="ep:company:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" label="新增" perms="ep:company:insert" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>
	<!--表格内容栏-->
	<kt-table permsDetails="ep:platformAddress:view" permsEdit="ep:company:update" permsDelete="ep:company:delete"
		:data="pageResult" :columns="columns" 
		@findPage="findPage" @handleDetails="handleDetails" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="150px" :rules="dataFormRules" ref="dataForm" :size="size">
			<el-form-item label="ID" prop="id"  v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="名称" prop="name">
				<el-input v-model="dataForm.name" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="简称" prop="abbreviation">
				<el-input v-model="dataForm.abbreviation" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="统一社会信用代码" prop="creditCode">
				<el-input v-model="dataForm.creditCode" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="法人" prop="legalPerson">
				<el-input v-model="dataForm.legalPerson" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="法人手机号" prop="legalPersonMobile">
				<el-input v-model="dataForm.legalPersonMobile" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="环保负责人" prop="epPerson">
				<el-input v-model="dataForm.epPerson" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="环保负责人手机号" prop="epPersonMobile">
				<el-input v-model="dataForm.epPersonMobile" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="企业类别" prop="type">
				<el-checkbox-group v-model="dataForm.type">
					<el-checkbox v-for="item in types" :key="item.value" :label="item.value" :value="item.value">{{item.label}}</el-checkbox >
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="行政区划" prop="district">
				<el-cascader v-model="dataForm.district" :options="districtsTree" style="width: 100%;"></el-cascader>
			</el-form-item>
			<el-form-item label="详细地址" prop="address">
				<el-input v-model="dataForm.address" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">提交</el-button>
		</div>
	</el-dialog>

	<!--详情界面-->
	<el-dialog :title="'详情'" width="40%" :visible.sync="detailsVisible" :close-on-click-modal="false">
		<table class="tab-details" :model="dataTable" label-width="80px" :rules="dataFormRules" ref="dataTable" :size="size">
			<tr>
				<th>名称</th>
				<td>
					{{dataTable.name}}
				</td>
			</tr>
			<tr>
				<th>简称</th>
				<td>{{dataTable.abbreviation}}</td>
			</tr>
			<tr>
				<th>统一社会信用代码</th>
				<td>{{dataTable.creditCode}}</td>
			</tr>
			<tr>
				<th>法人</th>
				<td>{{dataTable.legalPerson}}</td>
			</tr>
			<tr>
				<th>法人手机号</th>
				<td>{{dataTable.legalPersonMobile}}</td>
			</tr>
			<tr>
				<th>环保负责人</th>
				<td>{{dataTable.epPerson}}</td>
			</tr>
			<tr>
				<th>环保负责人手机号</th>
				<td>{{dataTable.epPersonMobile}}</td>
			</tr>
			<tr>
				<th>企业类型</th>
				<td>{{dataTable.type}}</td>
			</tr>
			<tr>
				<th>行政区划</th>
				<td>{{dataTable.district}}</td>
			</tr>
			<tr>
				<th>详细地址</th>
				<td>{{dataTable.address}}</td>
			</tr>
		</table>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="detailsVisible = false">关闭</el-button>
		</div>
	</el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
export default {
	components:{
			KtTable,
			KtButton
	},
	data() {
		return {
			size: 'small',
			filters: {
				name: ''
			},
			columns: [
				{prop:"name", label:"名称", minWidth:100},
				{prop:"abbreviation", label:"简称", minWidth:100},
				{prop:"district", label:"行政区划", minWidth:80, formatter:this.districtFormatter},
				{prop:"epPerson", label:"环保负责人", minWidth:120},
				{prop:"epPersonMobile", label:"环保负责人手机", minWidth:120}
			],
			pageRequest: { pageNumber: 1, pageSize: 10 },
			pageResult: {},

			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			detailsVisible: false, // 详情界面是否显示
			dataFormRules: {
				name: [
					{ required: true, message: '请输入名称', trigger: 'blur' }
				],
				district: [
					{ required: true, message: '请选择行政区划', trigger: 'blur' }
				]
			},
			// 新增编辑界面数据
			dataForm: {},
			types: [],
			districtsTree: [],
			// 详情界面数据
			dataTable: {},
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.name = this.filters.name
			if(this.filters.district!==""){
				let districts = store.state.app.districts;
				for(let i=0, len=districts.length; i<len; i++) {
					if(districts[i].label.toLowerCase().indexOf(this.filters.district)!==-1) {
						this.pageRequest.district = districts[i].value
						break
					}
				}
			}else{
				this.pageRequest.district = this.filters.district
			}
			this.$api.company.page(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 删除
		handleDelete: function (data) {
			this.$api.company.deleteById(data.ids).then(data!=null?data.callback:'')
		},
		// 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.editLoading = false
			this.dataForm = {
				type: []
			}
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
			this.operation = false
			this.editLoading = true
			this.$api.company.get({id:params.row.id}).then((res) => {
				if(res.code == 200) {
					this.dataForm = Object.assign({}, res.data)
					let type = res.data.type
					if(type == null || type.length < 1){
						this.dataForm.type = []
					}else{
        				this.dataForm.type = type.split(',')
					}
				} else {
					this.$message({message: res.message, type: 'error', duration: 10000, showClose: true})
				}
			})
			this.editLoading = false
		},
		// 显示详情界面
		handleDetails: function (params) {
			this.detailsVisible = true
			this.$api.company.get({id:params.row.id}).then((res) => {
				if(res.code == 200) {
					this.dataTable = Object.assign({}, res.data)
					let districts = store.state.app.districts;
					let type = res.data.type;
					for(let i=0, len=districts.length; i<len; i++) {
						if(districts[i].value === this.dataTable.district) {
							this.dataTable.district = districts[i].label
							break
						}
					}
					let typesid = this.dataTable.type.split(',');
					let typename="";
					for(let j=0, len=typesid.length; j<len; j++) {
						for(let i=0, len=this.types.length; i<len; i++) {
							if(this.types[i].value === typesid[j]) {
								typename += this.types[i].label+"，"
								break
							}
						}
					}
					this.dataTable.type=typename.slice(0,typename.length-1);
				} else {
					this.$message({message: res.message, type: 'error', duration: 10000, showClose: true})
				}
			})
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.editLoading = true
					let params = Object.assign({}, this.dataForm)

					// 行政区划处理
					if(Array.isArray(params.district)){
						let len = params.district.length;
						params.district = params.district[len-1]
					}

					// 将企业类型拼接成字符串
					if(params.type.length > 0){
						params.type = params.type.join(',')
					}else{
						params.type = ''
					}

					if(this.operation){
						this.$api.company.insert(params).then((res) => {
							if(res.code == 200) {
								this.$message({ message: '新增成功', type: 'success' })
								this.dialogVisible = false
								this.$refs['dataForm'].resetFields()
							} else {
								this.$message({message: res.message, type: 'error', duration: 10000, showClose: true})
							}
							this.findPage(null)
						})
					}else{
						this.$api.company.update(params).then((res) => {
							if(res.code == 200) {
								this.$message({ message: '修改成功', type: 'success' })
								this.dialogVisible = false
								this.$refs['dataForm'].resetFields()
							} else {
								this.$message({message: res.message, type: 'error', duration: 10000, showClose: true})
							}
							this.findPage(null)
						})
					}
					this.editLoading = false					
				}
			})
		},
		// 行政区划格式化
		districtFormatter: function (row, column, cellValue, index){
			let result = ""
			let value = row[column.property]
			let districts = store.state.app.districts;
			for(let i=0, len=districts.length; i<len; i++) {
				if(districts[i].value === value) {
					result = districts[i].label
					break
				}
			}
          	return result
      	},
		// 获取企业类别
		listType: function () {
			this.$api.dictionary.listByType({'type':'企业类别'}).then((res) => {
				this.types = res.data
			})
		},
	},
	mounted() {
		this.districtsTree = store.state.app.districtsTree
		this.listType()
	}
}
</script>

<style scoped>
	.tab-details th{
		height: 30px;
		width: 130px;
		vertical-align: top;
		text-align: right;
		padding-top: 10px;
	}
	.tab-details td{
		text-align: left;
		padding: 10px 0 10px 30px;
	}
</style>