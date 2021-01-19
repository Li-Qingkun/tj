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
				<kt-button icon="fa fa-search" label="查询" perms="ep:led:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" label="新增" perms="ep:led:insert" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>
	<!--表格内容栏-->
	<kt-table permsDetails="ep:led:view" permsEdit="ep:led:update" permsDelete="ep:led:delete"
		:data="pageResult" :columns="columns" 
		@findPage="findPage" @handleDetails="handleDetails" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="120px" :rules="dataFormRules" ref="dataForm" :size="size">
			<el-form-item label="ID" prop="id"  v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="企业名称" prop="companyName">
				<el-autocomplete v-model="dataForm.companyName" :fetch-suggestions="queryCompanyAsync" placeholder="请选择企业名称" 
				@select="handleCompanySelect" style="width: 100%;"></el-autocomplete>
			</el-form-item>
			<el-form-item label="电子屏名称" prop="name">
				<el-input v-model="dataForm.name" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="电子屏类型" prop="type">
				<el-select v-model="dataForm.type" placeholder="请选择" style="width: 100%;">
					<el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否语音" prop="audio">
				<el-radio v-model="dataForm.audio" label="1">是</el-radio>
  				<el-radio v-model="dataForm.audio" label="0">否</el-radio>
			</el-form-item>
			<el-form-item label="MAC" prop="mac">
				<el-input v-model="dataForm.mac" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="污染物起始位置" prop="pollutantIndex">
				<el-input-number v-model="dataForm.pollutantIndex" :min="0" :max="15" style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-form-item label="广告位起始位置" prop="advertIndex">
				<el-input-number v-model="dataForm.advertIndex" :min="0" :max="15" style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-form-item label="广告行数" prop="advertRows">
				<el-input-number v-model="dataForm.advertRows" :min="0" :max="15-dataForm.advertIndex" style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-form-item label="宽度" prop="width">
				<el-input-number v-model="dataForm.width" :min="0" style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-form-item label="高度" prop="height">
				<el-input-number v-model="dataForm.height" :min="0" style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-form-item label="排放口" prop="outfallLedList">
				<el-tabs v-model="tabsSelect" @tab-click="handlePollutantSelect" :tab-position="'top'" style="height: 120px;">
					<el-tab-pane v-for="item in outfalls" :name="item.id" :key="item.id" :label="item.name" :value="item.id">
						<el-checkbox-group v-model="pollutantName">
							<el-checkbox v-for="p in pollutants" @change="cbxChange(p.id)" :key="p.id" :label="p.name" :value="p.id">{{p.name}}</el-checkbox >
						</el-checkbox-group>
					</el-tab-pane>
				</el-tabs>
			</el-form-item>
			<el-form-item label="安装日期" prop="installDate">
				<el-date-picker v-model="dataForm.installDate" type="date" placeholder="安装日期" style="width: 100%;"></el-date-picker>
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
				<th>企业名称</th>
				<td>
					{{dataTable.companyName}}
				</td>
			</tr>
			<tr>
				<th>电子屏名称</th>
				<td>{{dataTable.name}}</td>
			</tr>
			<tr>
				<th>电子屏类型</th>
				<td>{{dataTable.type}}</td>
			</tr>
			<tr>
				<th>是否语音</th>
				<td>{{dataTable.audio}}</td>
			</tr>
			<tr>
				<th>MAC</th>
				<td>{{dataTable.mac}}</td>
			</tr>
			<tr>
				<th>污染物起始位置</th>
				<td>{{dataTable.pollutantIndex}}</td>
			</tr>
			<tr>
				<th>广告位起始位置</th>
				<td>{{dataTable.advertIndex}}</td>
			</tr>
			<tr>
				<th>广告行数</th>
				<td>{{dataTable.advertRows}}</td>
			</tr>
			<tr>
				<th>宽度</th>
				<td>{{dataTable.width}}</td>
			</tr>
			<tr>
				<th>高度</th>
				<td>{{dataTable.height}}</td>
			</tr>
			<tr>
				<th>排放口</th>
				<td>
					<table v-for="o in outfallPollutants" :key="o.outfallName" :style="'width:100%;margin:10px 0'">
						<caption><b>{{o.outfallName}}</b></caption>
						<tr>
							<td style="padding:2px">{{o.pollutantNames}}</td>
						</tr>
					</table>
				</td>
			</tr>
			<tr>
				<th>安装日期</th>	
				<td>{{dataTable.installDate}}</td>
			</tr>
			<tr>
				<th>信号强度</th>	
				<td>{{dataTable.signal}}</td>
			</tr>
			<tr>
				<th>心跳时间</th>	
				<td>{{dataTable.heartTime}}</td>
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
import { formatDate } from "@/utils/datetime"
import { formatTime } from "@/utils/datetime"
export default {
	components:{
			KtTable,
			KtButton
	},
	data() {
		return {
			size: 'small',
			filters: {
				companyId: ''
			},
			tabsSelect: '',
			columns: [
				{prop:"name", label:"电子屏名称", minWidth:100},
				{prop:"type", label:"电子屏类型", minWidth:100, formatter:this.typeFormatter},
				{prop:"mac", label:"MAC", minWidth:100},
				{prop:"companyName", label:"所属企业", minWidth:100},
				{prop:"signal", label:"信号强度", minWidth:80},
				{prop:"heartTime", label:"心跳时间", minWidth:80, formatter:this.heartTimeFormatter}
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
				mac: [
					{ required: true, message: '请输入MAC', trigger: 'blur' }
				],
				companyName: [
					{ required: true, message: '请选择企业', trigger: 'change' }
				],
				type: [
					{ required: true, message: '请选择电子屏类型', trigger: 'blur' }
				],
				installDate: [
					{ required: true, message: '请选择安装日期', trigger: 'blur' }
				]
			},
			// 新增编辑界面数据
			dataForm: {
				id: 0
			},
			//排放口列表
			outfalls: [],
			//电子屏类型
			types: [],
			pollutantId: 0,
			outfallLedList: [],
			//污染物列表
			pollutantsList: [],
			//污染物数据checkbox显示
			pollutants: [],
			//排放口选择的污染物  名称
			pollutantName: [],
			//所有排放口绑定的污染物
			outfallPollutantList: [],
			//电子屏需要显示的排放口绑定的污染物
			outfallPollutant: [],
			//当前选中的排放口id
			outfallId: '',
			//详情页数据
			dataTable: {}, 
			// 详情界面是否显示
			detailsVisible: false,
			outfallPollutants: []
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			if (this.filters.companyName !== ""){
				this.pageRequest.companyId = this.filters.companyId
			}else{
				this.pageRequest.companyId = ""
			}
			this.$api.led.page(this.pageRequest).then((res) => {
				this.pageResult = res.data				
			}).then(data != null ? data.callback : '')
		},
		// 删除
		handleDelete: function (data) {
			this.$api.led.deleteById(data.ids).then(data != null ? data.callback : '')
		},
		// 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.editLoading = false
			this.dataForm = {
				pollutantIndex: 0,
				advertIndex: 0,
				advertRows: 0,
				width: 0,
				height: 0,
				type: 'public',
				audio: '0',
				installDate: new Date()
			}
			this.outfalls = []
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
			this.operation = false
			this.editLoading = true
			this.outfallPollutant = []
			this.$api.led.get({id:params.row.id}).then((res) => {
				if(res.code == 200) {
					this.dataForm = Object.assign({}, res.data)
					this.dataForm.audio = this.dataForm.audio.toString()
					this.dataForm.width = this.dataForm.width.toString()
					this.dataForm.height = this.dataForm.height.toString()
					this.outfallId = this.dataForm.outfallLedList[0].outfallId
					this.listOutfall(this.dataForm.companyId)
				} else {
					this.$message({message: res.message, type: 'error', duration: 10000, showClose: true})
				}
			})
			this.editLoading = false
		},
		// 显示详情界面
		handleDetails: function (params) {
			this.detailsVisible = true
			this.outfallPollutants = []
			this.$api.led.get({id:params.row.id}).then((res) => {
				if(res.code == 200) {
					this.dataTable = Object.assign({}, res.data)
					for(let i = 0, len = this.types.length; i < len; i++) {
						if(this.types[i].value === this.dataTable.type) {
							this.dataTable.type = this.types[i].label
							break
						}
					}
					this.dataTable.audio = this.dataTable.audio === 1 ? "是" : "否"
					this.$api.outfall.listByCompanyId({companyId:this.dataTable.companyId}).then((ress) => {
						this.outfalls = ress.data
						let map = new Map()
						for (let i = 0; i < this.dataTable.outfallLedList.length; i++) {
							let outfallName = this.outfallNameByoutfallId(this.dataTable.outfallLedList[i].outfallId)
							let pollutantName = this.pollutantNameBypollutantId(this.dataTable.outfallLedList[i].pollutantId)
							map.has(outfallName) ? map.set(outfallName, map.get(outfallName) + "，" + pollutantName) : map.set(outfallName, pollutantName)
						}
						for (let entry of map) { 
							this.outfallPollutants.push({outfallName:entry[0], pollutantNames:entry[1]})
						}
					})
					this.dataTable.installDate = formatDate(this.dataTable.installDate)
					if (this.dataTable.heartTime === null){
						this.dataTable.heartTime = ""
					}else{
						this.dataTable.heartTime = formatTime(new Date(this.dataTable.heartTime))
					}
				} else {
					this.$message({message: res.message, type: 'error', duration: 10000, showClose: true})
				}
			})
		},
		// 新增/编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.editLoading = true
					let params = Object.assign({}, this.dataForm)
					//将污染物和排放口绑定后的需要显示数据放回数组
					let array = []
					for (let i = 0; i < this.outfallPollutant.length; i++) {
						for (let j = 0; j < this.outfallPollutant[i].pollutents.length; j++) {
							if(this.outfallPollutant[i].pollutents[j].checked){
								let outfallLed = {}
								outfallLed.outfallId = this.outfallPollutant[i].outfallId
								outfallLed.pollutantId = this.outfallPollutant[i].pollutents[j].id
								outfallLed.pollutantSort = this.outfallPollutant[i].pollutents[j].showOrder
								array.push(outfallLed)
							}
						}
					}
					params.outfallLedList = array

					if(this.operation){
						this.$api.led.insert(params).then((res) => {
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
						this.$api.led.update(params).then((res) => {
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
		handleCompanySelectQuery(item){
			this.filters.companyId = item.id
		},
		//选中企业，查询企业的所有排放口
		handleCompanySelect(item){
			this.dataForm.companyId = item.id
			this.listOutfall(item.id)
		},
		//选中排放口，查询排放口所绑定的所有污染物
		handlePollutantSelect(tab, event){
			this.listPollutant(tab.name)
		},
		queryCompanyAsync(companyName, cb) {
			this.$api.company.listPage({name:companyName}).then((res) => {
				let companies = res.data
				if(Array.isArray(companies)){
					for(let i = 0; i < companies.length; i++){
						companies[i].value = companies[i].name
					}
					cb(companies)
				}
			})
		},
		// 获取排放口
		listOutfall: function (companyId) {
			this.$api.outfall.listByCompanyId({'companyId': companyId}).then((res) => {
				this.outfalls = res.data
				//根据排放口id循环遍历获取所有id绑定的污染物`
				for (let i = 0; i < this.outfalls.length; i++) {
					let element = this.outfalls[i]
					let outfallPollutant = {}
					outfallPollutant.outfallId=element.id
					this.$api.pollutant.listByOutfallId({'outfallId': element.id}).then((res) => {
						outfallPollutant.pollutents = res.data
						this.outfallPollutantList[i] = outfallPollutant
						this.outfallPollutant[i] = outfallPollutant
						if(this.operation){
							//给所有污染物添加checked属性
							this.outfallPollutant[i].pollutents.map(item => {
								item.checked = true
								return item
							})
						}else{
							//给所有污染物添加checked属性
							this.outfallPollutant[i].pollutents.map(item => {
								item.checked = false
								return item
							})
							for (let j = 0; j < this.dataForm.outfallLedList.length; j++) {
								if(element.id === this.dataForm.outfallLedList[j].outfallId){
									for (let z = 0; z < this.outfallPollutant[i].pollutents.length; z++) {
										if (this.outfallPollutant[i].pollutents[z].id === this.dataForm.outfallLedList[j].pollutantId)
										this.outfallPollutant[i].pollutents[z].checked = true									
									}
								}
							}
						}
						this.tabsSelect = this.outfalls[0].id
						this.listPollutant(this.outfalls[0].id)
					})
				}
			})
		},
		// 获取排放口绑定污染物
		listPollutant: function (outfallId) {
			this.outfallId = outfallId
			for (let i = 0; i < this.outfallPollutantList.length; i++) {
				if(this.outfallPollutantList[i].outfallId === outfallId)
				{
					this.pollutants = this.outfallPollutantList[i].pollutents
				}
			}
			for (let i = 0; i < this.outfallPollutant.length; i++) {
				if(this.outfallPollutant[i].outfallId === outfallId){
					let z = []
					for (let j = 0; j < this.outfallPollutant[i].pollutents.length; j++) {						
						if(this.outfallPollutant[i].pollutents[j].checked){
							z.push(this.outfallPollutant[i].pollutents[j].name)
						}
					}
					this.pollutantName = z
				}
			}
		},
		cbxChange: function (item){
			for (let i = 0; i < this.outfallPollutant.length; i++) {
				if(this.outfallPollutant[i].outfallId === this.outfallId){
					for (let j = 0; j < this.outfallPollutant[i].pollutents.length; j++) {
						if(this.outfallPollutant[i].pollutents[j].id === item){
							if(!this.outfallPollutant[i].pollutents[j].checked){
								let a = this.outfallPollutant[i].pollutents[j]
								a.checked = true
								this.$set(this.outfallPollutant[i].pollutents, j, a)
							}else if(this.outfallPollutant[i].pollutents[j].checked){
								let a = this.outfallPollutant[i].pollutents[j]
								a.checked = false
								this.$set(this.outfallPollutant[i].pollutents, j, a)
							}
						}
					}
				}
			}
		},
		// 获取电子屏类型
		listType: function (companyId) {
			this.$api.dictionary.listByType({'type': '电子屏类型'}).then((res) => {
				this.types = res.data
			})
		},
		// 获取所有污染物
		listPollutantsList: function (companyId) {
			this.$api.pollutant.list().then((res) => {
				this.pollutantsList = res.data
			})
		},
		//根据污染物id返回污染物名称
		pollutantNameBypollutantId:function(pollutantId){
			let name = ""
			for (let i = 0; i < this.pollutantsList.length; i++) {
				if(this.pollutantsList[i].id === pollutantId){
					name = this.pollutantsList[i].name
				}
			}
			return name
		},
		//根据排放口id返回排放口名称
		outfallNameByoutfallId:function(outfallId){
			let name = ""
			for (let i = 0; i < this.outfalls.length; i++) {
				if(this.outfalls[i].id === outfallId){
					name = this.outfalls[i].name
				}
			}
			return name
		},
		//电子屏类型格式化
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
		heartTimeFormatter: function (row, column, cellValue, index){
          	let result = ""
			let value = row[column.property]
			if (value === null){
				result = ""
			}else{
				result = formatTime(new Date(value))
			}
          	return result
      	},
	},
	mounted() {
		this.listType()
		this.listPollutantsList()
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