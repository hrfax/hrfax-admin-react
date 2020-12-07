
import React, { useState, useCallback} from 'react';
import {
  Form,
  Button,
  Space,
  message
} from 'antd';
import {RenderFormItemProps,renderItem} from '@/components/RenderFormItem'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';




export interface GroupListProps extends Omit<RenderFormItemProps, 'children'> {
  addText?: any;
  name:string; // 保存的键值
  min?:number;
  max?:number;
  form:any; // 方便
}
const GroupList: React.FC<GroupListProps> = (props) => {
  const {
    form,
    addText = "添加",
    items=[],
    dataSource=[],
    isEdit=true,
    name,
    min=1,
    max
  } = props

  // const [form] = Form.useForm();
  const [len,setLen]= useState<number>(dataSource.length)
  const onFinish = values => {
    console.log('Received values of form:', values);
  };

  const handleAdd = useCallback((add)=>{
    if(max && max<len+1){
      return message.error(`最多允许${max}条`)
    }
    setLen(len+1)
    add()
  },[len])
  const handleRemove = useCallback((remove)=>{
    setLen(len-1)
    
    remove()
  },[len])
  return (
    <Form initialValues={{[`${name}`]:dataSource}} form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      
      <Form.List name={name} >
      {(fields, { add, remove }) => {
          return (
            <>
              {fields.map((field,ii) => (
                <Space key={field.key} align="start">
                  
                  {/* <Form.Item
                    label="xxx"
                    name={[field.name, 'xxx']}
                    fieldKey={[field.fieldKey, 'xxx']}
                    rules={[{ required: true, message: 'Missing xxx' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Price"
                    name={[field.name, 'price']}
                    fieldKey={[field.fieldKey, 'price']}
                    rules={[{ required: true, message: 'Missing price' }]}
                  >
                    <Input />
                  </Form.Item> */}
                  {
                    items.map((item:any,i)=>(<Form.Item
                      key={i.toString()}
                      label={item.label}
                      name={[field.name, item.name]}
                      fieldKey={[field.fieldKey, item.name]}
                      rules={item.rules}
                      // initialValue={initialValue}
                    >
                      {renderItem(item, dataSource, isEdit)}
                    </Form.Item>))
                  }

                  {((ii+1)>min)&&<MinusCircleOutlined onClick={() => {
                    handleRemove(()=>remove(field.name))
                  }} />}
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    handleAdd(()=>add())
                  }}
                  block
                >
                  <PlusOutlined /> {addText}
                </Button>
              </Form.Item>
            </>
          );
        }}
      </Form.List>
     
    </Form>

  );
};
export default GroupList;