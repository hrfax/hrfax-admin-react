/* eslint-disable array-callback-return */
// 计息方式
export const PERIODTYPE = [
  { label: '按日计息(算头不算尾)', value: 1, describe:'日费率'},
]
// 机构状态
export const ORGANIZATIONSTATUS = [
  { label: '正常', value: 1},
  { label: '待提交审核', value: 3},
]
// 关联状态
export const ORGANIZATIONSRELATIONTATUS = [
  { label: '待审核', value: 3},
  { label: '关联完成', value: 1},
]
// 服务费结算方式
export const SERVICEFEESETTLETYPE = [
  // { label: '未知', value: 0},
  { label: '体内结算', value: 1},
  { label: '体外结算', value: 2},
]
// 业务行银行列表
export const BUSINESSBANKLIST = [
  { label: '中国银行', value: 1},
  { label: '工商银行', value: 2},
]
// 银行列表
export const BANKLIST = [
  { label: '中国银行', value: 1},
  { label: '农业银行', value: 3},
  { label: '工商银行', value: 2},
  { label: '建设银行', value: 4},
  { label: '交通银行', value: 5},
  { label: '邮储银行', value: 6},
  { label: '中国光大银行', value: 7},
  { label: '中国民生银行', value: 8},
  { label: '华夏银行', value: 9},
  { label: '中信银行', value: 10},
  { label: '恒丰银行', value: 11},
  { label: '浦发银行', value: 12},
  { label: '浙商银行', value: 13},
  { label: '兴业银行', value: 14},
  { label: '招商银行', value: 15},
  { label: '杭州银行', value: 16},
  { label: '杭州联合银行', value: 17},
  { label: '温州银行', value: 18},
  { label: '广发银行', value: 19},
  { label: '萧山农商行', value: 20},
  { label: '平安银行', value: 21}
  
]



// 分期业务状态
export const INSTALLMENTBUSINESSSTATUSSTEP = [
  {label:'征信进件', value:2,step:1},
  {label:'分期准入', value:3,step:2},
  {label:'分期进件', value:12,step:3},
  {label:'分期进件', value:21,step:3},
  {label:'分期审批', value:23,step:4},
  {label:'银行放款', value:99,step:5},
  
]
// 分期业务状态
export const INSTALLMENTBUSINESSSTATUS = [
  {label:'分期准入通过', value:1},
  {label:'分期准入拒绝', value:2},
  {label:'分期审批通过', value:3},
  {label:'分期已放款', value:4},
  {label:'资方审批通过', value:5},
  
]

// 交易类型
export const TRADETYPE = [
  { label: '充值', value: 1},
  { label: '冲正', value: 2},
  { label: '支出', value: 3},
]
// 资方审核状态 
export const FUNDERAUDITSTATUS = [
  { label: '待审批', value: 200},
  { label: '审批通过', value: 202},
  { label: '审批拒绝', value: 203},
]
export const renderOptionString =(data:any[])=>{
  return data.map(item=>{
    return {
      ...item,
      value:item.value.toString()
    }
  })
}
// 转化枚举数据
export const transformEnum: any= (data:any[],hasAll=true)=>{
  // 1: { text: '按日计息(算头不算尾)' },
  const enumObj:object=hasAll?{'':{text:'全部'}}:{}
  if(data && data.length>0){
    // eslint-disable-next-line array-callback-return
    data.map((item:any) => {
      enumObj[item.value]={
        ...item,
        text:item.label
      }
    })
  }
  return enumObj
}
// 获取map对应记录
export const getMapLabel = (data:any[],value:string|number,key="label")=>{
  if(value || value===0){
      const record = data.find((item)=>{
          return item.value === value
      })
      return record?record[key]:''
  }
  return ''
  
}
// 把数据字典里返回的指定的数据转枚举类型|或CONST数组
export const transformDict =(dicts=[],dictType,isEnum=true,hasAll=true)=>{
  if(dictType){
    // 兼容老参数 单个查询
    if(!Array.isArray(dictType)){
      // eslint-disable-next-line no-param-reassign
      dictType=[dictType]
    }
    const dictList:any[] =[];
    dictType.map((item:any)=>{
      const row:any = dicts.find((it:any)=>it.dictType ===item);
      if(row?.dictList){
        dictList.push(...row.dictList)
      }
    })
    
    if(dictList.length){
      if(isEnum){
        const enumObj:object=hasAll?{'':{text:'全部'}}:{}
        dictList.map((item:any) => {
          enumObj[item.dictValue]={
            ...item,
            text:item.dictLabel
          }
        })
        return enumObj
      }
      return dictList.map((item:any) => {
        return { label: item.dictLabel, value: item.dictValue}
      })
      
    }
        
    
  }
  return []
}