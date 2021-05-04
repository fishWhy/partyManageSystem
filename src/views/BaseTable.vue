<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            

             <el-container>
                <el-aside width="220px">
                    <el-card id="filter_314" shadow="always" >
                        <template #header >
                          <div style="height:20px;line-height:20px;" class="el-icon-s-operation">
                            筛  选
                          </div>
                        </template>
                        <div class="ces-search">
                            <el-form  label-position="left" label-width="70px" id="selectForm">
                                <el-form-item v-for='item in searchForm' :label="item.label" :key='item.prop'  size='mini'>
                                   <!-- 输入框 -->
                                    <el-input v-if="item.type==='Input'" v-model="query[item.prop]" class="el_side_style"  ></el-input>
                                    <!-- 下拉框 -->
                                    <el-select v-if="item.type==='Select'" v-model="query[item.prop]"  class="el_side_style"  >
                                        <el-option v-for="op in item.options" :label="op.label" :value="op.value" :key="op.value" ></el-option>
                                    </el-select>
                                     <!-- 单选 -->
                                    <el-radio-group v-if="item.type==='Radio'" v-model="query[item.prop]" class="el_side_style">
                                        <el-radio v-for="ra in item.radios" :label="ra.label" :key="'select'+ra.label" style="width: 50px;font-size:smaller;">{{ra.value}}</el-radio>
                                    </el-radio-group>

                                    <!-- 日期 -->
                                    <el-date-picker  v-if="item.type==='YMR'" :default-value="item.default_time" v-model="query[item.prop]" style="width:130px;font-size:smaller" class="el_side_style"></el-date-picker>

                                </el-form-item>
                            </el-form>
                            <el-form inline>
                                <el-form-item>
                                    <el-button type="primary" size="mini" @click="resetQueryData">重置</el-button>
                                </el-form-item>
                                <el-form-item style="margin-left:20px">
                                    <el-button type="success" size="mini" @click="requeryData">查询</el-button>
                                </el-form-item>

                            </el-form>
                        </div>
                      
                    </el-card>
                    

                </el-aside>
                <el-main>
                    <div class="handle-box">
                        <el-button
                            type="primary"
                            icon="el-icon-delete"
                            class="handle-del mr10"
                            @click="delAllSelection"
                        >批量删除</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
                        <el-button type="primary" icon="el-icon-printer" @click="getExcel">导出Excel</el-button>
                        <el-button type="primary" icon="el-icon-paperclip" @click="importVisible=true">导入Excel</el-button>
                        <div style="display:inline-block;margin-left:10px">
                            <el-input v-model="searchQuery" placeholder="学号" class="handle-input mr10"></el-input>
                            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                        </div>
                        
                    </div>



                     <el-table
                        :data="tableDataShow"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange"
                        id="el_table_314"
                    >
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column prop="id" label="学号"  align="center"></el-table-column>
                        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                        <el-table-column prop="gender" label="性别" align="center"></el-table-column>
                        <el-table-column prop="birthday" label="生日" align="center"></el-table-column>
                        <el-table-column prop="major" label="专业" align="center"></el-table-column>
                        <el-table-column prop="proED" label="学历" align="center"></el-table-column>
                        <el-table-column prop="political" label="政治面貌" align="center"></el-table-column>
                        <el-table-column prop="time" label="入党时间" align="center"></el-table-column>

                        <el-table-column label="操作" width="180" align="center">
                            <template #default="scope">
                                <el-button
                                    type="text"
                                    icon="el-icon-edit"

                                    @click="handleEdit(scope.$index, scope.row)"
                                >编辑</el-button>
                                <el-button
                                    type="text"
                                    icon="el-icon-delete"
                                    class="red"

                                    @click="handleDelete(scope.$index, scope.row)"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    
                    <div class="pagination">
                        <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :current-page="pageIndex"
                            :page-size="pageSize"
                            :total="itemTotal"
                            @current-change="currentPageChange"
                           
                        ></el-pagination>
                    </div>
                </el-main>
            </el-container>
           
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="30%">
            <el-form  label-position="left" label-width="70px" size="small">
                <div id="formAdd">
                    <el-form-item v-for='item in addForm' :label="item.label" :key='item.prop' >
                        <!-- 输入框 -->
                        <el-input v-if="item.type==='Input'" v-model="form[item.prop]" class="addFormDialog_314"></el-input>
                        <!-- 下拉框 -->
                        <el-select v-if="item.type==='Select'" v-model="form[item.prop]" class="addFormDialog_314">
                            <el-option v-for="op in item.options" :label="op.label" :value="op.value" :key="op.value" ></el-option>
                        </el-select>
                         <!-- 单选 -->
                        <el-radio-group v-if="item.type==='Radio'" v-model="form[item.prop]">
                            <el-radio v-for="ra in item.radios" :label="ra.label" :key="'select'+ra.label" class="addFormDialog_314" >{{ra.value}}</el-radio>
                        </el-radio-group>
                        <!-- 日期 -->
                        <el-date-picker  size="small" class="addFormDialog_314" style=" width: 200px;" v-if="item.type==='YMR'" :default-value="item.default_time" v-model="form[item.prop]"></el-date-picker>
                        </el-form-item>
                </div>                
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>



         <!-- 添加新用户 -->
        <el-dialog title="添加" v-model="addVisible" width="30%">
           
                <el-form  label-position="left" label-width="70px" size="small">
                    <div id="formAdd">
                        <el-form-item v-for='item in addForm' :label="item.label" :key='item.prop' >
                            <!-- 输入框 -->
                            <el-input v-if="item.type==='Input'" v-model="form[item.prop]" class="addFormDialog_314"></el-input>
                            <!-- 下拉框 -->
                            <el-select v-if="item.type==='Select'" v-model="form[item.prop]" class="addFormDialog_314">
                                <el-option v-for="op in item.options" :label="op.label" :value="op.value" :key="op.value" ></el-option>
                            </el-select>
                             <!-- 单选 -->
                            <el-radio-group v-if="item.type==='Radio'" v-model="form[item.prop]">
                                <el-radio v-for="ra in item.radios" :label="ra.label" :key="'select'+ra.label" class="addFormDialog_314" >{{ra.value}}</el-radio>
                            </el-radio-group>
                            <!-- 日期 -->
                            <el-date-picker  size="small" class="addFormDialog_314" style=" width: 200px;" v-if="item.type==='YMR'" :default-value="item.default_time" v-model="form[item.prop]"></el-date-picker>
                            </el-form-item>
                    </div>

                </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancleAdd">取 消</el-button>
                    <el-button type="primary" @click="saveAdd">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 导入excel -->
        <el-dialog title="导入Excel" v-model="importVisible" width="30%" >
            <div id="elD_314">
                <div>
                    <el-tag>导入Excel格式要求</el-tag>
                    <div style="margin-top:10px">
                        导入的Excel要包含：学号、姓名、性别、生日、专业、学历、政治面貌和入党时间 这几个类别。
                        
                        <span style="color:red" >具体格式可见模板下载按钮中的例子。</span>
                         <el-button type="danger" icon="el-icon-download" @click="getExcelTemplate" size="mini">模板下载</el-button>
                    </div>
                </div>
                <div style="margin-top:20px">
                    <div  style="margin-bottom:10px"><el-tag>导入Excel文件</el-tag></div>
                    <el-radio v-model="impExcel" label="1" border>导入新的Excel</el-radio>
                    <el-radio v-model="impExcel" label="2" border>添加Excel</el-radio>
                    <div style="margin: 10px 0 10px 0" >
                        <span v-show="!impExcel||impExcel=='1'">导入新的Excel替换当前表格所有内容</span>
                        <span v-show="impExcel=='2'">导入Excel添加到当前表格的后面</span>
                    </div>
                    
                    <el-upload
                        class="upload-demo"
                        action=""
                        :on-change="handleExcelChange"
                        :before-remove="handleBeforeRemove"
                        :on-remove = "handleExcelRemove"
                        :on-exceed="handleExcelExceed"
                        :limit="impExcel==='1'?1:1000"
                        :multiple="impExcel==='1'?false:true"
                        :file-list="fileListUpload"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                        :auto-upload="false"
                        id="el_upload_314"
                        ref="el_upload_314">
                        <el-button size="small" type="primary" icon="el-icon-upload">点击导入excel</el-button>
                        
                        <template #tip>
                            <div  class="el-upload__tip">
                                <span>最 多只 能 上 传{{impExcel==='1'?1:1000}}个xlsx/xls文 件</span>
                                <el-button style="margin-left:30px" @click="deleteAllUpload" type="danger" size="mini">清除已上传文件列表</el-button>
                            </div>
                            
                        </template>
                    </el-upload>
                </div>
                
            </div>
            
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="importVisible=false">取 消</el-button>
                    <el-button type="primary" @click="saveUploadExcel">确 定</el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>

<script>
// import { fetchData,setNewData } from "../api/index";
import {addData,cInfor,deltData,fetchData,setNewData} from "../api/index";
import { downLoadExcel,importfxx} from "../utils/excel/upDownExcel.js";
export default {
    name: "basetable",
    data() {
        return {
            //筛选表单
            searchForm:[
                {label:'学号',prop:'id',type:'Input'},
                {label:'姓名',prop:'name',type:'Input'},
                {label:'性别',prop:'gender',type:'Select',options:[{value:'',label:'全部'},{value:'男',label:'男'},{value:'女',label:'女'}]},
                {label:'生日',prop:'birthday',type:'YMR',default_time:new Date().setFullYear((new Date().getFullYear()-25))},
                {label:'专业',prop:'major',type:'Select',options:[{value:'',label:'全部'},{value:'软件工程',label:'软件工程'},{value:'计算机软件',label:'计算机软件'}]},
                {label:'学历',prop:'proED',type:'Select',options:[{value:'',label:'全部'},{value:'大学',label:'大学'},{value:'研究生',label:'研究生'},{value:'博士',label:'博士'},{value:'3',label:'其他'}]},
                {label:'政治面貌',prop:'political',type:'Select',options:[{value:'',label:'全部'},{value:'党员',label:'党员'},{value:'预备党员',label:'预备党员'},{value:'入党积极分子',label:'入党积极分子'},{value:'其他',label:'其他'}]},
                {label:'入党时间',prop:'time',type:'YMR',default_time:new Date().setFullYear((new Date().getFullYear()-10))},
            ],
            //筛选/搜索数据时的条件
            query: {
                id: "",
                name: "",
                gender:'',
                birthday:null,
                major:'',
                proED:'',
                political:'',
                time:null,
            },


            //添加新用户表单
            addForm:[
                {label:'学号',prop:'id',type:'Input'},
                {label:'姓名',prop:'name',type:'Input'},
                {label:'性别',prop:'gender',type:'Select',options:[{value:'男',label:'男'},{value:'女',label:'女'}]},
                {label:'生日',prop:'birthday',type:'YMR',default_time:new Date().setFullYear((new Date().getFullYear()-25))},
                {label:'专业',prop:'major',type:'Select',options:[{value:'软件工程',label:'软件工程'},{value:'计算机软件',label:'计算机软件'}]},
                {label:'学历',prop:'proED',type:'Select',options:[{value:'大学',label:'大学'},{value:'研究生',label:'研究生'},{value:'博士',label:'博士'},{value:'3',label:'其他'}]},
                {label:'政治面貌',prop:'political',type:'Select',options:[{value:'党员',label:'党员'},{value:'预备党员',label:'预备党员'},{value:'入党积极分子',label:'入党积极分子'},{value:'其他',label:'其他'}]},
                {label:'入党时间',prop:'time',type:'YMR',default_time:new Date().setFullYear((new Date().getFullYear()-10))},
            ],
            //新增用户或编辑用户信息的Dialog对话框对应数据
            form: {
                id: "",
                name: "",
                gender:'',
                birthday:'',
                major:'',
                proED:'',
                political:'',
                time:'',
            },

            // 编辑用户信息对应的行，与tableDataShow相对应
            idx: -1,
            editVisible: false,


            id: -1,

            //搜索
            searchQuery:'',

            //文件导出
            listTitle:'',
            tableTitle:'',

            //文件导入
            fileTemp:'',
            file:'',
            fileList:[],

            //添加新数据
            addVisible:false,

            //导入Excel
            importVisible: false,
            impExcel: '1',
            // maxNumFile:10,

            
            

            //从后台获取的关于当前页面的所有数据
            tableData: [],


            //显示表格时相关数据
            pageTotal: 1,
            pageIndex: 1,
            pageSize: 10,
            tableDataShow:[],

            //保存那些被选中的键值
            selectedItem:{},//保存被选中的项，以每项的id为键,值为true
            // 设置一个锁，防止换页时自动更改selectedItem
            selectedItemLock:false,

        };
    },
    created() {
        this.getData();
    },
    computed:{
        itemTotal: function () {
            return this.tableData.length;
        }
    },
    watch:{
        impExcel(){
            this.$refs.el_upload_314.clearFiles();
            this.fileList = null;
        },
        pageIndex(newVal){
            this.selectedItemLock = true;
            let start = Math.max((newVal-1)*this.pageSize,0), end = Math.min((newVal)*this.pageSize,this.tableData.length);
            this.tableDataShow = this.tableData.slice(start,end);
            
            this.$nextTick(()=>{
                for(let i=0;i<this.tableDataShow.length;i++){
                    if(this.selectedItem[this.tableDataShow[i].id]){
                        this.$refs.multipleTable.toggleRowSelection(this.tableDataShow[i],true);
                        // console.log(`the new page include${this.tableDataShow[i].id}`)
                    }
                }
                this.selectedItemLock = false;
            });
        }
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            // 转换日期的格式到 Y-M-D格式
            if(this.query.birthday){
                let y = this.query.birthday.getFullYear(),m=this.query.birthday.getMonth()+1,d=this.query.birthday.getDate();
                if(m<=9)m = "0" + m;
                if(d<=9)d="0"+d;
                this.query.birthday = y + '-' + m + '-' + d;
            }
            if(this.query.time){
                let y = this.query.time.getFullYear(),m=this.query.time.getMonth()+1,d=this.query.time.getDate();
                if(m<=9)m = "0" + m;
                if(d<=9)d="0"+d;
                this.query.time = y + '-' + m + '-' + d;
            }
            console.log('fetchData:',this.query);

            return fetchData(this.query).then(res => {
                console.log('res:',res);
                this.tableData = res.list;
                this.listTitle = res.listTitle;
                this.tableTitle = res.tableTitle;


                this.pageSize = res.perPageNum;
                this.pageTotal = Math.max(Math.floor(this.tableData.length/this.pageSize),1);

                // 只要查询了数据永远从第1页开始
                this.pageIndex = 1;

                let start = Math.max((this.pageIndex-1)*this.pageSize,0), end = Math.min(this.pageIndex*this.pageSize,this.tableData.length);
                this.tableDataShow = this.tableData.slice(start,end);                       

            });
        },

        //改变当前页时，回调
        currentPageChange(val){
            this.pageIndex = val;
        },
        // 触发搜索按钮
        handleSearch() {
            //注意这里的this.searchQuery与this.query.id是分离的
            let obj = {};
            for(let key in this.query){
                obj[key]="";
            }
            obj.id = this.searchQuery;
            

            fetchData(obj).then(res => {
                console.log('res:',res);
                this.tableData = res.list;
                this.listTitle = res.listTitle;
                this.tableTitle = res.tableTitle;


                this.pageSize = res.perPageNum;
                this.pageTotal = Math.max(Math.floor(this.tableData.length/this.pageSize),1);

                // 只要查询了数据永远从第1页开始
                this.pageIndex = 1;

                let start = Math.max((this.pageIndex-1)*this.pageSize,0), end = Math.min(this.pageIndex*this.pageSize,this.tableData.length);
                this.tableDataShow = this.tableData.slice(start,end);                       

            });
        },


        // 删除操作
        handleDelete(index,row) {
            // 二次确认删除
            this.$confirm("确定要删除吗？", "提示", {
                type: "warning"
            })
                .then(() => {

                    // 传消息给后台删除数据
                    deltData([row.id]);


                    // 更新this.tableData和this.tableDataShow中的对应数据

                    for(let i=this.tableData.length-1;i>=0;i--){
                        if(this.tableData[i].id === row.id){
                            this.tableData.splice(i,1);
                        } 
                    }

                this.pageTotal = Math.max(Math.floor(this.tableData.length/this.pageSize),1);
                // 如果当前页超过新的最后一页，则更新当前页为最后一页
                if(this.pageIndex>this.pageTotal){
                    this.pageIndex = this.pageTotal;
                    return;//由于 this.pageIndex改变会触发watch中的函数，因此可以在这里就返回。
                }
                let start = Math.max((this.pageIndex-1)*this.pageSize,0), end = Math.min(this.pageIndex*this.pageSize,this.tableData.length);
                this.tableDataShow = this.tableData.slice(start,end);                 
                this.$message.success("删除成功");
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            //this.selectedItemLock起到加锁的作用，防止在更改表格数据时触发该函数，误更改this.selectedItem
            if(this.selectedItemLock) return;

            let idObj = {};
            val.forEach(item=>{
                idObj[item.id]=true;
            })
            this.tableDataShow.forEach(item=>{
                if(idObj[item.id]){
                    this.selectedItem[item.id] = true;
                } else if(this.selectedItem[item.id]){
                    console.log('delete')
                    delete this.selectedItem[item.id];
                }
            })

        },
        async delAllSelection() {
            let str = "", deleteIds = Object.keys(this.selectedItem);
            for (let i = 0; i < deleteIds.length; i++) {
                str += deleteIds[i] + " ";
            }

            try{

                // 二次确定删除
                await this.$confirm(`确定要删除吗？您已选中:${str}`, "提示", {type: "warning"});
                
                // 删除后台数据
               await deltData(deleteIds);

                //更新当前页相关的数据
                //更新this.tableData和this.tableDataShow中的对应数据
                 let idObj = {};
                // len = idArr.length
                for (let j = 0; j < deleteIds.length; j++) {
                    idObj[deleteIds[j]] = true;
                }

                for(let i=this.tableData.length-1;i>=0;i--){
                    if(idObj[this.tableData[i].id]){
                        this.tableData.splice(i,1);
                    } 
                }

                //数据都已经删除，更新this.selectedItem为空，将this.selectedItemLock置为false
                this.selectedItem = {},
                this.selectedItemLock = false;
                this.pageTotal = Math.max(Math.floor(this.tableData.length/this.pageSize),1);
                // 如果当前页超过新的最后一页，则更新当前页为最后一页
                if(this.pageIndex>this.pageTotal){
                    this.pageIndex = this.pageTotal;
                    return;//由于 this.pageIndex改变会触发watch中的函数，因此可以在这里就返回。
                }
                let start = Math.max((this.pageIndex-1)*this.pageSize,0), end = Math.min(this.pageIndex*this.pageSize,this.tableData.length);
                this.tableDataShow = this.tableData.slice(start,end);


                this.$message.success(`${str}被成功删除`)


            }catch(e){
                
                this.$message.error(e);
            }

        },



        // 编辑用户信息
        // 编辑操作
        handleEdit(index, row) {

            // for(let key in this.form){
            //     this.form[key]="";
            // }
            this.idx = index;
            console.log('row:',row);
            //注意这里一定要深拷贝一次。
            this.form = JSON.parse(JSON.stringify(row));

            if(this.form.birthday){
                this.form.birthday = new Date(this.form.birthday);
            }
            if(this.form.time){
                this.form.time = new Date(this.form.time);
            }

            this.editVisible = true;
            console.log('the new of edit form: ',this.form);
        },
        // 保存编辑
        async saveEdit() {
            // 将日期转换成：Y-M-D的型式，例如：2019-01-01
            if(this.form.birthday){
                let y = this.form.birthday.getFullYear(),m=this.form.birthday.getMonth()+1,d=this.form.birthday.getDate();
                if(m<=9)m = "0" + m;
                if(d<=9)d="0"+d;
                this.form.birthday = y + '-' + m + '-' + d;
            }
            if(this.form.time){
                let y = this.form.time.getFullYear(),m=this.form.time.getMonth()+1,d=this.form.time.getDate();
                if(m<=9)m = "0" + m;
                if(d<=9)d="0"+d;
                this.form.time = y + '-' + m + '-' + d;
            }


            try{
                console.log("当前页面第几行",this.idx);
                //将数据提交给后台
                await cInfor(this.form);

                //传给后台成功后，更改本页面中的this.tableData和this.tableDataShow中的对应数据
                this.tableDataShow[this.idx] = this.form;
                let index = (this.pageIndex-1)*this.pageSize + this.idx;
                this.tableData[index] = this.form;


                this.$message.success(`修改id为 ${this.form.id} 的同学的信息成功`);
                this.editVisible = false;
            }catch(e){
                this.$message.error(`修改id为 ${e} 的同学的信息失败`);
            }


            

            
        //     this.editVisible = false;
        //     this.$message.success(`修改第 ${this.idx + 1} 行成功`);
        //     this.$set(this.tableData, this.idx, this.form);
        },
        //取消修改







        //添加新用户
        handleAdd(){
            this.form = {}
            this.addVisible = true;
        },

        // 保存新用户
        async saveAdd() {

             if(this.form.birthday){
                let y = this.form.birthday.getFullYear(),m=this.form.birthday.getMonth()+1,d=this.form.birthday.getDate();
                if(m<=9)m = "0" + m;
                if(d<=9)d="0"+d;
                this.form.birthday = y + '-' + m + '-' + d;
            }
            if(this.form.time){
                let y = this.form.time.getFullYear(),m=this.form.time.getMonth()+1,d=this.form.time.getDate();
                if(m<=9)m = "0" + m;
                if(d<=9)d="0"+d;
                this.form.time = y + '-' + m + '-' + d;
            }

            //首先，检查新添加的用户是否已经存在，如果存在就提示用户
            for(let i=0;i<this.tableData.length;i++){
                if(this.tableData[i].id===this.form.id){
                    this.$message.error(`添加的用户已存在，添加失败`);
                    return;
                }
            }
            //添加用户
            //根据返回结果提示用户是否添加成功
            try{
                let arr = [this.form];
                await addData(arr);
                console.log(this.form);
                this.tableData.push(this.form);
                this.addVisible = false;

                //判断一下是否在最后一页且新增数据后最后一页数据没有满，如果在最后一页就更新tableDataShow
                if((this.pageIndex===this.pageTotal)&&(this.pageSize!==this.tableDataShow.length)){
                    let start = Math.max((this.pageIndex-1)*this.pageSize,0), end = Math.min(this.pageIndex*this.pageSize,this.tableData.length);
                    this.tableDataShow = this.tableData.slice(start,end);
                }

                this.pageTotal = Math.max(Math.floor(this.tableData.length/this.pageSize),1);
                this.$message.success(`添加新用户成功`);
            }catch(e){
                this.$message.error(`添加的用户失败`);
            }            
           
        },
        // 取消添加用户
        cancleAddz(){
             for(let key in this.form){
                this.form[key] = "";
            }
            this.addVisible = false;
        },






        // 重置this.query，查询所有的数据
        resetQueryData(){
            for(let key in this.query){
                this.query[key] = "";
            }
            this.getData();
        },
        // 按照this.query的筛选条件要求，查询数据
        requeryData(){
            this.getData();
        },


        //删除用户
        // handleDelete(index,){

        // }

        


        //excel导入导出操作
        //下载excel
        getExcel(){
            downLoadExcel(this.tableData,this.listTitle,this.tableTitle,'党员信息'); 
        },

        //导入excel
        handleExcelChange(_,fileList){
            this.fileList = fileList;
            console.log('fileList',this.fileList.length);
        },
        handleBeforeRemove(file){
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        handleExcelRemove(file,fileList){
            // this.fileTemp = null
            this.$message.success(`移除了文件 ${ file.name }`)
            this.fileList = fileList;
            console.log('fileList',this.fileList.length);
        },
        handleExcelExceed(files,fileList){
            // console.log('handleExcelExceed')
            this.$message.warning(`当前限制选择 ${this.impExcel==='1'?1:1000} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
        
        },
        async  saveUploadExcel(){
                let tableArray = [];
                let _data = [];
                if(!this.fileList) return;
                // console.log('fileList',this.fileList.length);

                for(let i=0;i<this.fileList.length;i++){
                    try{
                        _data = await importfxx(this.fileList[i].raw,this.listTitle,this.tableTitle);
                        
                        //》》》》这里其实涉及到一个问题，我们通过importfxx从表格获取的数据不一定都是字符串类型的数据，
                        // 但我们默认存储在tableData和tableDataShow中的对象的数据都是字符串，因此这里需要转换一下
                        _data.forEach(item=>{
                            for(let k in item){
                                if(Object.prototype.hasOwnProperty.call(item,k)){
                                    item[k] = item[k]+'';
                                }
                            }
                        })
                        _data = this.arrUni(_data);
                        tableArray = tableArray.concat(_data);
                        // tableArray = this.arrUni(tableArray);
                        
                    } catch(e){
                        this.$message({
                            type:'warning',
                            message: e
                        });
                    }
                }
                // console.log('tableArray',tableArray)

                 
                try{
                    if(this.impExcel==='1'){
                        await setNewData(tableArray);

                    }else {
                        await addData(tableArray);
                    }

                    for(let key in this.query){
                        this.query[key] = "";
                    }
                    this.getData().then(()=>{
                        this.importVisible = false; 
                    });
                                  

                }catch(e){
                    this.$message({
                            type:'warning',
                            message: "添加excel中获取的数据失败"
                    });
                }

                // try{
                //     for(let key in this.query){
                //         this.query[key] = "";
                //     }
                //     let _fetchData = await fetchData(this.query);
                //     this.tableData = _fetchData.list;
                //      // 更新原数据，
                //     this.pageTotal = Math.max(Math.floor(this.tableData.length/this.pageSize),1);
                //     let start = Math.max((this.pageIndex-1)*this.pageSize,0), end = Math.min(this.pageIndex*this.pageSize,this.tableData.length);
                //     this.tableDataShow = this.tableData.slice(start,end);
                // }catch(e){
                //     this.$message({
                //             type:'warning',
                //             message: "获取的数据失败"
                //     });
                // }
                
        },
        //数组去重
        arrUni(arr){
            if(!arr||arr.length===0) return [];
            
            for(let i=arr.length-1;i>0;i--){
                let val = arr[i];
                for(let j=i-1;j>=0;j--){
                    if(val.id===arr[j].id){
                        arr[j] = val;
                        arr.splice(i,1);
                        break;
                    }
                }
            }
            return arr;
        },
        //下载excel模板
        getExcelTemplate(){
            let tableData = [{id:1871172,name:'胡亮',gender:'男',birthday:"1997-06-07",major:'软件工程',proED:'研究生',political:'党员',time:'2019-10-1'}];
            downLoadExcel(tableData,this.listTitle,this.tableTitle,'党员信息'); 
        },
        deleteAllUpload(){
            this.$refs.el_upload_314.clearFiles();
            this.fileList = null;
        }
      
        
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}

.el_side_style{
    font-size: smaller;
    width: 130px !important;
    margin-top: 0px;
    /* outline: 1px solid red; */
}

/* 设置el-aside中表单 label的字体 */
#selectForm>>>.el-form-item__label{
    font-size: smaller;
    /* outline: yellow; */
    /* color: blue; */
}
#selectForm .el-form-item{
    margin-bottom: 5px;
}

/* 添加新用户的表单 */
#formAdd .el-form-item{
    /* outline: 1px solid red; */
    margin: 15px auto;
    width: 60%;

}
.addFormDialog_314{
    width: 200px!important;
}






/* .ces-search{
    font-size: 10px;
    width: 100%;
} */
</style>

<style >
/* 由于vue中scope的作用，对于element ui中有些默认的样式我们无法修改，这里需要再写一个不带scoped的style标签 
但是，一定一定要带一个css的深度选择器（例如这里的#filter_314 ），防止污染全局的样式
*/
/* 修改 id为filter的header的样式 */
#filter_314 .el-card__header{
    /* color: red!important; */
    /* outline: 1px solid red; */
    width: 50%;
    /* transform: translateX(100%); */
    padding: 8px 8px 8px 20px;
    font-size: 14px;
    text-align: center;
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    border-radius: 4px;

}
#filter_314{
    padding-top: 20px;
    border: 0px;
}
/* 改变id为el_table_314的el-table中内容的padding来减少高度 */
#el_table_314 .el-table__body-wrapper .el-table__body .el-table__row td{
    padding: 0px;
}

/* #el_upload_314{
    width: 220px;
} */
#el_upload_314 .el-upload{
    width: 200px;
    height: 35px;
    line-height: 35px;
    overflow: hidden;
    /* display: inline-block; */
    font-size:medium;
    text-align: center;
}
#el_upload_314 .el-upload .el-button{
    width: 100%;
}
#el_upload_314 .el-upload .el-button .el-icon-upload{
    /* width: ; */
    /* display: inline-block; */
    /* height: 10px; */
    margin: 0;
    /* line-height: 30px; */
    line-height: 15px;
    font-size: medium;
}


/* id为elD_314的导入Excel的el-dialog */
#elD_314 .el-radio{
    /* color: red; */
    /* outline: 1px solid red; */
    /* display: block; */
    /* overflow: hidden; */
    width: 140px;

}


/* div.el-card__header {
    padding: 0px!important;
} */
</style>
