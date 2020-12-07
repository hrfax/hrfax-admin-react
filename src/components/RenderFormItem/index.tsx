/* eslint-disable no-shadow */
import React, { useState } from 'react';
import { Row, Col, Input, Select, Radio, InputNumber, Rate, DatePicker, Cascader, Switch } from 'antd';
import Form, { FormItemProps } from 'antd/lib/form';
import { UploadDragger,UploadFile,AliyunOSSUpload, NumericInput,RemoteSelect,CityCascader } from '@/components/Form';
import { Rule } from 'rc-field-form/lib/interface';
import styles from './index.less'

const {
  Item
} = Form
const {
  Option
} = Select
const { TextArea } = Input;
const { RangePicker } = DatePicker;
export declare type ValueType = 'component' | 'input' | 'select' | 'inputNumber' | 'datePicker' | 'rangePicker' | 'cityCascader' | 'textArea' | 'rate' | 'numericInput' | 'switch' | 'radio' | 'uploadDragger'| 'uploadFile'| 'remoteSelect'|'aliyunOSSUpload';

interface optionProps {
  value: any;
  label: any;
}
export interface itemProps extends Omit<FormItemProps, 'children'> {
  children?:any;
  label?: any;                // 显示名称
  name?: string|string[];               // 字段名和接口字段对应
  value?: any;                // 值
  valueType?: ValueType;      // 类型
  rules?: Rule[];             // form 验证规则
  span?: number;              // 栅格 24
  component?: any;            // 自定义组件预留
  option?: optionProps[];     // 下拉选项
  mode?: string;              // 选择模式
  format?:string;             // 日期格式
  max?:number;                // 最大数字
  min?:number;                // 最小数字
  action?:string;             // 接口地址
  precision?:number;          // 小数点精确多少为
  aliasLabel?:any;            // 下拉名称别名 对应接口返回字段
  aliasValue?: any;           // 下拉值别名 对应接口返回字段
  prefix?:any;                // input类 前缀
  suffix?:any;                // input类 后缀
  maxLength?:number;          // input类 长度
}
export interface RenderFormItemProps {
  isEdit?: boolean,
  items: itemProps[],
  dataSource?: any[],
  layout?:"horizontal" | "inline" | "vertical"
}
const filterOption = (input, option)=>{
  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
}
export const renderItem = (item: itemProps, dataSource={}, isEdit) => {
  const {
    name,
    valueType = 'input',
    component= '',
    option = [],
    mode,
    format,
    action,
    max,
    min,
    maxLength,
    disabled=false
  } = item;
  // 单个设置状态
  isEdit = disabled?false:isEdit;
  let {
    initialValue
  } = item;
  initialValue = initialValue||dataSource[name]
  switch (valueType) {
    case 'component':
      return <div className="form-item-component">{component}</div>
    case 'input':
      return <Input type={mode} maxLength={maxLength} title={initialValue} prefix={item.prefix} suffix={item.suffix} disabled={!isEdit} placeholder={isEdit ? '请填写' : ''} />
    case 'select':
      // eslint-disable-next-line no-shadow 
      return <Select showSearch optionFilterProp="children"
      filterOption={filterOption} mode={mode}  disabled={!isEdit} placeholder={isEdit ? '请选择' : ''}>
        {option.map(item => <Option key={item.label} value={item.value}>{item.label}</Option>)}
      </Select>
    case 'radio':
      return <Radio.Group disabled={!isEdit}>
        {option.map(item => <Radio key={item.label} value={item.value}>{item.label}</Radio>)}
      </Radio.Group>
    case 'datePicker':
      return <DatePicker mode={mode} disabled={!isEdit} format={format} placeholder={isEdit?'请选择':''}/>
    case 'rangePicker':
      return <RangePicker mode={mode} disabled={!isEdit} format={format} placeholder={isEdit?['请选择','请选择']:undefined}/>
    case 'uploadDragger':
      return <UploadDragger disabled={!isEdit} action={action} maxLength={max}/>
    case 'uploadFile':
      return <UploadFile disabled={!isEdit} maxLength={max}/>
    case 'aliyunOSSUpload':
      return <AliyunOSSUpload disabled={!isEdit} maxLength={max}/>
    case 'remoteSelect':
      return <RemoteSelect aliasLabel={item.aliasLabel} aliasValue={item.aliasValue} disabled={!isEdit} action={action}/>
    case 'cityCascader':
        return <CityCascader disabled={!isEdit} placeholder={isEdit ? '请选择' : ''}/>
    case 'numericInput':
      return <NumericInput mode={mode} maxLength={maxLength} prefix={item.prefix} suffix={item.suffix} disabled={!isEdit} precision={item.precision} max={max} min={min} placeholder={isEdit?'请填写':''} />
    case 'textArea':
      return <TextArea disabled={!isEdit} placeholder={isEdit?'请填写':''} />
    case 'rate':
      return <Rate disabled={!isEdit}/>
      case 'switch':
    return <Switch disabled={!isEdit}/>
    default:
      
      break;
  }
}
const RenderFormItem: React.FC<RenderFormItemProps> = (props) => {
  const {
    isEdit,
    dataSource,
    items = [],
    layout='horizontal'
  } = props
  return <Row className={`row-${layout} ${styles.itemRow}`}>
    {
      items.map((item, i) => {
        const {
          span = 24,
          initialValue,
        } = item;
        return <Col span={span} key={i.toString()}>
          <Item
            // {...item}
            label={item.label}
            name={item.name}
            // required={item.required}
            rules={item.rules}
            initialValue={initialValue}
            extra={item.extra}
            noStyle={!item.label} // 自定义的类型没有label  去除style

          >
            {renderItem(item, dataSource, isEdit)}
          </Item>
        </Col>
      })
    }

  </Row>
}
export default RenderFormItem