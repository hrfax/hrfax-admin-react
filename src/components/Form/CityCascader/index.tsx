import React from 'react';
import Cascader,{CascaderProps} from 'antd/lib/cascader';
import {formatTreeData} from '@/utils/utils'
import options from './options';


interface CityCascaderProps extends Omit<CascaderProps,'options'> { 
  // options?:any[]
}
const newOptions = formatTreeData(options, 'name', 'areaId', 'cityDTOList',true);
export default (props:CityCascaderProps)=>{
    const {
      onChange,
      value
    } = props
    
    function handleChange(value, selectedOptions) {
      if(onChange && typeof onChange === 'function'){
        onChange(selectedOptions)
      }
    }
    
    function filter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }
    const getSelectVal = ()=>{
      if(value&&value[0]&&value[0].value){
        return value.map(item=>item.value);
      }
      return value
    }
    // console.log(value,'Cascader===value')
    return (<Cascader
    {...props} 
    options={newOptions}
    // value={['530000_云南省','530100_昆明市']}
    // onChange={handleChange}
    showSearch={{ filter }}
    placeholder={props.placeholder||'请选择'}
  />)

}