// import request from '../utils/request';
// import { reject } from "core-js/fn/promise";
import { downLoadExcel,importfxx} from "../utils/excel/upDownExcel.js";
import {ptdToAddress,dateTranfer,addressToPtd,dateBack} from './formDate.js';


// export const fetchData = query => {
//     return request({
//         url: './table.json',
//         method: 'get',
//         params: query
//     });
// };

//返回处理数据的函数数组，数据以闭包的型式保存。
let dataFun = (function(){
   

     //数组去重
    function arrUni(arr){
        if(!arr||arr.length===0) return [];

        for(let i=arr.length-1;i>0;i--){
            let val = arr[i];
            for(let j=i-1;j>=0;j--){
                if(val.stuId+''===arr[j].stuId+''){
                    arr[j] = val;
                    arr.splice(i,1);
                    break;
                }
            }
        }
        return arr;
    }

    


    //增
    // 将传入的数组dataItem添加到数据的结尾,在添加的过程中去重并跟新原先的值
    function addDate(dataArr){
        return new Promise(function(resolve){
            dataArr = arrUni(dataArr);
            data.list = data.list.concat(dataArr);
            data.list = arrUni(data.list);
            // console.log('data_list:',data.list);
            resolve('202');
        })
    }
     

    //删
    //删除stuId为stuId的那条数据
    function deltDate(stuIdArr){
        return new Promise(function(resolve,reject){
            // console.log('istuIdArr:',stuIdArr);
            if(!(stuIdArr instanceof Array)||stuIdArr.length<=0) {reject('删除数据失败');return;}
            let stuIdObj = {};
            // len = stuIddArr.length
            for (let j = 0; j < stuIdArr.length; j++) {
                stuIdObj[stuIdArr[j]] = true;
            }

            for(let i=data.list.length-1;i>=0;i--){
                if(stuIdObj[data.list[i].stuId]){
                    data.list.splice(i,1);
                    // len--;
                } 
            }

            resolve('成功删除')

            //未查找到对应的数据，无法删除
            // reject(stuId);
        })
        
    }

    //改
    //使用infor对象改变存储在data中的infor.stuId的信息
    function cInfor(infor){
        // console.log('infor:',infor)
        return new Promise(function(resolve,reject){
            for(let i=data.list.length-1;i>=0;i--){
                if(data.list[i].stuId===infor.stuId){
                    data.list[i] = infor;
                    // console.log('that is all right')
                    resolve(infor.stuId)
                    return;
                }
            }
            //未查找到对应的数据，无法修改
            reject(infor.stuId);
        }) 
    }

    //查
    //以query为条件查找数据, attriShow表明了返回的数据只包含哪些属性
    function fetchData(q,attriShow=null){
        return new Promise(function(resolve){
            
            // console.log(query);
           
            // console.log('the final query:',query);
            // let _data={list:[],listTitle:[],tableTitle:[]},isSelected;
            // _data.listTitle = data.listTitle;
            // _data.tableTitle = data.tableTitle;
            
            let query = JSON.parse(JSON.stringify(q));
            // console.log('query:',query)


            let _data= [], isSelected;


            data.list.forEach((item)=>{
                isSelected = true;
                for(let key in query){
                    // if(query[key]){
                    //     console.log('the query key:',key)
                    // }
                    if(query[key]&&Object.prototype.hasOwnProperty.call(item,key)&&(query[key]!==item[key])){
                        // console.log('key:',key,'  the value:',query[key], '  the item valu:',item[key]);
                        // 对于stuId，只要item[key]是以query[key]开头的就行
                        if((key==='stuId')&&(String(item[key]).indexOf(query[key])===0)){
                            continue;
                        }
                        if(key==='actvTrainTime'||key==='devTrainTime'){
                            let val1 = item[key], val2 = query[key];
                            if((Number(val2[0])<=val1[0]) && (Number(val2[1])>=val1[1])){
                                // console.log('trainTimeArea');
                                continue;
                            }
                        }
                        let t = /Time$/g;
                        // console.log('长度',query[key].length===2,query[key] instanceof Array,'正则：' ,t.test(key),query[key] instanceof Array && t.test(key))
                        if((query[key] instanceof Array) && t.test(key)){
                            // console.log('TimeArea');

                            let val = item[key], area = query[key];
                            if((area[0]<=Number(val)) && (Number(val)<=area[1])){
                                // console.log('In the TimeArea');
                                continue;
                            }
                        }
                        isSelected = false;break;
                    }
                }

                if(isSelected){
                    //为了将数据隔离开，这里进行了深拷贝，由于item结构比较简单，这里的深拷贝方法也比较简易
                    _data.push(JSON.parse(JSON.stringify(item)));
                }
            })
            // console.log('_data',_data)


            let len = _data.length, pageSize = data.perPageNum, pageIndex = query.pageIndex, pageTotal;
            // console.log('len:',len,'pageSize:',pageSize,'pageNum:',Math.floor(len/pageSize))
            pageTotal = Math.max(Math.ceil(len/pageSize),1);
            if(query.pageIndex>pageTotal){
                pageIndex = pageTotal;
            }
            let start = Math.max((pageIndex-1)*pageSize,0),end = Math.min(pageIndex*pageSize,len);
            

            
            let _rDate={list:[],itemTotal:'',pageSize:'',pageIndex:''};
            let list = _data.slice(start,end), finalList = [];

            // console.log("list:",list)
            // console.log("start:",start,"end:",end);
            if(attriShow&&attriShow.length>0){
                // console.log("attriShow")
                let attri = {};
                attriShow.forEach(item=>{
                    attri[item] = true;
                })

                for(let i=0;i<list.length;i++){
                    let elem = list[i], obj={};
                    Object.keys(elem).forEach(item=>{
                        if(attri[item]){

                            obj[item] = elem[item];
                        }
                    })
                    finalList.push(obj);
                }
                _rDate.list = finalList;

            }else{
                _rDate.list = list;
            }
            _rDate.itemTotal = len;
            _rDate.pageSize = pageSize;
            _rDate.pageIndex = pageIndex;


            resolve(_rDate);
        })
        
    }

    //查
    //以query为条件查找数据, attriShow表明了返回的数据只包含哪些属性
    function fetchDataByStuId(stuId){
        // console.log('here',stuId);
        if(!stuId) return {};
        let _rDate = {};

        let dateList = data.list;
        for(let i=0;i<dateList.length;i++){
            // console.log('item stuId',dateList[i])
            if(dateList[i].stuId === stuId){
                // console.log('get stuId')
                //为了将数据隔离开，这里进行了深拷贝，由于item结构比较简单，这里的深拷贝方法也比较简易
                _rDate = JSON.parse(JSON.stringify(dateList[i]));
                // console.log('_rDate',_rDate)
                return _rDate;
            }
        }

        return {};
        
    }


    // 将data.list的值更新为 tableDate
    function setNewData (tableData){
         return new Promise(function(resolve){
            data.list = arrUni(tableData);
            resolve('202');
         })
    }

    
    //判断stuId，是否在date中
    function isInDate(stuId){
        let dateList = data.list;
        for(let i=0;i<dateList.length;i++){
              if(dateList[i].stuId===stuId){
                  return true;
              }
        }
        return false;
    }

    function getTitle(){
        return {listTitle:data.listTitle,tableTitle:data.tableTitle};
    }

    //下载数据到excel表格
    function downDate(filterObj){
        if(filterObj.type===0){
            // 下载模板
            let arr = JSON.parse(JSON.stringify([downLoadTemp]));
            let downDate = downDateStyle(arr);
            console.log("downDate:",downDate);
            downLoadExcel(downDate, filterObj.listTitle, filterObj.tableTitle,'支部成员信息'); 
        } else if(filterObj.type===1){
            //下载所有数据
            let arr = JSON.parse(JSON.stringify(data.list));
            let downDate = downDateStyle(arr);
            downLoadExcel(downDate, filterObj.listTitle, filterObj.tableTitle,'支部成员信息'); 
        }
    }
    function downDateStyle(list){
        return dateTranfer(ptdToAddress(list));
    }

    // 从表格中导入数据
    // fileList是文件名列表
    // filesObj.fileList, filesObj.listTitle, filesObj.tableTitle
    async function loadDateFromExcel(filesObj){
        filesObj.listTitle = JSON.parse(JSON.stringify(filesObj.listTitle));
        filesObj.tableTitle = JSON.parse(JSON.stringify(filesObj.tableTitle));

        let fileList = filesObj.fileList;
        let tableArray = [];
        let _data = [];
        console.log('filesObj:',filesObj);

        for(let i=0;i<fileList.length;i++){
            try{
                _data = await importfxx(fileList[i].raw, filesObj.listTitle,filesObj.tableTitle);
                
                console.log("beforeStyle:",_data)
                _data = loadDateStyle(_data);
                console.log("afterStyle:",_data);
                tableArray = tableArray.concat(_data);
                tableArray = arrUni(tableArray);
                
            } catch(e){
                console.log('erro:',e)
                return [];
            }
        }
        return tableArray;
    }

    //list是一个数组
    function loadDateStyle(list){
        list = arrUni(list);

        let item;
        //把list中的每一项转换成字符串
        for(let i=0;i<list.length;i++){
            item = list[i];
            for(let k in item){
                if(Object.prototype.hasOwnProperty.call(item,k)){
                //》》》》这里其实涉及到一个问题，我们通过importfxx从表格获取的数据不一定都是字符串类型的数据，
                    item[k] = item[k]+'';
                    if(k==="actvTrainTime"||k==='devTrainTime'){
                        // arr = [];
                        item[k] = item[k].split(',');
                    }
                }
            }
        }

        return addressToPtd(dateBack(list));
    }
    

     // 关于每条数据中每个属性值0,1,2..代表什么可见：../api/formDate.js
     var data = {
         perPageNum: 5,
         listTitle:['stuId','name','gender','national','birthday','branch','proED','class','stage'],
         tableTitle:['学号','姓名','性别','民族','生日','支部','学历','班级','所处阶段'],
         
        //  list:[
        //     {stuId:"1671172",name:'赵亮',gender:'1',national:'1',birthday:"1997-06-07",branch:'1',proED:'1',grade:'1',class:'1',stage:'3'},
        //     {stuId:"1671173",name:'钱亮',gender:'2',national:'2',birthday:"1997-06-07",branch:'2',proED:'2',grade:'1',class:'2',stage:'1'},
        //     {stuId:"1771172",name:'孙亮',gender:'1',national:'1',birthday:"1997-06-07",branch:'3',proED:'1',grade:'1',class:'3',stage:'2'},
        //     {stuId:"1771173",name:'李亮',gender:'1',national:'3',birthday:"1997-06-07",branch:'2',proED:'2',grade:'1',class:'2',stage:'2'},
        //     {stuId:"1871173",name:'周亮',gender:'1',national:'2',birthday:"1997-06-07",branch:'2',proED:'3',grade:'1',class:'2',stage:'3'},
        //     {stuId:"1871172",name:'吴亮',gender:'2',national:'1',birthday:"1997-06-07",branch:'1',proED:'2',grade:'1',class:'1',stage:'1'},
        //     {stuId:"1971172",name:'郑亮',gender:'2',national:'3',birthday:"1997-06-07",branch:'3',proED:'1',grade:'1',class:'3',stage:'2'},
        //     {stuId:"1971173",name:'王亮',gender:'1',national:'2',birthday:"1997-06-07",branch:'1',proED:'1',grade:'1',class:'2',stage:'1'},
           
        // ],

        list:[
            {
                stuId:"1871232",//学号
                name:'孙亮',//姓名
                gender:'1',//性别
                phone:'123415',//联系方式
                national:'1',//民族
                home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
                idCard:'13141414',//身份证
                birthday:'19950102',//出生日期
                grade:'1',//年级
                class:'1',//班级
                proED:'1',//学历
                tutor:'张李',//导师
                stage:'1',//所处阶段
                bedroom:'3舍A231',//寝室
                duty:'班长',//职务
                branch:'1',//所在支部
                imgUrl:'',//照片
                
                pTeacher:'李福',//培养联系人
                leader:'上官云',//入党介绍人
                applyFileNumber:'13415',//入党志愿书编号
            
            
                // 申请入党阶段
                applyTime:'20190920',//申请入党时间
                talkTime:'20191005',//谈心谈话时间
            
                //入党积极分子的确定和培养阶段
                electLeagueTime:'20191025',//团推优时间
                actvTime:'20190511',//确定积极分子时间
                actvTrainTime:['20200708','20200801'],//积极分子培训时间
                actvTrainResult:'1',//积极分子培训班结业情况
            
                //发展对象的确定和考察阶段
                devTime:'20201201',//确定发展对象时间
                devTrainTime:['20210201','20210302'],//发展对象培训时间
                devTrainResult:'1',//发展对象培训班结业情况
                classRank:'6',//业务课排名
                extFileTime:'20210412',//外调材料日期
                polFileTime:'20210412',//政审材料日期
                candidateTime:'20210402',//拟发展时间
                hPartyPreCheckTime:'20210418',//发展党员上级党委预审日期
                pubTime:'20210501',//公示日期
            
                // 预备党员的接收阶段
                jnTime:'20210502',//入党时间
                aPartyCheckTime:'20210503',//入党总支审查日期
                hPartyTalkTime:'20210504',//发展党员上级组织谈话日期
                hPartyPassTime:'20210505',//入党上级党委审批日期
                
                
                // 预备党员的教育考察和转正阶段
                confirmTime:'20210506',//转正时间
                partyConfirmTime:'20210506',//转正总支审查日期
                hPartyConfirmTime:'20210507',//转正上级党委审批日期
                delayReadyTime:'20210508',//延长预备期日期
                delayCheckTime:'20210508',//延长预备期总支审查日期
                delayConfirmTime:'20210512',//延长预备期党委审批日期
            
            
                note:'信息好多，代码好长',//备注
            
            },

            {
                stuId:"1571232",//学号
                name:'赵亮',//姓名
                gender:'2',//性别
                phone:'123415',//联系方式
                national:'2',//民族
                home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
                idCard:'13141414',//身份证
                birthday:'199501012',//出生日期
                grade:'1',//年级
                class:'1',//班级
                proED:'1',//学历
                tutor:'张李',//导师
                stage:'1',//所处阶段
                bedroom:'3舍A231',//寝室
                duty:'班长',//职务
                branch:'1',//所在支部
                imgUrl:'',//照片
                
                pTeacher:'李福',//培养联系人
                leader:'上官云',//入党介绍人
                applyFileNumber:'13415',//入党志愿书编号
            
            
                // 申请入党阶段
                applyTime:'20190920',//申请入党时间
                talkTime:'20191005',//谈心谈话时间
            
                //入党积极分子的确定和培养阶段
                electLeagueTime:'20191025',//团推优时间
                actvTime:'2020051',//确定积极分子时间
                actvTrainTime:['20200708','20200801'],//积极分子培训时间
                actvTrainResult:'1',//积极分子培训班结业情况
            
                //发展对象的确定和考察阶段
                devTime:'20201201',//确定发展对象时间
                devTrainTime:['20210201','20210302'],//发展对象培训时间
                devTrainResult:'1',//发展对象培训班结业情况
                classRank:'6',//业务课排名
                extFileTime:'20210412',//外调材料日期
                polFileTime:'20210412',//政审材料日期
                candidateTime:'20210402',//拟发展时间
                hPartyPreCheckTime:'20210418',//发展党员上级党委预审日期
                pubTime:'20210501',//公示日期
            
                // 预备党员的接收阶段
                jnTime:'20210502',//入党时间
                aPartyCheckTime:'20210503',//入党总支审查日期
                hPartyTalkTime:'20210504',//发展党员上级组织谈话日期
                hPartyPassTime:'20210505',//入党上级党委审批日期
                
                
                // 预备党员的教育考察和转正阶段
                confirmTime:'20190506',//转正时间
                partyConfirmTime:'20210506',//转正总支审查日期
                hPartyConfirmTime:'20210507',//转正上级党委审批日期
                delayReadyTime:'20210508',//延长预备期日期
                delayCheckTime:'20210508',//延长预备期总支审查日期
                delayConfirmTime:'20210512',//延长预备期党委审批日期
            
            
                note:'信息好多，代码好长',//备注
            
            },

            {
                stuId:"1971632",//学号
                name:'钱赋',//姓名
                gender:'1',//性别
                phone:'123415',//联系方式
                national:'1',//民族
                home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
                idCard:'13141414',//身份证
                birthday:'19950102',//出生日期
                grade:'1',//年级
                class:'1',//班级
                proED:'1',//学历
                tutor:'张李',//导师
                stage:'1',//所处阶段
                bedroom:'3舍A231',//寝室
                duty:'班长',//职务
                branch:'1',//所在支部
                imgUrl:'',//照片
                
                pTeacher:'李福',//培养联系人
                leader:'上官云',//入党介绍人
                applyFileNumber:'13415',//入党志愿书编号
            
            
                // 申请入党阶段
                applyTime:'20190920',//申请入党时间
                talkTime:'20191005',//谈心谈话时间
            
                //入党积极分子的确定和培养阶段
                electLeagueTime:'20191025',//团推优时间
                actvTime:'2020051',//确定积极分子时间
                actvTrainTime:['20190708','20190801'],//积极分子培训时间
                actvTrainResult:'1',//积极分子培训班结业情况
            
                //发展对象的确定和考察阶段
                devTime:'20201201',//确定发展对象时间
                devTrainTime:['20210201','20210302'],//发展对象培训时间
                devTrainResult:'1',//发展对象培训班结业情况
                classRank:'6',//业务课排名
                extFileTime:'20210412',//外调材料日期
                polFileTime:'20210412',//政审材料日期
                candidateTime:'20210402',//拟发展时间
                hPartyPreCheckTime:'20210418',//发展党员上级党委预审日期
                pubTime:'20210501',//公示日期
            
                // 预备党员的接收阶段
                jnTime:'20210502',//入党时间
                aPartyCheckTime:'20210503',//入党总支审查日期
                hPartyTalkTime:'20210504',//发展党员上级组织谈话日期
                hPartyPassTime:'20210505',//入党上级党委审批日期
                
                
                // 预备党员的教育考察和转正阶段
                confirmTime:'20210506',//转正时间
                partyConfirmTime:'20210506',//转正总支审查日期
                hPartyConfirmTime:'20210507',//转正上级党委审批日期
                delayReadyTime:'20210508',//延长预备期日期
                delayCheckTime:'20210508',//延长预备期总支审查日期
                delayConfirmTime:'20210512',//延长预备期党委审批日期
            
            
                note:'信息好多，代码好长',//备注
            
            },

            {
                stuId:"1671232",//学号
                name:'孙科',//姓名
                gender:'1',//性别
                phone:'123415',//联系方式
                national:'1',//民族
                home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
                idCard:'13141414',//身份证
                birthday:'19950102',//出生日期
                grade:'1',//年级
                class:'1',//班级
                proED:'1',//学历
                tutor:'张李',//导师
                stage:'1',//所处阶段
                bedroom:'3舍A231',//寝室
                duty:'班长',//职务
                branch:'1',//所在支部
                imgUrl:'',//照片
                
                pTeacher:'李福',//培养联系人
                leader:'上官云',//入党介绍人
                applyFileNumber:'13415',//入党志愿书编号
            
            
                // 申请入党阶段
                applyTime:'20190920',//申请入党时间
                talkTime:'20191005',//谈心谈话时间
            
                //入党积极分子的确定和培养阶段
                electLeagueTime:'20191025',//团推优时间
                actvTime:'2020051',//确定积极分子时间
                actvTrainTime:['20200708','20200801'],//积极分子培训时间
                actvTrainResult:'1',//积极分子培训班结业情况
            
                //发展对象的确定和考察阶段
                devTime:'20201201',//确定发展对象时间
                devTrainTime:['20210201','20210302'],//发展对象培训时间
                devTrainResult:'1',//发展对象培训班结业情况
                classRank:'6',//业务课排名
                extFileTime:'20210412',//外调材料日期
                polFileTime:'20210412',//政审材料日期
                candidateTime:'20210402',//拟发展时间
                hPartyPreCheckTime:'20210418',//发展党员上级党委预审日期
                pubTime:'20210501',//公示日期
            
                // 预备党员的接收阶段
                jnTime:'20210502',//入党时间
                aPartyCheckTime:'20210503',//入党总支审查日期
                hPartyTalkTime:'20210504',//发展党员上级组织谈话日期
                hPartyPassTime:'20210505',//入党上级党委审批日期
                
                
                // 预备党员的教育考察和转正阶段
                confirmTime:'20210506',//转正时间
                partyConfirmTime:'20210506',//转正总支审查日期
                hPartyConfirmTime:'20210507',//转正上级党委审批日期
                delayReadyTime:'20210508',//延长预备期日期
                delayCheckTime:'20210508',//延长预备期总支审查日期
                delayConfirmTime:'20210512',//延长预备期党委审批日期
            
            
                note:'信息好多，代码好长',//备注
            
            },
            {
                stuId:"1971172",//学号
                name:'李亮',//姓名
                gender:'2',//性别
                phone:'123415',//联系方式
                national:'1',//民族
                home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
                idCard:'13141414',//身份证
                birthday:'19950102',//出生日期
                grade:'1',//年级
                class:'1',//班级
                proED:'1',//学历
                tutor:'张李',//导师
                stage:'1',//所处阶段
                bedroom:'3舍A231',//寝室
                duty:'班长',//职务
                branch:'1',//所在支部
                imgUrl:'',//照片
                
                pTeacher:'李福',//培养联系人
                leader:'上官云',//入党介绍人
                applyFileNumber:'13415',//入党志愿书编号
            
            
                // 申请入党阶段
                applyTime:'20190920',//申请入党时间
                talkTime:'20191005',//谈心谈话时间
            
                //入党积极分子的确定和培养阶段
                electLeagueTime:'20191025',//团推优时间
                actvTime:'2020051',//确定积极分子时间
                actvTrainTime:['20200708','20200801'],//积极分子培训时间
                actvTrainResult:'1',//积极分子培训班结业情况
            
                //发展对象的确定和考察阶段
                devTime:'20201201',//确定发展对象时间
                devTrainTime:['20210201','20210302'],//发展对象培训时间
                devTrainResult:'1',//发展对象培训班结业情况
                classRank:'6',//业务课排名
                extFileTime:'20210412',//外调材料日期
                polFileTime:'20210412',//政审材料日期
                candidateTime:'20210402',//拟发展时间
                hPartyPreCheckTime:'20210418',//发展党员上级党委预审日期
                pubTime:'20210501',//公示日期
            
                // 预备党员的接收阶段
                jnTime:'20210502',//入党时间
                aPartyCheckTime:'20210503',//入党总支审查日期
                hPartyTalkTime:'20210504',//发展党员上级组织谈话日期
                hPartyPassTime:'20210505',//入党上级党委审批日期
                
                
                // 预备党员的教育考察和转正阶段
                confirmTime:'20210506',//转正时间
                partyConfirmTime:'20210506',//转正总支审查日期
                hPartyConfirmTime:'20210507',//转正上级党委审批日期
                delayReadyTime:'20210508',//延长预备期日期
                delayCheckTime:'20210508',//延长预备期总支审查日期
                delayConfirmTime:'20210512',//延长预备期党委审批日期
            
            
                note:'信息好多，代码好长',//备注
            
            },

            {
                stuId:"1871260",//学号
                name:'周溙',//姓名
                gender:'2',//性别
                phone:'123415',//联系方式
                national:'1',//民族
                home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
                idCard:'13141414',//身份证
                birthday:'19950102',//出生日期
                grade:'1',//年级
                class:'1',//班级
                proED:'1',//学历
                tutor:'张李',//导师
                stage:'1',//所处阶段
                bedroom:'3舍A231',//寝室
                duty:'班长',//职务
                branch:'1',//所在支部
                imgUrl:'',//照片
                
                pTeacher:'李福',//培养联系人
                leader:'上官云',//入党介绍人
                applyFileNumber:'13415',//入党志愿书编号
            
            
                // 申请入党阶段
                applyTime:'20190920',//申请入党时间
                talkTime:'20191005',//谈心谈话时间
            
                //入党积极分子的确定和培养阶段
                electLeagueTime:'20191025',//团推优时间
                actvTime:'2020051',//确定积极分子时间
                actvTrainTime:['20200708','20200801'],//积极分子培训时间
                actvTrainResult:'1',//积极分子培训班结业情况
            
                //发展对象的确定和考察阶段
                devTime:'20201201',//确定发展对象时间
                devTrainTime:['20210201','20210302'],//发展对象培训时间
                devTrainResult:'1',//发展对象培训班结业情况
                classRank:'6',//业务课排名
                extFileTime:'20210412',//外调材料日期
                polFileTime:'20210412',//政审材料日期
                candidateTime:'20210402',//拟发展时间
                hPartyPreCheckTime:'20210418',//发展党员上级党委预审日期
                pubTime:'20210501',//公示日期
            
                // 预备党员的接收阶段
                jnTime:'20210502',//入党时间
                aPartyCheckTime:'20210503',//入党总支审查日期
                hPartyTalkTime:'20210504',//发展党员上级组织谈话日期
                hPartyPassTime:'20210505',//入党上级党委审批日期
                
                
                // 预备党员的教育考察和转正阶段
                confirmTime:'20210506',//转正时间
                partyConfirmTime:'20210506',//转正总支审查日期
                hPartyConfirmTime:'20210507',//转正上级党委审批日期
                delayReadyTime:'20210508',//延长预备期日期
                delayCheckTime:'20210508',//延长预备期总支审查日期
                delayConfirmTime:'20210512',//延长预备期党委审批日期
            
            
                note:'信息好多，代码好长',//备注
            
            },

            {
                stuId:"1875894",//学号
                name:'吴使',//姓名
                gender:'1',//性别
                phone:'123415',//联系方式
                national:'3',//民族
                home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
                idCard:'13141414',//身份证
                birthday:'19950102',//出生日期
                grade:'1',//年级
                class:'1',//班级
                proED:'1',//学历
                tutor:'张李',//导师
                stage:'1',//所处阶段
                bedroom:'3舍A231',//寝室
                duty:'班长',//职务
                branch:'1',//所在支部
                imgUrl:'',//照片
                
                pTeacher:'李福',//培养联系人
                leader:'上官云',//入党介绍人
                applyFileNumber:'13415',//入党志愿书编号
            
            
                // 申请入党阶段
                applyTime:'20190920',//申请入党时间
                talkTime:'20191005',//谈心谈话时间
            
                //入党积极分子的确定和培养阶段
                electLeagueTime:'20191025',//团推优时间
                actvTime:'2020051',//确定积极分子时间
                actvTrainTime:['20200708','20200801'],//积极分子培训时间
                actvTrainResult:'1',//积极分子培训班结业情况
            
                //发展对象的确定和考察阶段
                devTime:'20201201',//确定发展对象时间
                devTrainTime:['20210201','20210302'],//发展对象培训时间
                devTrainResult:'1',//发展对象培训班结业情况
                classRank:'6',//业务课排名
                extFileTime:'20210412',//外调材料日期
                polFileTime:'20210412',//政审材料日期
                candidateTime:'20210402',//拟发展时间
                hPartyPreCheckTime:'20210418',//发展党员上级党委预审日期
                pubTime:'20210501',//公示日期
            
                // 预备党员的接收阶段
                jnTime:'20210502',//入党时间
                aPartyCheckTime:'20210503',//入党总支审查日期
                hPartyTalkTime:'20210504',//发展党员上级组织谈话日期
                hPartyPassTime:'20210505',//入党上级党委审批日期
                
                
                // 预备党员的教育考察和转正阶段
                confirmTime:'20210506',//转正时间
                partyConfirmTime:'20210506',//转正总支审查日期
                hPartyConfirmTime:'20210507',//转正上级党委审批日期
                delayReadyTime:'20210508',//延长预备期日期
                delayCheckTime:'20210508',//延长预备期总支审查日期
                delayConfirmTime:'20210512',//延长预备期党委审批日期
            
            
                note:'信息好多，代码好长',//备注
            
            },
        ]
     };


    // function getDateLength(){
    //     return data.length;
    // }

    return [addDate,deltDate,cInfor,fetchData,setNewData,isInDate,getTitle,downDate,fetchDataByStuId,loadDateFromExcel];



    



})();

let [addDate,deltDate,cInfor,fetchData,setNewData,isInDate,getTitle,downDate,fetchDataByStuId,loadDateFromExcel] = [...dataFun];


export {addDate,deltDate,cInfor,fetchData,setNewData,isInDate,getTitle,downDate,fetchDataByStuId,loadDateFromExcel}




var downLoadTemp = {
    stuId:"1871232",//学号
    name:'孙亮',//姓名
    gender:'1',//性别
    phone:'123415',//联系方式
    national:'1',//民族
    home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
    idCard:'13141414',//身份证
    birthday:'19950102',//出生日期
    grade:'1',//年级
    class:'1',//班级
    proED:'1',//学历
    tutor:'张李',//导师
    stage:'1',//所处阶段
    bedroom:'3舍A231',//寝室
    duty:'班长',//职务
    branch:'1',//所在支部
    imgUrl:'',//照片
    
    pTeacher:'李福',//培养联系人
    leader:'上官云',//入党介绍人
    applyFileNumber:'13415',//入党志愿书编号


    // 申请入党阶段
    applyTime:'20190920',//申请入党时间
    talkTime:'20191005',//谈心谈话时间

    //入党积极分子的确定和培养阶段
    electLeagueTime:'20191025',//团推优时间
    actvTime:'20190511',//确定积极分子时间
    actvTrainTime:['20200708','20200801'],//积极分子培训时间
    actvTrainResult:'1',//积极分子培训班结业情况

    //发展对象的确定和考察阶段
    devTime:'20201201',//确定发展对象时间
    devTrainTime:['20210201','20210302'],//发展对象培训时间
    devTrainResult:'1',//发展对象培训班结业情况
    classRank:'6',//业务课排名
    extFileTime:'20210412',//外调材料日期
    polFileTime:'20210412',//政审材料日期
    candidateTime:'20210402',//拟发展时间
    hPartyPreCheckTime:'20210418',//发展党员上级党委预审日期
    pubTime:'20210501',//公示日期

    // 预备党员的接收阶段
    jnTime:'20210502',//入党时间
    aPartyCheckTime:'20210503',//入党总支审查日期
    hPartyTalkTime:'20210504',//发展党员上级组织谈话日期
    hPartyPassTime:'20210505',//入党上级党委审批日期
    
    
    // 预备党员的教育考察和转正阶段
    confirmTime:'20210506',//转正时间
    partyConfirmTime:'20210506',//转正总支审查日期
    hPartyConfirmTime:'20210507',//转正上级党委审批日期
    delayReadyTime:'20210508',//延长预备期日期
    delayCheckTime:'20210508',//延长预备期总支审查日期
    delayConfirmTime:'20210512',//延长预备期党委审批日期


    note:'信息好多，代码好长',//备注

};
// console.log('person',person);

