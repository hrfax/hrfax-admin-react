import React from 'react';
import { Input, Tooltip } from 'antd';

function formatNumber(value) {
  // eslint-disable-next-line no-param-reassign
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

class InputNumber extends React.Component<any> {
  onChange = e => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    // eslint-disable-next-line no-restricted-globals
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.props.onChange(value);
    }
  };

  // '.' at the end or only '-' in the input box.
  onBlur = () => {
    const { value='', onBlur, onChange } = this.props;
    let valueTemp = value;
    if (value && value.charAt(value.length - 1) === '.' || value === '-') {
      valueTemp = value.slice(0, -1);
    }
    onChange(valueTemp.replace(/0*(\d+)/, '$1'));
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const { value } = this.props;
    const title = value ? (
      <span className="numeric-input-title">{value !== '-' ? formatNumber(value) : '-'}</span>
    ) : (
      'Input a number'
    );
    return (
      <Tooltip
        trigger={['focus']}
        title={title}
        placement="topLeft"
        overlayClassName="numeric-input"
      >
        <Input
          {...this.props}
          onChange={this.onChange}
          onBlur={this.onBlur}
          placeholder="Input a number"
          maxLength={25}
        />
      </Tooltip>
    );
  }
}

export default InputNumber