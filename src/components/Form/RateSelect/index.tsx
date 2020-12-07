
import React, { useState } from 'react';
import {  Select, Input } from 'antd';
import { NumericInput } from '@/components/Form';
import * as CONST from '@/utils/constants';

const { Option } = Select;
interface PriceValue {
  number?: number;
  type?: number;
}

interface RateSelectProps {
  value?: PriceValue;
  onChange?: (value: PriceValue) => void;
  disabled?: boolean;
  precision?: number;
}

const RateSelect: React.FC<RateSelectProps> = (props) => {
  const [number, setNumber] = useState();
  const [type, settype] = useState();
  const {
    value={},
    disabled=false,
    onChange,
    precision=8
  } = props
  const triggerChange = changedValue => {
    if (onChange) {
      onChange({ number, type, ...value, ...changedValue });
    }
  };

  const onNumberChange = e => {
    const newNumber = e // .target.value
    if (Number.isNaN(number)) {
      return;
    }
    if (!('number' in value)) {
      setNumber(newNumber);
    }
    triggerChange({ number: newNumber });
  };

  const ontypeChange = newtype => {
    if (!('type' in value)) {
      settype(newtype);
    }
    triggerChange({ type: newtype });
  };

  return (
    <div>
      
      <Select
        value={value.type}
        style={{ width: '39%',marginRight:'1%' }}
        onChange={ontypeChange}
        disabled={disabled}

      >
        {
          CONST.PERIODTYPE.map(item=><Option key={item.value} value={item.value}>{item.describe}</Option>)
        }
      </Select>
      <NumericInput
        value={value.number}
        onChange={onNumberChange}
        style={{ width: '60%', }}
        suffix='%'
        disabled={disabled}
        precision={precision}
        min={0}
      />
    </div>
  );
};
export default RateSelect;