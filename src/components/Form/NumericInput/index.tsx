import React, {useState,useEffect} from 'react';
import { Tooltip } from 'antd'
import { digitUppercase } from '@/utils/utils'
import Input, { InputProps } from 'antd/lib/input';

export interface NumericInputProps extends Omit<InputProps, 'onChange'> {
  onChange?: (value: any) => void;
  min?: number;
  max?: number;
  precision?: number; // 小数点几位精度 0表示必须整数
  tooltip?:boolean; // 是否显示浮层
  mode?:'money'|'number' 
}
const NumericInput: React.FC<NumericInputProps> = (props) => {
  const {
    min=0,
    // max,
    precision = 2, // 
    placeholder = "请填写数字",
    
    // value, 
    onBlur, 
    onChange,
    mode='number'
    // tooltip
  } = props;
  // let {
  //   max,
  // }= props;
  const [maxLength,setMaxLength] = useState(props.maxLength);
  const [max,setMax] = useState(props.max);
  const [number,setNumber] = useState(props.value);
  useEffect(()=>{
    // 由于数字精度问题 设置数字最大值
    if(mode==='money'){
      if(!maxLength){
        setMaxLength(16)
      }
      
      if(!max){
        setMax(99999999999999)
      }
      
    }
  },[])
  useEffect(()=>{
    setNumber(props.value)
    
  },[props.value])
  const pvalue = props.value||'';
  const handleChange = e => {
    const { value } = e.target;
    
    const reg = precision === 0 ? /^-?[0-9]*([0-9]*)?$/ : /^-?[0-9]*(\.[0-9]*)?$/;
    if (((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') && onChange) {
      let valueTemp =value
      if (precision) {
        const index = value.indexOf('.')
        valueTemp = index > 0 ? value.slice(0, index + precision + 1) : value
      }
      // setNumber(valueTemp)
      onChange(valueTemp);
    }

  };

  // '.' at the end or only '-' in the input box.
  const handleBlur = (e) => {
    if (onChange) {
      const valueStr = pvalue.toString()
      let valueTemp = pvalue.toString()
      if (valueStr.charAt(valueStr.length - 1) === '.' || valueStr === '-') {
        valueTemp = valueStr.slice(0, -1);
      }
      if (min!==undefined&&!Number.isNaN(min) && pvalue < min) {
        // setNumber(min)
        return onChange(min);
      }
      if (max && pvalue > max) {
        // setNumber(max)
        return onChange(max);
      }
      if (precision) {
        const index = valueTemp.indexOf('.')
        valueTemp = index > 0 ? valueTemp.slice(0, index + precision + 1) : valueTemp
      }
      const aa = valueTemp.replace(/0*(\d+)/, '$1')
      // setNumber(aa)
      onChange(aa);
      if (onBlur) {
        onBlur(e);
      }
    }

  };
  

  return <div className="numericInput" style={{display:'inline'}}>
    <Input  {...props}
  autoComplete="off"
  onChange={handleChange}
  onBlur={handleBlur}
  placeholder={placeholder}
  maxLength={maxLength} />
  {(mode==='money'&&number&&number!=='0')?<span style={{color:'#888'}}>{digitUppercase(number)}</span>:''}
  </div>

}
export default NumericInput
