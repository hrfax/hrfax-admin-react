/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-syntax */
import dayjs from 'dayjs';
import moment from 'moment';


export { fetchFile } from './fetch';

export const getApiDomain = ()=> {
  const {hostname} = window.location;
  switch (hostname) {
    case 'dev.hrfax.cn':
      return '//dev-api.hrfax.cn'
    case 'test.hrfax.cn':
      return '//test-api.hrfax.cn'
    case 'www1.hrfax.cn':
    case 'www.hrfax.cn':
    case 'beta-shequ.hrfax.cn':
      return '//beta-api.hrfax.cn'
    case 'shequ.hrfax.cn':
      return '//api.hrfax.cn'
    default:
      return '//hrfax.cn'
  }

}

/**
 * format form values for api
 * @param {*} data 
 */
export const formatFormData = (data:any) =>{
  for (const key in data) {
      if (data.hasOwnProperty(key)||data.hasOwnProperty(key)===''||data.hasOwnProperty(key)===0) {
          let element = data[key];
          const keySplit = key.split('_');
          if(element || element===0){
            if(element.value){
                data[key]= element.value;
                element=element.value;
            }
            // 字符串去空格
            if(typeof(element)==='string'){
              element = element.replace(/\s+/g,"");
              data[key]= element;
            }
            if(Array.isArray(element)){
             
                // 区间
                if(element.length===2 && keySplit.length===3){
                  // 日期
                  if(key.includes('rangepicker')){
                    data[keySplit[1]]=moment(moment(element[0]).format('YYYY-MM-DD 00:00:00')).valueOf()
                    data[keySplit[2]]=moment(moment(element[1]).format('YYYY-MM-DD 23:59:59')).valueOf()
                  }
                  // 数字
                  if(key.includes('rangeNumber')){
                    data[keySplit[1]]=element[1]
                    data[keySplit[2]]=element[0]
                  }
                  delete data[key]
                }
                // 上传控件返回的值 只保留url || url&&name
                if(element[0]&&element[0].uid){
                  if(element[0].isOnlyUrl){
                    data[key] = element.map(item=>item.url)
                  }else{
                    data[key] = element.map(item=>{
                      return {
                        url:item.url,
                        name:item.name
                      }
                    })
                  }
                  
                }
                
            }
         
            
            // 富文本
            if(element.editorState){
              data[key] =element.editorState.toHTML()
            }
            
            // 城市控件取值
            if(key.includes('selectCity') && element.length===2){
              if(element.length===2&&element[0].split('_').length===2){
                const open= keySplit[1]||'';
                data[`${open}${open?'P':'p'}rovCode`] = element[0].split('_')[0];
                data[`${open}${open?'C':'c'}ityCode`] = element[1].split('_')[0];
                data[`${open}${open?'P':'p'}rovName`] = element[0].split('_')[1];
                data[`${open}${open?'C':'c'}ityName`] = element[1].split('_')[1];

                delete data[key]
              }
              
              
            }
            // 深度遍历
            if(element && Object.prototype.toString.call(element) === '[object Object]'){
                data[key]= formatFormData(element)
            }
            
          }else{
            delete data[key]
          }
          
          
      }
  }
  return data
}

export const setSessionStorage = (name:string,data:any)=>{
  sessionStorage.setItem(name, Base64.encode(JSON.stringify(data)));
}
export const getSessionStorage = (name:string)=>{
  const data = sessionStorage.getItem(name);
  const soundCode = data?Base64.decode(data):''
  if(soundCode){
    return JSON.parse(soundCode)
  }
  return null
}