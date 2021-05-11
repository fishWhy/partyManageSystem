<template>
    
    <div >
        
        <!-- <el-divider style="margin: 5px 0 10px 0;"></el-divider> -->

        <el-form  label-position="left" label-width="auto" id="selectForm" :inline="true"  :style="{ minHeight:minHeight+'px'}">
            <el-form-item v-for='item in formObj' :label="item.label" :key='item.prop'  size='mini'>
               <!-- 输入框 -->
                <el-input v-if="item.type==='Input'" v-model="query[item.prop]" class="el_side_style"  ></el-input>
                <!-- 下拉框 -->
                <el-select v-if="item.type==='Select'" v-model="query[item.prop]"  class="el_side_style"  >
                    <el-option v-for="op in item.options" :label="op.label" :value="op.value" :key="op.value" ></el-option>
                </el-select>   
                <!-- 日期 -->
                <el-date-picker  v-if="item.type==='YMR'" :default-value="item.default_time" v-model="query[item.prop]" style="width:130px;font-size:smaller" class="el_side_style"></el-date-picker>   
            </el-form-item>
        </el-form>
        <!-- <el-form inline>
            <el-form-item>
                <el-button type="primary" size="mini" @click="resetQueryData">重置</el-button>
            </el-form-item>
            <el-form-item style="margin-left:20px">
                <el-button type="success" size="mini" @click="requeryData">查询</el-button>
            </el-form-item> 
        </el-form> -->
    </div>


</template>
<script>
export default{
    props:{
        formObj:{
            type:Array,
            default:function(){
                let arr = [
                            {label:'学号',prop:'id',type:'Input'},
                            {label:'姓名',prop:'name',type:'Input'},
                            {label:'性别',prop:'gender',type:'Select',options:[{value:'',label:'全部'},{value:'男',label:'男'},{value:'女',label:'女'}]},
                            {label:'生日',prop:'birthday',type:'YMR',default_time:new Date().setFullYear((new Date().getFullYear()-25))},
                            {label:'支部',prop:'major',type:'Select',options:[{value:'',label:'全部'},{value:'1',label:'第一党支部'},{value:'2',label:'第二党支部'},{value:'3',label:'第三党支部'}]},
                            {label:'学历',prop:'proED',type:'Select',options:[{value:'',label:'全部'},{value:'1',label:'大学'},{value:'2',label:'研究生'},{value:'3',label:'博士'},{value:'4',label:'其他'}]},
                            {label:'班级',prop:'class',type:'Select',options:[{value:'',label:'全部'},{value:'1',label:'1901班'},{value:'2',label:'1902班'},{value:'3',label:'1903班'},{value:'4',label:'其他'}]},
                            {label:'所处阶段',prop:'stage',type:'Select',options:[{value:'',label:'全部'},{value:'1',label:'党员'},{value:'2',label:'预备党员'},{value:'3',label:'入党积极分子'},{value:'4',label:'优秀团员'}]},
                        ]
                return arr;
            }
        },
        minHeight:{
            type:Number,
            default:70
        }
    },

    data(){
       return {
            //筛选表单
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
       }
    },
    computed:{
    },
    methods:{
    }
}
</script>
<style scoped>
/* 修改 id为filter的header的样式 */
#selectForm>>>.el-form-item__label{
    font-size: 12px;
}

#selectForm{
    padding-top: 0px;
    border: 0px;
}

#selectForm .el-form-item{
    margin-bottom: 5px;
}
.el_side_style{
    font-size: smaller;
    width: 130px !important;
    margin-top: 0px;
    /* outline: 1px solid red; */
}

</style>
