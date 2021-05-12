// import request from '../utils/request';
import { downLoadExcel} from "../utils/excel/upDownExcel.js";

// export const fetchData = query => {
//     return request({
//         url: './table.json',
//         method: 'get',
//         params: query
//     });
// };

//返回处理数据的函数数组，数据以闭包的型式保存。
let dataFun = (function(){
    // 关于每条数据中每个属性值0,1,2..代表什么可见：../api/formDate.js
    let data = {list:[
            {stuId:"1671172",name:'赵亮',gender:'1',national:'1',birthday:"1997-06-07",branch:'1',proED:'1',grade:'1',class:'1',stage:'3'},
            {stuId:"1671173",name:'钱亮',gender:'2',national:'2',birthday:"1997-06-07",branch:'2',proED:'2',grade:'1',class:'2',stage:'1'},
            {stuId:"1771172",name:'孙亮',gender:'1',national:'1',birthday:"1997-06-07",branch:'3',proED:'1',grade:'1',class:'3',stage:'2'},
            {stuId:"1771173",name:'李亮',gender:'1',national:'3',birthday:"1997-06-07",branch:'2',proED:'2',grade:'1',class:'2',stage:'2'},
            {stuId:"1871173",name:'周亮',gender:'1',national:'2',birthday:"1997-06-07",branch:'2',proED:'3',grade:'1',class:'2',stage:'3'},
            {stuId:"1871172",name:'吴亮',gender:'2',national:'1',birthday:"1997-06-07",branch:'1',proED:'2',grade:'1',class:'1',stage:'1'},
            {stuId:"1971172",name:'郑亮',gender:'2',national:'3',birthday:"1997-06-07",branch:'3',proED:'1',grade:'1',class:'3',stage:'2'},
            {stuId:"1971173",name:'王亮',gender:'1',national:'2',birthday:"1997-06-07",branch:'1',proED:'1',grade:'1',class:'2',stage:'1'},

           

        ],
        perPageNum: 5,
        listTitle:['stuId','name','gender','national','birthday','branch','proED','class','stage'],
        tableTitle:['学号','姓名','性别','民族','生日','支部','学历','班级','所处阶段']   
    };

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
        console.log('infor:',infor)
        return new Promise(function(resolve,reject){
            for(let i=data.list.length-1;i>=0;i--){
                if(data.list[i].stuId===infor.stuId){
                    data.list[i] = infor;
                    console.log('that is all right')
                    resolve(infor.stuId)
                    return;
                }
            }
            //未查找到对应的数据，无法修改
            reject(infor.stuId);
        }) 
    }

    //查
    //以query为条件查找数据
    function fetchData(query){
        return new Promise(function(resolve){
            

            console.log(query);
            // let _data={list:[],listTitle:[],tableTitle:[]},isSelected;
            // _data.listTitle = data.listTitle;
            // _data.tableTitle = data.tableTitle;


            let _data= [], isSelected;


            data.list.forEach((item)=>{
                isSelected = true;
                for(let key in item){
                    if(Object.prototype.hasOwnProperty.call(item,key)&&query[key]&&(query[key]!==item[key])){
                        console.log('key:',key,'  the value:',query[key], '  the item valu:',item[key]);
                        // 对于stuId，只要item[key]是以query[key]开头的就行
                        if((key==='stuId')&&(String(item[key]).indexOf(query[key])===0)){
                            continue;
                        }
                        isSelected = false;break;
                    }
                }
                if(isSelected){
                    //为了将数据隔离开，这里进行了深拷贝，由于item结构比较简单，这里的深拷贝方法也比较简易
                    _data.push(JSON.parse(JSON.stringify(item)));
                }
            })


            let len = _data.length, pageSize = data.perPageNum, pageIndex = query.pageIndex,pageTotal,
            start = Math.max((pageIndex-1)*pageSize,0),end = Math.min(pageIndex*pageSize,len);
            pageTotal = Math.max(Math.floor(len/pageSize),1);
            if(query.pageIndex>pageTotal){
                pageIndex = pageTotal;
            }

            
            let _rDate={list:[],itemTotal:'',pageSize:'',pageIndex:''};
            _rDate.list = _data.slice(start,end);
            _rDate.itemTotal = len;
            _rDate.pageSize = pageSize;
            _rDate.pageIndex = pageIndex;


            resolve(_rDate);
        })
        
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

    function downDate(filterObj){
        if(filterObj.type===1){
            downLoadExcel(data.list,data.listTitle,data.tableTitle,'支部成员信息'); 
        } else if(filterObj.type===0){
            downLoadExcel(filterObj.date[0],this.listTitle,this.tableTitle,'支部成员信息'); 
        }
    }
    


    // function getDateLength(){
    //     return data.length;
    // }

    return [addDate,deltDate,cInfor,fetchData,setNewData,isInDate,getTitle,downDate];



})();

let [addDate,deltDate,cInfor,fetchData,setNewData,isInDate,getTitle,downDate] = [...dataFun];


export {addDate,deltDate,cInfor,fetchData,setNewData,isInDate,getTitle,downDate}




let person = {
    stuId:"1871232",//学号
    name:'孙亮',//姓名
    gender:'1',//性别
    phone:'123415',//联系方式
    national:'1',//民族
    home:["130000","130300","130303"],//籍贯,使用了element-china-area-data
    idCard:'13141414',//身份证
    birthday:'1995-01-02',//出生日期
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
    applyTime:'2019-09-20',//申请入党时间
    talkTime:'2019-10-05',//谈心谈话时间

    //入党积极分子的确定和培养阶段
    electLeagueTime:'2019-10-25',//团推优时间
    actvTime:'2020-05-1',//确定积极分子时间
    actvTrainTime:'2020-07-08&2020-08-01',//积极分子培训时间
    actvTrainResult:'1',//积极分子培训班结业情况

    //发展对象的确定和考察阶段
    devTime:'2020-12-01',//确定发展对象时间
    devTrainTime:'2021-02-01&2021-03-02',//发展对象培训时间
    devTrainResult:'1',//发展对象培训班结业情况
    classRank:'6',//业务课排名
    extFileTime:'2021-04-12',//外调材料日期
    polFileTime:'2021-04-12',//政审材料日期
    candidateTime:'2021-04-02',//拟发展时间
    hPartyPreCheckTime:'2021-04-18',//发展党员上级党委预审日期
    pubTime:'2021-05-01',//公示日期

    // 预备党员的接收阶段
    jnTime:'2021-05-02',//入党时间
    aPartyCheckTime:'2021-05-03',//入党总支审查日期
    hPartyTalkTime:'2021-05-04',//发展党员上级组织谈话日期
    hPartyPassTime:'2021-05-05',//入党上级党委审批日期
    
    
    // 预备党员的教育考察和转正阶段
    confirmTime:'2021-05-06',//转正时间
    partyConfirmTime:'2021-05-06',//转正总支审查日期
    hPartyConfirmTime:'2021-05-07',//转正上级党委审批日期
    delayReadyTime:'2021-05-08',//延长预备期日期
    delayCheckTime:'2021-05-08',//延长预备期总支审查日期
    delayConfirmTime:'2021-05-12',//延长预备期党委审批日期


    note:'信息好多，代码好长',//备注

}
console.log('person',person);

