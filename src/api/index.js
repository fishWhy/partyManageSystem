// import request from '../utils/request';

// export const fetchData = query => {
//     return request({
//         url: './table.json',
//         method: 'get',
//         params: query
//     });
// };

//返回处理数据的函数数组，数据以闭包的型式保存。
let dataFun = (function(){
    let data = {list:[
            {id:"1871172",name:'胡亮',gender:'男',birthday:"1997-06-07",major:'计算机软件',proED:'博士',political:'党员',time:'2019-10-01'},
            {id:"1871173",name:'马亮',gender:'男',birthday:"1997-06-07",major:'软件工程',proED:'研究生',political:'党员',time:'2019-10-01'},
            {id:"1871174",name:'李华',gender:'女',birthday:"2000-08-09",major:'计算机软件',proED:'大学',political:'预备党员',time:'2019-10-01'},
            {id:"1871175",name:'钱红',gender:'女',birthday:"2004-03-12",major:'软件工程',proED:'研究生',political:'入党积极分子',time:'2019-10-01'},
            {id:"1871176",name:'钱都',gender:'女',birthday:"2004-03-12",major:'软件工程',proED:'研究生',political:'入党积极分子',time:'2019-10-01'},
            {id:"1871177",name:'钱来',gender:'女',birthday:"2004-03-12",major:'软件工程',proED:'研究生',political:'入党积极分子',time:'2019-10-01'},


        ],
        perPageNum: 5,
        listTitle:['id','name','gender','birthday','major','proED','political','time'],
        tableTitle:['学号','姓名','性别','生日','专业','学历','政治面貌','入党时间']   
    };

     //数组去重
    function arrUni(arr){
        if(!arr||arr.length===0) return [];

        for(let i=arr.length-1;i>0;i--){
            let val = arr[i];
            for(let j=i-1;j>=0;j--){
                if(val.id+''===arr[j].id+''){
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
    function addData(dataArr){
        return new Promise(function(resolve){
            dataArr = arrUni(dataArr);
            data.list = data.list.concat(dataArr);
            data.list = arrUni(data.list);
            // console.log('data_list:',data.list);
            resolve('202');
        })
    }
     

    //删
    //删除id为id的那条数据
    function deltData(idArr){
        return new Promise(function(resolve,reject){
            if(!(idArr instanceof Array)||idArr.length<=0) {reject('删除数据失败');return;}
            let idObj = {};
            // len = idArr.length
            for (let j = 0; j < idArr.length; j++) {
                idObj[idArr[j]] = true;
            }

            for(let i=data.list.length-1;i>=0;i--){
                if(idObj[data.list[i].id]){
                    data.list.splice(i,1);
                    // len--;
                } 
            }



            resolve('成功删除')

            //未查找到对应的数据，无法删除
            // reject(id);
        })
        
    }

    //改
    //使用infor对象改变存储在data中的infor.id的信息
    function cInfor(infor){
        return new Promise(function(resolve,reject){
            for(let i=data.list.length-1;i>=0;i--){
                if(data.list[i].id===infor.id){
                    data.list[i] = infor;
                    resolve(infor.id)
                    return;
                }
            }
            //未查找到对应的数据，无法修改
            reject(infor.id);
        }) 
    }

    //查
    //以query为条件查找数据
    function fetchData(query){
        return new Promise(function(resolve){
            
            console.log(query);
            let _data={list:[],listTitle:[],tableTitle:[],perPageNum:20},isSelected;
            _data.listTitle = data.listTitle;
            _data.tableTitle = data.tableTitle;
            _data.perPageNum = data.perPageNum;


            data.list.forEach((item)=>{
                isSelected = true;
                for(let key in item){
                    if(Object.prototype.hasOwnProperty.call(item,key)&&query[key]&&(query[key]!==item[key])){
                        console.log('key:',key,'  the value:',query[key], '  the item valu:',item[key]);
                        // 对于id，只要item[key]是以query[key]开头的就行
                        if((key==='id')&&(String(item[key]).indexOf(query[key])===0)){
                            continue;
                        }
                        isSelected = false;break;
                    }
                }
                if(isSelected){
                    //为了将数据隔离开，这里进行了深拷贝，由于item结构比较简单，这里的深拷贝方法也比较简易
                    _data.list.push(JSON.parse(JSON.stringify(item)));
                }
            })
            resolve(_data);
        })
        
    }


    // 将data.list的值更新为 tableData
    function setNewData (tableData){
         return new Promise(function(resolve){
            data.list = tableData;
            resolve('202');
         })
    }
    return [addData,deltData,cInfor,fetchData,setNewData];



})();

let [addData,deltData,cInfor,fetchData,setNewData] = [...dataFun];


export {addData,deltData,cInfor,fetchData,setNewData}