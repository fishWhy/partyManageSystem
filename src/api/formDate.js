import {  CodeToText, TextToCode } from 'element-china-area-data/dist/app.commonjs';

let formDate = {
    gender:{0:'全部',1:'男',2:'女'},

    national:{0:"全部",1:"汉族",2:"蒙古族",3:"回族",4:"藏族",5:"维吾尔族",6:"苗族",7:"彝族",8:"壮族",9:"布依族",10:"朝鲜族",11:"满族",12:"侗族",13:"瑶族",14:"白族",15:"土家族",16:"哈尼族",17:"哈萨克族",18:"傣族",19:"黎族",20:"傈僳族",21:"佤族",22:"畲族",23:"高山族",24:"拉祜族",25:"水族",26:"东乡族",27:"纳西族",28:"景颇族",29:"柯尔克孜族",30:"土族",31:"达斡尔族",32:"仫佬族",33:"羌族",34:"布朗族",35:"撒拉族",36:"毛难族",37:"仡佬族",38:"锡伯族",39:"阿昌族",40:"普米族",41:"塔吉克族",42:"怒族",43:"乌孜别克族",44:"俄罗斯族",45:"鄂温克族",46:"德昂族",47:"保安族",48:"裕固族",49:"京族",50:"塔塔尔族",51:"独龙族",52:"鄂伦春族",53:"赫哲族",54:"门巴族",55:"珞巴族",56:"基诺族",99:"其他"},

    branch:{0:'全部',1:'第一党支部',2:'第二党支部',3:'第三党支部'},

    proED:{0:'全部',1:'本科',2:'硕士研究生',3:'博士研究生',4:'其他'},


    stage:{0:'全部',1:'党员',2:'预备党员',3:'入党积极分子',4:'申请入党'},
    duty:{0:'全部',1:'支部书记',2:'宣传委员',3:'组织委员',4:'普通党员',5:'管理员'},

    isApplay:{0:'全部',1:'是',2:'否'},

    actvTrainResult:{0:'全部',1:'通过',2:'不通过'},
    devTrainResult:{0:'全部',1:'通过',2:'不通过'},
}

function inFormToNone(obj){
    Object.keys(formDate).forEach(item=>{
        if(obj[item]==='0'){
            obj[item]='';
        }
    })

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

/**
 * 用来将对象数组list中的属性值由汉字变成对应数字，如gender:'男' 变为 gender:'1'
 * @param {Array} list ,数组list中的每一项都为一个对象
 * @returns 
 */
 function dateBack(list){
    for(let i=0;i<list.length;i++){
        let obj = list[i];
        Object.keys(obj).forEach((item)=>{
            if(formDate[item]){
                Object.keys(formDate[item]).forEach(k=>{
                    if(list[i][item] === formDate[item][k]){
                        list[i][item] = k;
                    }
                })
            }
        })
    }
    return list;
}


//省市区三级区域码转地址
// 数组list中的每一项都为一个对象
function ptdToAddress(list){
    let rs = "";

    for(let i=0;i<list.length;i++){ 
        //codeArr是一个长度为3的数组分别是省市区的区域码，["130000","130300","130303"]，这里会转成 河北省/秦皇岛市/山海关区
        if(Object.prototype.hasOwnProperty.call(list[i],'home')){
            let codeArr = list[i]['home'];
            rs = "";

            codeArr.forEach(item=>{
                //注意一定要有'/'，目的是为了方便导入表格
                rs += CodeToText[item]+"/";
            })
            rs = rs.slice(0,rs.length-1);
            list[i]['home'] = rs;
        }
        
    }
    return list;
}
//省市区三级区地址转区域码，例如：河北省/秦皇岛市/山海关区 转成 ["130000","130300","130303"]
// 数组list中的每一项都为一个对象

function addressToPtd(list){
    // let rs = [];

    for(let i=0;i<list.length;i++){ 
        if(Object.prototype.hasOwnProperty.call(list[i],'home')){
            //codeArr是一个长度为3的数组分别是省市区的区域码，["130000","130300","130303"]，这里会转成 河北省/秦皇岛市/山海关区
            let addr = list[i]['home'].split('/');
            // rs = [];
            // rs.push(TextToCode[addr[0]].code);
            // rs.push(TextToCode[addr[0]][addr[1]].code);
            // rs.push(TextToCode[addr[0]][addr[1]][addr[2]].code);

            // list[i]['home'] = rs;
            list[i]['home'] = TextToCode[addr[0]][addr[1]][addr[2]].code;
        }
        
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
    {label:'班级',prop:'tclass',type:'Input'},
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
    {label:'班级',prop:'tclass',type:'Input'},
    {label:'学历',prop:'proED',type:'Select',options:[]},
    {label:'导师',prop:'tutor',type:'Input'},
    {label:'所处阶段',prop:'stage',type:'Select',options:[]},
    {label:'寝室',prop:'bedroom',type:'Input'},
    {label:'职务',prop:'duty',type:'Select',options:[]},
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
    {label:'积极分子培训班结业情况',prop:'actvTrainResult',type:'Select',options:[]},
    {label:'积极分子培训时间',prop:'actvTrainTime',type:'YMDArea'},

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
function setOptionsToFormDate(arr,type=0){
    for(let j=0;j<arr.length;j++){
        let item = arr[j];
        let prop = item['prop'];
        if(item['type']==='Select'&&formDate[prop]){
            let keys = Object.keys(formDate[prop]);
            let i = 0;
            if(type===1) i=1;
            for(;i<keys.length;i++){
                let optionsObj = {}, k = keys[i];
                optionsObj['value'] = k;
                optionsObj['label'] = formDate[prop][k];
                arr[j].options.push(optionsObj);
            }
        }
    }   
}
function setFormDateOptions(list,type=0){
    let keys = Object.keys(list);
    for(let i=0;i<keys.length;i++){
        setOptionsToFormDate(list[keys[i]],type); 
    }
}

setFormDateOptions(formList);
setFormDateOptions(tableForm,1);


export {formList,tableForm,dateTranfer,inFormToNone,listMap,ptdToAddress,addressToPtd,dateBack}


var listMap = {
    stuId:"学号",
    name:'姓名',
    gender:'性别',
    phone:'联系方式',
    national:'民族',
    home:"籍贯",
    idCard:'身份证',
    birthday:'出生日期',//出生日期
    grade:'年级',//年级
    tclass:'班级',//班级
    proED:'学历',//学历
    tutor:'导师',//导师
    stage:'所处阶段',//所处阶段
    bedroom:'寝室',//寝室
    duty:'职务',//职务
    branch:'所在支部',//所在支部
    pTeacher:'培养联系人',//培养联系人
    leader:'入党介绍人',//入党介绍人
    applyFileNumber:'入党志愿书编号',//入党志愿书编号
    // 申请入党阶段
    applyTime:'申请入党时间',//申请入党时间
    talkTime:'谈心谈话时间',//谈心谈话时间
    //入党积极分子的确定和培养阶段
    electLeagueTime:'团推优时间',//团推优时间
    actvTime:'确定积极分子时间',//确定积极分子时间
    actvTrainTime:'积极分子培训时间',//积极分子培训时间
    actvTrainResult:'积极分子培训班结业情况',//积极分子培训班结业情况
    //发展对象的确定和考察阶段
    devTime:'确定发展对象时间',//确定发展对象时间
    devTrainTime:'发展对象培训时间',//发展对象培训时间
    devTrainResult:'发展对象培训班结业情况',//发展对象培训班结业情况
    classRank:'业务课排名',//业务课排名
    extFileTime:'外调材料日期',//外调材料日期
    polFileTime:'政审材料日期',//政审材料日期
    candidateTime:'拟发展时间',//拟发展时间
    hPartyPreCheckTime:'发展党员上级党委预审日期',//发展党员上级党委预审日期
    pubTime:'公示日期',//公示日期
    // 预备党员的接收阶段
    jnTime:'入党时间',//入党时间
    aPartyCheckTime:'入党总支审查日期',//入党总支审查日期
    hPartyTalkTime:'发展党员上级组织谈话日期',//发展党员上级组织谈话日期
    hPartyPassTime:'入党上级党委审批日期',//入党上级党委审批日期
    // 预备党员的教育考察和转正阶段
    confirmTime:'转正时间',//转正时间
    partyConfirmTime:'转正总支审查日期',//转正总支审查日期
    hPartyConfirmTime:'转正上级党委审批日期',//转正上级党委审批日期
    delayReadyTime:'延长预备期日期',//延长预备期日期
    delayCheckTime:'延长预备期总支审查日期',//延长预备期总支审查日期
    delayConfirmTime:'延长预备期党委审批日期',//延长预备期党委审批日期
    note:'备注',//
};



