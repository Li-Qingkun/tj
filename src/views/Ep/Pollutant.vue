<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" label="查询" perms="ep:pollutant:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" label="新增" perms="ep:pollutant:insert" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>
	<!--表格内容栏-->
	<kt-table permsEdit="ep:pollutant:update" permsDelete="ep:pollutant:delete"
		:data="pageResult" :columns="columns" 
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form style="text-align:left" :model="dataForm" label-width="150px" :rules="dataFormRules" ref="dataForm" :size="size">
			<el-form-item label="ID" prop="id"  v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="代码" prop="code">
				<el-input v-model="dataForm.code" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="名称" prop="name">
				<el-input v-model="dataForm.name" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="简称" prop="abbreviation">
				<el-input v-model="dataForm.abbreviation" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="单位" prop="unit">
				<el-input v-model="dataForm.unit" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="type">
				<el-checkbox-group v-model="dataForm.type">
					<el-checkbox v-for="item in types" :key="item.value" :label="item.value" :value="item.value">{{item.label}}</el-checkbox >
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="显示顺序" prop="showOrder">
				<el-input type="number" oninput="value=value.replace(/[^\d]/g,'')" v-model="dataForm.showOrder" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="是否折算" prop="cvt">
				<el-radio v-model="dataForm.cvt" label="1">是</el-radio>
  				<el-radio v-model="dataForm.cvt" label="0">否</el-radio>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">提交</el-button>
		</div>
	</el-dialog>
  </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import { formatTime } from "@/utils/datetime"
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
				{prop:"code", label:"代码", minWidth:100},
				{prop:"name", label:"名称", minWidth:100},
				{prop:"abbreviation", label:"简称", minWidth:100},
				{prop:"unit", label:"单位", minWidth:100},
				{prop:"type", label:"类型", minWidth:100, formatter:this.typeFormatter},
				{prop:"showOrder", label:"显示顺序", minWidth:100},
				{prop:"cvt", label:"是否折算", minWidth:100, formatter:this.cvtFormatter}
			],
			pageRequest: { pageNumber: 1, pageSize: 10 },
			pageResult: {},

			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				code: [
					{ required: true, message: '请输入代码', trigger: 'blur' }
				],
				name: [
					{ required: true, message: '请输入名称', trigger: 'blur' }
				],
				type: [
					{ required: true, message: '请选择类型', trigger: 'blur' }
				],
				showOrder: [
					{ required: true, message: '请输入显示顺序', trigger: 'blur' }
				],
				cvt: [
					{ required: true, message: '请选择是否折算', trigger: 'change' }
				]
			},
			cvt:[],
			// 新增编辑界面数据
			dataForm: {},
			types: []
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.name = this.filters.name
			this.$api.pollutant.page(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 删除
		handleDelete: function (data) {
			this.$api.pollutant.deleteById(data.ids).then(data!=null?data.callback:'')
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
			this.$api.pollutant.get({id:params.row.id}).then((res) => {
				if(res.code == 200) {
					this.dataForm = Object.assign({}, res.data)
					let type = res.data.type
					if(type == null || type.length < 1){
						this.dataForm.type = []
					}else{
        				this.dataForm.type = type.split(',')
					}
					res.data.cvt===0?this.dataForm.cvt="0":this.dataForm.cvt="1"
				} else {
					this.$message({message: res.message, type: 'error', duration: 10000, showClose: true})
				}
			})
			this.editLoading = false
		},
		// 新增或编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.editLoading = true
					let params = Object.assign({}, this.dataForm)
					if(this.operation){
						this.$api.pollutant.insert(params).then((res) => {
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
						this.$api.pollutant.update(params).then((res) => {
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
		// 排放口类型格式化
		typeFormatter: function (row, column, cellValue, index){
			let typesid = row.type.split(',');
			let typename="";
			for(let j=0, len=typesid.length; j<len; j++) {
				for(let i=0, len=this.types.length; i<len; i++) {
					if(this.types[i].value === typesid[j]) {
						typename += this.types[i].label+"，"
						break
					}
				}
			}
			return typename.slice(0,typename.length-1);
      	},
		// 是否折算格式化
		cvtFormatter: function (row, column, cellValue, index){
			return row.cvt===1?"是":"否"
      	},
		// 获取排放口类别
		listType: function () {
			this.$api.dictionary.listByType({'type':'排放口类型'}).then((res) => {
				this.types = res.data
			})
		},
	},
	mounted() {
		this.listType()
	}
}
</script>

<style scoped>

</style>