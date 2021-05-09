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
                        :data="showDate.tableDateShow"
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
                            :current-page="showDate.pageIndex"
                            :page-size="showDate.pageSize"
                            :total="showDate.itemTotal"
                            @current-change="currentPageChange"
                           
                        ></el-pagination>
                    </div>
                </el-main>
            </el-container>
           
        </div>

         <!-- 编辑弹出框 -->
        <el-dia :visible="editVisible" :formDate="form" :title="编辑" @saveDia="saveEdit" @cancle="cancleEdit"></el-dia>

        <!-- 添加新用户 -->
        <el-dia :visible="addVisible" :formDate="form" :title="添加新用户" @saveDia="saveAdd" @cancle="cancleAdd"></el-dia>

               
       

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
import {addDate,cInfor,deltDate,fetchData,setNewData,isInDate,getTitle,downDate} from "../api/index";
import {importfxx} from "../utils/excel/upDownExcel.js";

import el_dialog from "../components/el_dialog.vue"

export default {
    name: "basetable",
    components:{
        ElDia:el_dialog
    },
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
                pageIndex:1
            },


            
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

            // 编辑用户信息对应的行
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

            showDate:{
                tableDateShow:[],
                pageIndex:1,
                pageSize:1,
                itemTotal:1,
            },

            //显示表格时相关数据
            // pageTotal: 1,
            // pageIndex: 1,
            // pageSize: 10,
            // tableDataShow:[],

            //保存那些被选中的键值
            selectedItem:{},//保存被选中的项，以每项的id为键,值为true
            // 设置一个锁，防止换页时自动更改selectedItem
            selectedItemLock:false,

        };
    },
    created() {
        this.getDate();
        let res = getTitle();
        this.listTitle = res.listTitle;
        this.tableTitle = res.tableTitle;
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
        async getDate(searchObj = this.query) {
            // 转换日期的格式到 Y-M-D格式
            if(searchObj.birthday instanceof Date){
                let y = searchObj.birthday.getFullYear(),m=searchObj.birthday.getMonth()+1,d=searchObj.birthday.getDate();
                if(m<=9)m = "0" + m;
                if(d<=9)d="0"+d;
                searchObj.birthday = y + '-' + m + '-' + d;
            }
            if(searchObj.time instanceof Date){
                let y = searchObj.time.getFullYear(),m=searchObj.time.getMonth()+1,d=searchObj.time.getDate();
                if(m<=9)m = "0" + m;
                if(d<=9)d="0"+d;
                searchObj.time = y + '-' + m + '-' + d;
            }
            // this.query.indexPage = 0;
            console.log('fetchData:',searchObj);
            
            let res = await fetchData(searchObj);
            console.log('res:',res)

            this.showDate.tableDateShow = res.list;
            this.showDate.pageIndex = res.pageIndex;
            this.showDate.pageSize = res.pageSize;
            this.showDate.itemTotal = res.itemTotal;

            

            this.$nextTick(()=>{
                for(let i=0;i<this.showDate.tableDateShow.length;i++){
                    if(this.selectedItem[this.showDate.tableDateShow[i].id]){
                        this.$refs.multipleTable.toggleRowSelection(this.showDate.tableDateShow[i],true);
                        // console.log(`the new page include${this.tableDataShow[i].id}`)
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
            this.getDate(this.query);

        },
        // 触发搜索按钮
        handleSearch() {
            //注意这里的this.searchQuery与this.query.id是分离的
            let obj = {};
            for(let key in this.query){
                obj[key]="";
            }
            obj.id = this.searchQuery;
            obj.pageIndex = 1;
            this.getDate(obj);
        },


        // 删除操作
        async handleDelete(index,val) {
            // 二次确认删除
            try{

                await  this.$confirm("确定要删除吗？", "提示", {
                            type: "warning"
                        });
                await   deltDate([val.id]);
                
                let obj = {};
                for(let key in this.query){
                    obj[key]=this.query[key];
                }
                obj.id = this.searchQuery;
                this.getDate(obj);
                this.$message.success(`删除id为 ${val.id} 的同学的信息成功`);

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
                idObj[item.id]=true;
            })
            this.showDate.tableDateShow.forEach(item=>{
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
               await deltDate(deleteIds);

                //数据都已经删除，更新this.selectedItem为空，将this.selectedItemLock置为false
                this.selectedItem = {},
                this.selectedItemLock = false;

                //重新获取数据
                this.getDate(this.query);
                this.$message.success(`${str}被成功删除`)


            }catch(e){
                
                this.$message.error(e);
            }

        },



        // 编辑用户信息
        // 编辑操作
        handleEdit(index, row) {

            for(let key in this.form){
                this.form[key]="";
            }
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
        async saveEdit(rData) {

            try{
                console.log("当前页面第几行",this.idx);
                //将数据提交给后台
                await cInfor(rData);

                //传给后台成功后，更改本页面中的this.tableData和this.tableDataShow中的对应数据
                this.showDate.tableDataShow[this.idx] = rData;
                this.editVisible = false;


                this.$message.success(`修改id为 ${rData.id} 的同学的信息成功`);
            }catch(e){
                this.$message.error(`修改id为 ${e} 的同学的信息失败`);
            }


            

            
        //     this.editVisible = false;
        //     this.$message.success(`修改第 ${this.idx + 1} 行成功`);
        //     this.$set(this.tableData, this.idx, this.form);
        },
        //取消修改
        cancleEdit(){
            this.editVisible = false;
            for(let key in this.form){
                this.form[key] = "";
            }
        },






        //添加新用户
        handleAdd(){
            this.form = {}
            this.addVisible = true;
        },

        // 保存新用户
        async saveAdd(rDate) {

            //首先，检查新添加的用户是否已经存在，如果存在就提示用户
            if(isInDate(rDate.id)){
                this.$message.error(`添加的用户已存在，添加失败`);
                return;
            }

            //添加用户
            //根据返回结果提示用户是否添加成功
            try{
                let arr = [rDate];
                await addDate(arr);

                
                this.addVisible = false;

                if(this.showDate.tableDateShow.length < this.showDate.pageSize){
                    this.showDate.tableDateShow.push(rDate);
                }
                this.showDate.itemTotal++;

                this.$message.success(`添加新用户成功`);
            }catch(e){
                this.$message.error(`添加的用户失败`);
            }            
           
        },
        // 取消添加用户
        cancleAdd(){
            this.addVisible = false;
            for(let key in this.form){
                this.form[key] = "";
            }
        },






        // 重置this.query，查询所有的数据
        resetQueryData(){
            for(let key in this.query){
                this.query[key] = "";
            }
            this.getData(this.query);
        },
        // 按照this.query的筛选条件要求，查询数据
        requeryData(){
            this.getData(this.query);
        },


        //excel导入导出操作
        //下载excel
        getExcel(){
            let obj = {type:1,date:[]}
            downDate(obj);
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
                console.log('tableArray',tableArray)
                console.log('impExcel:',this.impExcel)

                 
                try{
                    if(this.impExcel==='1'){
                        await setNewData(tableArray);

                    }else {
                        await addDate(tableArray);
                    }

                    for(let key in this.query){
                        this.query[key] = "";
                    }

                    //更新当前页面的内容
                    let obj = {};
                    for(let key in this.query){
                        obj[key]="";
                    }
                    obj.pageIndex = 1;
                    this.getDate(obj);
                    this.importVisible = false; 
                                  

                }catch(e){
                    this.$message({
                            type:'warning',
                            message: "添加excel中获取的数据失败"
                    });
                }

                
                
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
            let obj = {type:1,date:[]}
            obj.date = [{id:1871172,name:'胡亮',gender:'男',birthday:"1997-06-07",major:'软件工程',proED:'研究生',political:'党员',time:'2019-10-1'}];
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
