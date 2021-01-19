<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-autocomplete v-model="filters.companyName" :fetch-suggestions="queryCompanyAsync" placeholder="请选择企业" 
				@select="handleCompanySelectQuery" style="width: 250px;"></el-autocomplete>
			</el-form-item>
			<el-form-item>
				<el-input v-model="filters.name" placeholder="排放口名称"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" label="查询" perms="ep:outfall:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" label="新增" perms="ep:outfall:insert" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>
	<!--表格内容栏-->
	<kt-table permsEdit="ep:outfall:update" permsDelete="ep:outfall:delete"
		:data="pageResult" :columns="columns" 
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
			<el-form-item label="ID" prop="id"  v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="所属企业" prop="companyName">
				<el-autocomplete v-model="dataForm.companyName" :fetch-suggestions="queryCompanyAsync" placeholder="请选择企业名称" 
				@select="handleCompanySelect" style="width: 100%;"></el-autocomplete>
			</el-form-item>
			<el-form-item label="行政区划" prop="district">
				<el-cascader v-model="dataForm.district" :options="districtsTree" :props="{ checkStrictly: true }" style="width: 100%;"></el-cascader>
			</el-form-item>
			<el-form-item label="名称" prop="name">
				<el-input v-model="dataForm.name" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="简称" prop="abbreviation">
				<el-input v-model="dataForm.abbreviation" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="type">
				<el-select v-model="dataForm.type" placeholder="请选择" @change="handleTypeChange" style="width: 100%;">
					<el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="平台ID" prop="subid">
				<el-input v-model="dataForm.subid" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="produceState">
				<el-select v-model="dataForm.produceState" placeholder="请选择" style="width: 100%;">
					<el-option label="生产" :value="1">生产</el-option>
					<el-option label="停产" :value="0">停产</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input-number v-model="dataForm.sort" :min="0" style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-form-item label="污染物" prop="pollutantIds">
				<el-checkbox-group v-model="dataForm.pollutantIds">
					<el-checkbox v-for="item in pollutants" :key="item.id" :label="item.id" :value="item.id">{{item.name}}</el-checkbox>
				</el-checkbox-group>
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
import store from '@/store'
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
				{prop:"companyName", label:"所属企业", minWidth:100},
				{prop:"district", label:"行政区划", minWidth:100, formatter:this.districtFormatter},
				{prop:"name", label:"名称", minWidth:100},
				{prop:"abbreviation", label:"简称", minWidth:50},
				{prop:"type", label:"类型", minWidth:50, formatter:this.typeFormatter},
				{prop:"subid", label:"平台ID", minWidth:50},
				{prop:"produceState", label:"状态", minWidth:50, formatter:this.stateFormatter},
				{prop:"sort", label:"排序", minWidth:50}
			],
			pageRequest: { pageNumber: 1, pageSize: 10 },
			pageResult: {},

			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				name: [
					{ required: true, message: '请输入名称', trigger: 'blur' }
				],
				type: [
					{ required: true, message: '请选择类型', trigger: 'blur' }
				],
				sort: [
					{ required: true, message: '请输入排序', trigger: 'blur' }
				],
				subid: [
					{ required: true, message: '请输入平台ID', trigger: 'blur' }
				],
				produceState: [
					{ required: true, message: '请选择状态', trigger: 'change' }
				],
				companyId: [
					{ required: true, message: '请选择企业', trigger: 'change' }
				],
				companyName: [
					{ required: true, message: '请选择企业', trigger: 'change' }
				],
				district: [
					{ required: true, message: '请选择行政区划', trigger: 'change' }
				],
			},
			// 新增编辑界面数据
			dataForm: {
				id: 0,
				type: '',
				sort: 1,
				pollutantIds: []
			},
			districts: [],
			districtsTree: [],
			types: [],
			pollutants: []
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.name = this.filters.name
			if (this.filters.companyName !== ""){
				this.pageRequest.companyId = this.filters.companyId
			}else{
				this.pageRequest.companyId = ""
			}
			this.$api.outfall.page(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 删除
		handleDelete: function (data) {
			this.$api.outfall.deleteById(data.ids).then(data!=null?data.callback:'')
		},
		// 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.editLoading = false
			this.pollutants=[]
			this.dataForm = {
				district: '',
				type: '',
				sort: 0,
				pollutantIds: [],
				produceState: 1
			}
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
			this.operation = false
			this.editLoading = true
			this.pollutants=[]
			this.$api.outfall.get({id:params.row.id}).then((res) => {
				if(res.code == 200) {
					this.dataForm = Object.assign({}, res.data)
					this.listPollutant(this.dataForm.type)			
				} else {
					this.$message({message: res.message, type: 'error', duration: 10000, showClose: true})
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
					if(Array.isArray(params.district)){
						let len = params.district.length;
						params.district = params.district[len-1]
					}

					// 将污染物拼接成字符串
					if(params.pollutantIds != null && params.pollutantIds.length > 0){
						params.pollutantIds = params.pollutantIds.join(',')
					}else{
						params.pollutantIds = []
					}

					if(this.operation){
						this.$api.outfall.insert(params).then((res) => {
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
						this.$api.outfall.update(params).then((res) => {
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
		//企业名称
		handleCompanySelectQuery(item){
			this.filters.companyId = item.id
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
		// 获取排放口类型
		listType: function () {
			this.$api.dictionary.listByType({'type':'排放口类型'}).then((res) => {
				this.types = res.data
			})
		},
		// 排放口类型格式化
		typeFormatter: function (row, column, cellValue, index){
			let result = ""
			let value = row[column.property]
			for(let i=0, len=this.types.length; i<len; i++) {
				if(this.types[i].value === value) {
					result = this.types[i].label
					break
				}
			}
          	return result
      	},
		stateFormatter: function (row, column, cellValue, index){
			let result = ""
			let value = row[column.property]
			if (value === 1){
				result = "生产"
			}else if (value === 0){
				result = "停产"
			}else{
				result = ""
			}
          	return result
      	},
		// 获取污染物
		listPollutant: function (type) {
			this.$api.pollutant.getByType({'type': type}).then((res) => {
				if (this.operation){
					for (let i = 0; i < res.data.length; i++) {
						this.dataForm.pollutantIds.push(res.data[i].id)
					}
				}
				this.pollutants = res.data
			})
		},
		//选中企业，查询企业的排序
		handleCompanySelect(item){
			this.dataForm.companyId = item.id
			this.$api.outfall.getMaxSort({'companyId': item.id}).then((res) => {
				this.dataForm.sort = res.data
			})
		},
		//选中类型，查询该类型包含的污染物
		handleTypeChange(item){
			this.listPollutant(item)
		},
		queryCompanyAsync(companyName, cb) {
			this.$api.company.listPage({name:companyName}).then((res) => {
				let companies = res.data
				if(Array.isArray(companies)){
					for(let i=0; i<companies.length; i++){
						companies[i].value = companies[i].name
					}
					cb(companies)
				}
			})
		}
	},
	mounted() {
		this.districtsTree = store.state.app.districtsTree
		this.districts = store.state.app.districts
		this.listType()
	}
}
</script>

<style scoped>

</style>