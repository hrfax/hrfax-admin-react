import React, {useState} from 'react';
import NumericInput,{ NumericInputProps } from '@/components/Form/NumericInput';
import { Divider, Checkbox } from 'antd';
interface LimitValue {
  isLimit?:boolean, // 是否限制
  number?:number|string;
}
export interface LimitInputProps extends Omit<NumericInputProps,'value'>  {
    value?: LimitValue;
    onChange?: (value: LimitValue) => void;
    unit?:string;
    min?:number
}

const LimitInput: React.FC<LimitInputProps> = (rest) => {
  const {
    unit="元",
    precision=2,
    value={},
    min=0,
    onChange
  } = rest
  const [disabled, setDisabled] = useState();
  const [number, setNumber] = useState<string|number>();
  const [isLimit, setLimit] = useState();
  const triggerChange = changedValue => {
    if (onChange) {
      onChange({ number, isLimit, ...value, ...changedValue });
    }
  };

  const onNumberChange = e => {
    const newNumber = e // .target.value
    if (Number.isNaN(number)) {
      return;
    }
    setNumber(newNumber);
    triggerChange({ number: newNumber });
  };

  const onLimitChange = (e:any) => {
    const {checked} = e.target
    const num =checked?'0':''
    setLimit(checked);
    setDisabled(checked);
    setNumber(num);
    triggerChange({ isLimit:checked,number:num });
  };

  // const onChange = (e:any)=>{
  //   rest.onChange('')
  //   setDisabled(e.target.checked)
  // }
  return <NumericInput min={min} mode="money" value={number===undefined?value.number:number} onChange={onNumberChange} precision={precision} disabled={disabled===undefined?value.isLimit:disabled} suffix={<div>{unit}<Divider type="vertical"/><Checkbox checked={isLimit===undefined?value.isLimit:isLimit} onChange={onLimitChange}>不限</Checkbox></div>}/>
}
export default LimitInput
