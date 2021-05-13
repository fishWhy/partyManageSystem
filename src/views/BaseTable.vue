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
                <el-header  height="auto">
                    <el-container>
                        <el-aside width="80px" style="margin"><el-tag type="success" style="font-size:14px;">基础搜索</el-tag></el-aside>
                        <el-main id="searchBaseMain" style="padding: 4px 0 0 5px;"><search-form :formObj="formList.baseForm" :minHeight="70" ref="baseForm"></search-form></el-main>
                    </el-container>
                    <!-- <el-divider style="margin: 5px 0 5px 0"></el-divider> -->

                    <el-collapse v-model="activeNames" @change="handleChange">
                        <el-collapse-item name="1"  id="el_col_item314">
                            <template #title>
                                 <el-aside width="80px" style="margin"><el-tag type="success" style="font-size:14px;">高级搜索</el-tag></el-aside>
                            </template>
                            <el-tabs v-model="activeName" type="card" id="el_tabs314" style="padding:0 0 0 20px">
                                <el-tab-pane label="提交申请" name="apply" class="el_tab_pane314"><search-form  :formObj="formList.applyForm" :minHeight="40" ref="applyForm"></search-form></el-tab-pane>
                                <el-tab-pane label="积极分子" name="activist" class="el_tab_pane314"><search-form :formObj="formList.activistForm" :minHeight="40" ref="activistForm"></search-form></el-tab-pane>
                                <el-tab-pane label="发展对象" name="develop" class="el_tab_pane314"><search-form :formObj="formList.developForm" :minHeight="40" ref="developForm"></search-form></el-tab-pane>
                                <el-tab-pane label="预备党员" name="candidate" class="el_tab_pane314"><search-form :formObj="formList.candidateForm" :minHeight="40" ref="candidateForm"></search-form></el-tab-pane>
                                <el-tab-pane label="正式党员" name="party" class="el_tab_pane314"><search-form :formObj="formList.partyForm" :minHeight="40" ref="partyForm"></search-form></el-tab-pane>
                            </el-tabs>
                        </el-collapse-item>
                    </el-collapse>
                </el-header>


                <el-main >
                    <div class="handle-box" id="el_button314">
                        <div style="float:left" class="seachButton333">
                            <el-button type="success"  @click="requeryData">查询</el-button>
                            <el-button type="primary" @click="resetQueryData">重置</el-button>               
                        </div>

                        <div style="float:right">
                            <el-button
                            type="primary"
                            icon="el-icon-delete"
                            class="handle-del mr10"
                            @click="delAllSelection"
                        >批量删除</el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
                            <el-button type="primary" icon="el-icon-printer" @click="getExcel">导出Excel</el-button>
                            <el-button type="primary" icon="el-icon-paperclip" @click="importVisible=true">导入Excel</el-button>
                        </div>
                    </div>

                    <div class="pagination" style="margin:12px 0 4px 0">
                        <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :current-page="showDate.pageIndex"
                            :page-size="showDate.pageSize"
                            :total="showDate.itemTotal"
                            @current-change="currentPageChange"
                           
                        ></el-pagination>
                    </div>

                    <el-table
                        :data="showDate.tableDateShow"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange"
                        id="el_table_314"
                    >
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column prop="stuId" label="学号"  align="center"></el-table-column>
                        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                        <el-table-column prop="gender" label="性别" align="center"></el-table-column>
                        <el-table-column prop="national" label="民族" align="center"></el-table-column>
                        <el-table-column prop="birthday" label="生日" align="center"></el-table-column>
                        <el-table-column prop="branch" label="支部" align="center"></el-table-column>
                        <el-table-column prop="proED" label="学历" align="center"></el-table-column>
                        <el-table-column prop="grade" label="年级" align="center"></el-table-column>
                        <el-table-column prop="class" label="班级" align="center"></el-table-column>
                        <el-table-column prop="stage" label="所处阶段" align="center"></el-table-column>

                        <el-table-column label="操作" width="180" align="center">
                            <template #default="scope">
                                <el-button
                                    type="text"
                                    icon="el-icon-edit"

                                    @click="handleEdit(scope.$index, scope.row)"
                                >详情</el-button>
                                <el-button
                                    type="text"
                                    icon="el-icon-delete"
                                    class="red"

                                    @click="handleDelete(scope.$index, scope.row)"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    
                    
                </el-main>
            </el-container>
           
        </div>

         <!-- 编辑弹出框
        <el-dia :visible="editVisible" :formDate="form" :title="编辑" @saveDia="saveEdit" @cancle="cancleEdit"></el-dia> -->

        <!-- 添加新用户
        <el-dia :visible="addVisible" :formDate="form" :title="添加新用户" @saveDia="saveAdd" @cancle="cancleAdd"></el-dia> -->

               
       

        <!-- 导入excel -->
        <el-dialog title="导入Excel" v-model="importVisible" width="30%" >
            <div id="elD_314">
                <div>
                    <el-tag>导入Excel格式要求</el-tag>
                    <div style="margin-top:10px">
                        导入的Excel时,籍贯一定要加/(如:河北省/秦皇岛市/山海关区),否则会导入错误。
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
import {addDate,deltDate,fetchData,setNewData,downDate,loadDateFromExcel} from "../api/index";
import {formList,dateTranfer,listMap} from "../api/formDate.js"
// 
// import el_dialog from "../components/el_dialog.vue"
import searchForm from "../components/searchForm.vue"
import {useRouter, useRoute} from 'vue-router'


export default {
    name: "basetable",
    components:{
        // ElDia:el_dialog,
        SearchForm:searchForm
    },
    activated(){
        this.getData();
    },
     setup(){
        const router = useRouter();
        const route = useRoute();

        return {router,route}
    },
    data() {
        return {

            formList: '',

            activeName:'apply',
            //筛选/搜索数据时的条件
            query: {
                // baseForm
                stuId: "",
                name: "",
                gender:'',
                national:'',//民族
                branch:'',//支部
                age:'',
                proED:'',//学历
                class:'',
                tutor:'',//导师
                stage:'',//所处阶段

                // applyForm
                isApplay:'',//是否提交申请书

                // activistForm
                actvTime:'',
                actvTrainTime:'',//积极分子培训班时间
                actvTrainResult:'',//培训班结业情况

                // developForm
                devTime:'',//确定发展对象时间
                devTrainTime:'',//发展对象培训时间
                devTrainResult:'',//培训班结业情况

                // candidateForm
                candidateTime:'',//入党时间
                // partyForm
                partyTime:'',//转正时间

                political:'',

                pageIndex:1
            },


            id: -1,

           

            //文件导出
            listTitle:[],
            tableTitle:[],

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
            showDate:{
                tableDateShow:[],
                pageIndex:1,
                pageSize:1,
                itemTotal:1,
            },


            //保存那些被选中的键值
            selectedItem:{},//保存被选中的项，以每项的id为键,值为true
            // 设置一个锁，防止换页时自动更改selectedItem
            selectedItemLock:false,

            attriShow:["stuId","name","gender","national","birthday","branch","proED","grade","class","stage"],

        };
    },
    created() {
        this.getData();
        this. formList = formList;

        this.listTitle = Object.keys(listMap);
        
        this.listTitle.forEach(item=>{
            this.tableTitle.push(listMap[item]);
        })

        console.log('CreatlistTitle:',this.listTitle);
        console.log('CreattableTitle:',this.tableTitle);

    },
    // computed:{
    //     itemTotal: function () {
    //         return this.tableData.length;
    //     }
    // },
    watch:{
        impExcel(){
            this.$refs.el_upload_314.clearFiles();
            this.fileList = null;
        },
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        async getData(searchObj = this.query) {
            
            // this.query.indexPage = 0;
            // console.log('fetchData:',searchObj);
            
            let res = await fetchData(searchObj);
            // console.log('res:',res)

            //对返回的 res.list 数据进行转换,即将
            this.showDate.tableDateShow = dateTranfer(res.list);
            // this.showDate.tableDateShow = res.list;


            //

            this.showDate.pageIndex = res.pageIndex;
            this.showDate.pageSize = res.pageSize;
            this.showDate.itemTotal = res.itemTotal;

            

            this.$nextTick(()=>{
                for(let i=0;i<this.showDate.tableDateShow.length;i++){
                    if(this.selectedItem[this.showDate.tableDateShow[i].stuId]){
                        this.$refs.multipleTable.toggleRowSelection(this.showDate.tableDateShow[i],true);
                    }
                }
                this.selectedItemLock = false;
            });
            
        },

        //改变当前页时，回调
        currentPageChange(val){
            this.query.pageIndex = val;
            //this.selectedItemLock起到加锁的作用，防止在更改表格数据时触发该函数，误更改this.selectedItem
            this.selectedItemLock = true;
            this.getData(this.query);

        },
        


        // 删除操作
        async handleDelete(index,val) {
            // 二次确认删除
            try{

                await  this.$confirm("确定要删除吗？", "提示", {
                            type: "warning"
                        });
                await   deltDate([val.stuId]);
                
                let obj = {};
                for(let key in this.query){
                    obj[key]=this.query[key];
                }
                obj.id = this.searchQuery;
                this.getData(obj);
                this.$message.success(`删除id为 ${val.stuId} 的同学的信息成功`);

            }
            catch(e){
                console.log(e);
            }

        },
        // 多选操作
        handleSelectionChange(val) {
            //this.selectedItemLock起到加锁的作用，防止在更改表格数据时触发该函数，误更改this.selectedItem
            if(this.selectedItemLock) return;

            let idObj = {};
            console.log('val:',val);
            val.forEach(item=>{
                idObj[item.stuId]=true;
            })
            this.showDate.tableDateShow.forEach(item=>{
                if(idObj[item.stuId]){
                    this.selectedItem[item.stuId] = true;
                } else if(this.selectedItem[item.stuId]){
                    console.log('delete')
                    delete this.selectedItem[item.stuId];
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
               await deltDate(deleteIds);

                //数据都已经删除，更新this.selectedItem为空，将this.selectedItemLock置为false
                this.selectedItem = {},
                this.selectedItemLock = false;

                //重新获取数据
                this.getData(this.query);
                this.$message.success(`${str}被成功删除`)


            }catch(e){
                
                this.$message.error(e);
            }

        },



        // 编辑用户信息
        // 编辑操作
        handleEdit(index, row) {
            this.router.push({path:'/home/form',query:{stuId:row.stuId}})

            // for(let key in this.form){
            //     this.form[key]="";
            // }
            // this.idx = index;
            // console.log('row:',row);
            // //注意这里一定要深拷贝一次。
            // this.form = JSON.parse(JSON.stringify(row));

            // if(this.form.birthday){
            //     this.form.birthday = new Date(this.form.birthday);
            // }
            // if(this.form.time){
            //     this.form.time = new Date(this.form.time);
            // }

            // this.editVisible = true;
            // console.log('the new of edit form: ',this.form);
        },


        //添加新用户
        async handleAdd(){
            try{
                await  this.$confirm("确定要新增用户吗？", "提示", {
                            type: "warning"
                        });
                this.router.push({path:'/home/form',query:{isDisabled:false}});
                
            }catch(e){
                console.log(e);
            }


            // this.form = {}
            // this.addVisible = true;
        },

        
       






        // 重置this.query，查询所有的数据
        resetQueryData(){
            let keys = Object.keys(this.query);
            let pageIndex = this.query.pageIndex;
            for(let i=0;i<keys.length;i++){
                this.query[keys[i]]="";
            }
            this.query.pageIndex = pageIndex;

            this.$refs.baseForm.resetQuery(this.query);this.$refs.applyForm.resetQuery(this.query);
            this.$refs.activistForm.resetQuery(this.query);this.$refs.developForm.resetQuery(this.query);
            this.$refs.candidateForm.resetQuery(this.query);this.$refs.partyForm.resetQuery(this.query);

            this.getData(this.query);
        },
        // 按照this.query的筛选条件要求，查询数据
        requeryData(){
            this.query = this.rnQuery();

            // console.log("query",this.query);
            this.getData(this.query);
        },
        rnQuery(){
            return Object.assign(this.query,
            this.$refs.baseForm.getQuery(),
            this.$refs.applyForm.getQuery(),
            this.$refs.activistForm.getQuery(),
            this.$refs.developForm.getQuery(),
            this.$refs.candidateForm.getQuery(),
            this.$refs.partyForm.getQuery()); 
        },


        //excel导入导出操作
        //下载excel
        getExcel(){
            let that = this;
            let obj = {type:0,  listTitle: that.listTitle,  tableTitle: that.tableTitle}
            downDate(obj);
        },

        //导入excel
        handleExcelChange(_,fileList){
            this.fileList = fileList;
            console.log('fileListUped',this.fileList);
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
                if(!this.fileList) return;
                // console.log('fileListSaveUploadExcel:',this.fileList);
                let filesObj = {};
                filesObj.fileList = this.fileList;
                filesObj.listTitle= this.listTitle;
                filesObj.tableTitle= this.tableTitle;

                

                let tableArray = loadDateFromExcel(filesObj);
                console.log('tableArray:',tableArray)
                

                 
                try{
                    if(this.impExcel==='1'){
                        await setNewData(tableArray);

                    }else {
                        await addDate(tableArray);
                    }

                    

                    //更新当前页面的内容
                    this.resetQueryData();
                    this.importVisible = false; 
                                  

                }catch(e){
                    this.$message({
                            type:'warning',
                            message: "添加excel中获取的数据失败"
                    });
                }

                
                
        },
        
        //下载excel模板
        getExcelTemplate(){
            let that = this;
            let obj = {type:0,  listTitle: that.listTitle,  tableTitle: that.tableTitle}
            
            downDate(obj);
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
    margin-bottom: 0px;
    font-size: 12px;
}

.handle-select {
    width: 120px;
}


.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
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

#el_tabs314:deep(#tab-apply),
#el_tabs314:deep(#tab-activist),
#el_tabs314:deep(#tab-develop),
#el_tabs314:deep(#tab-candidate),
#el_tabs314:deep(#tab-party){
    font-size: 12px;
}

#el_button314 button{
    font-size: 12px;
    margin-left: 12px;
    min-height: 30px;
}
/* 清浮动 */
#el_button314::after{
    content: "";
    display: block;
    clear: both;
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

/* #searchBaseMain{
    outline: 1px solid blue;
} */


/* div.el-card__header {
    padding: 0px!important;
} */
#el_col_item314 .el-collapse-item__wrap .el-collapse-item__content{
    /* outline: 1px solid red; */
    padding-bottom: 0px;
}
</style>
