let formDate = {
    gender:{0:'全部',1:'男',2:'女'},
    national:{0:'全部',1:'汉族',2:'满族',3:'壮族'},
    branch:{0:'全部',1:'第一党支部',2:'第二党支部',3:'第三党支部'},
    proED:{0:'全部',1:'大学',2:'研究生',3:'博士',4:'其他'},
    class:{0:'全部',1:'1901班',2:'1902班',3:'1903班'},
    grade:{0:'全部',1:'18级',2:'19级',3:'20级'},
    stage:{0:'全部',1:'党员',2:'预备党员',3:'入党积极分子',4:'优秀团员'},
    isApplay:{0:'全部',1:'是',2:'否'},
    actvTrainResult:{0:'全部',1:'优秀',2:'及格',3:'不及格'},
    devTrainResult:{0:'全部',1:'优秀',2:'及格',3:'不及格'},
}

/**
 * 用来将对象数组list中的属性值由0,1变为对应的汉字，如gender:'1'，变为gender:'男'
 * @param {Array} list ,数组list中的每一项都为一个对象
 * @returns 
 */
function dateTranfer(list){
    for(let i=0;i<list.length;i++){
        let obj = list[i];
        Object.keys(obj).forEach((item)=>{
            if(formDate[item]){
                list[i][item] = formDate[item][list[i][item]];
            }
        })
    }
    return list;
}

//这里options设为空数组，是为了方便更改数据，下面会调用函数填上它们应有的值
let baseForm = [
    {label:'学号',prop:'stuId',type:'Input'},
    {label:'姓名',prop:'name',type:'Input'},
    {label:'性别',prop:'gender',type:'Select',options:[]},
    {label:'民族',prop:'national',type:'Select',options:[]},
    {label:'支部',prop:'branch',type:'Select',options:[]},
    {label:'年龄',prop:'age',type:'Input'},
    {label:'学历',prop:'proED',type:'Select',options:[]},
    {label:'班级',prop:'class',type:'Select',options:[]},
    {label:'导师',prop:'tutor',type:'Input'},
    {label:'所处阶段',prop:'stage',type:'Select',options:[]},
];

let applyForm = [
    {label:'是否提交申请书',prop:'isApplay',type:'Select',options:[]},
];

let activistForm = [
    {label:'确定积极分子时间',prop:'actvTime',type:'YMArea'},
    {label:'积极分子培训班时间',prop:'actvTrainTime',type:'YMArea'},
    {label:'培训班结业情况',prop:'actvTrainResult',type:'Select',options:[]},
];
let developForm = [
    {label:'确定发展对象时间',prop:'devTime',type:'YMArea'},
    {label:'发展对象培训时间',prop:'devTrainTime',type:'YMArea'},
    {label:'发展对象培训班结业情况',prop:'devTrainResult',type:'Select',options:[]},                
];
let candidateForm = [
    {label:'拟发展时间',prop:'candidateTime',type:'YMArea'},
];
let partyForm = [
    {label:'转正时间',prop:'partyTime',type:'YMArea'},
];




//基本信息
let tableDetail = [
    {label:'学号',prop:'stuId',type:'Input'},
    {label:'姓名',prop:'name',type:'Input'},
    {label:'性别',prop:'gender',type:'Select',options:[]},
    {label:'联系方式',prop:'phone',type:'Input'},
    {label:'民族',prop:'national',type:'Select',options:[]},
    {label:'身份证',prop:'idCard',type:'Input'},
    {label:'出生日期',prop:'birthday',type:'YMR'},
    {label:'年级',prop:'grade',type:'Input'},
    {label:'班级',prop:'class',type:'Input'},
    {label:'学历',prop:'proED',type:'Select',options:[]},
    {label:'导师',prop:'tutor',type:'Input'},
    {label:'所处阶段',prop:'stage',type:'Select',options:[]},
    {label:'寝室',prop:'bedroom',type:'Input'},
    {label:'职务',prop:'duty',type:'Input'},
    {label:'所在支部',prop:'branch',type:'Select',options:[]},
    {label:'培养联系人',prop:'pTeacher',type:'Input'},
    {label:'入党介绍人',prop:'leader',type:'Input'},
    {label:'入党志愿书编号',prop:'applyFileNumber',type:'Input'},
    {label:'籍贯',prop:'home',type:'pcc'},

];
//申请入党阶段
let applyStage = [
    {label:'申请入党时间',prop:'applyTime',type:'YMR'},
    {label:'谈心谈话党时间',prop:'talkTime',type:'YMR'}
];
//入党积极分子的确定和培养阶段
let actvStage = [
    {label:'团推优时间',prop:'electLeagueTime',type:'YMR'},
    {label:'确定积极分子时间',prop:'actvTime',type:'YMR'},
    {label:'积极分子培训时间',prop:'actvTrainTime',type:'YMR'},
    {label:'积极分子培训班结业情况',prop:'actvTrainResult',type:'YMR'},
];
//发展对象的确定和考察阶段
let devStage = [
    {label:'确定发展对象时间',prop:'devTime',type:'YMR'},
    {label:'发展对象培训班结业情况',prop:'devTrainResult',type:'Select',options:[]},                
    {label:'业务课排名',prop:'classRank',type:'Input'},
    {label:'外调材料日期',prop:'extFileTime',type:'YMR'},
    {label:'政审材料日期',prop:'polFileTime',type:'YMR'},
    {label:'拟发展时间',prop:'candidateTime',type:'YMR'},
    {label:'发展党员上级党委预审日期',prop:'hPartyPreCheckTime',type:'YMR'},
    {label:'公示日期',prop:'pubTime',type:'YMR'},
    {label:'发展对象培训时间',prop:'devTrainTime',type:'YMDArea'},    
];
// 预备党员的接收阶段
let candidateStage = [
    {label:'入党时间',prop:'jnTime',type:'YMR'},
    {label:'入党总支审查日期',prop:'aPartyCheckTime',type:'YMR'},
    {label:'发展党员上级组织谈话日期',prop:'hPartyTalkTime',type:'YMR'},
    {label:'入党上级党委审批日期',prop:'hPartyPassTime',type:'YMR'},
];
// 预备党员的教育考察和转正阶段
let positiveStage = [
    {label:'转正时间',prop:'confirmTime',type:'YMR'},
    {label:'转正总支审查日期',prop:'partyConfirmTime',type:'YMR'},
    {label:'转正上级党委审批日期',prop:'hPartyConfirmTime',type:'YMR'},
    {label:'延长预备期日期',prop:'delayReadyTime',type:'YMR'},
    {label:'延长预备期总支审查日期',prop:'delayCheckTime',type:'YMR'},
    {label:'延长预备期党委审批日期',prop:'delayConfirmTime',type:'YMR'},
];

//详情页面的表单
let tableForm = {
    tableDetail:tableDetail,//基本信息
    applyStage:applyStage,//申请入党阶段
    actvStage:actvStage,//入党积极分子的确定和培养阶段
    devStage:devStage,//发展对象的确定和考察阶段
    candidateStage:candidateStage,// 预备党员的接收阶段
    positiveStage:positiveStage,// 预备党员的教育考察和转正阶段

}



//主页面的搜索的表单
let formList = {
    baseForm: baseForm,
    applyForm: applyForm,
    activistForm: activistForm,
    developForm: developForm,
    candidateForm: candidateForm,
    partyForm:partyForm
}
function setOptionsToFormDate(arr){
    for(let i=0;i<arr.length;i++){
        let item = arr[i];
        let prop = item['prop'];
        if(item['type']==='Select'&&formDate[prop]){
            let keys = Object.keys(formDate[prop]);
            keys.forEach(k=>{
                let optionsObj = {};
                optionsObj['value'] = k;
                optionsObj['label'] = formDate[prop][k];
                arr[i].options.push(optionsObj);
            })
        }
    }   
}
function setFormDateOptions(list){
    let keys = Object.keys(list);
    for(let i=0;i<keys.length;i++){
        setOptionsToFormDate(list[keys[i]]); 
    }
}

setFormDateOptions(formList);
setFormDateOptions(tableForm);


export {formList,tableForm,dateTranfer}


// {value:'',label:'全部'},{value:'1',label:'是'},{value:'2',label:'否'}


