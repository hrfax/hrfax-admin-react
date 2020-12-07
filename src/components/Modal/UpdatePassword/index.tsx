import React from 'react';
import { Form, message } from 'antd';
import { BaseModal } from '@/components/Modal';
import RenderFormItem from '@/components/RenderFormItem';
import { useRequest } from '@umijs/hooks';
import md5 from 'js-md5';
import {
  changePassword
} from '@/services/user';

interface UpdatePasswordProps {
  modalVisible: boolean;
  onCancel: () => void;
  onOk: () => void;
}

const UpdatePassword: React.FC<UpdatePasswordProps> = (props) => {
  const { modalVisible, onCancel, onOk } = props;
  const [form] = Form.useForm();

  const fetchChangePassword = useRequest(changePassword, {
    debounceInterval: 500,
    manual: true,
    onSuccess: (result) => {
      if (result) {
        message.success(`修改成功,请重新登录`,1,()=>{
          onOk()
        });
        
      }
    }
  });
  const handleSubmit = async() => {

    const fieldsValue = await form.validateFields();
    const {
      newPassword,
      oldPassword,
      confirmPassword
    } = fieldsValue
    if(newPassword!==confirmPassword){
      return message.error('新密码和确认密码不一样')
    }
    
    fetchChangePassword.run({
      newPassword:md5(newPassword),
      oldPassword:md5(oldPassword)
    })
    
    
    
  }
  return (
    <Form form={form}>

    
    <BaseModal
      title="修改密码"
      modalVisible={modalVisible}
      onCancel={() => onCancel()}
      onOk={handleSubmit}
    >
      
      <RenderFormItem items={[{
      label: '旧密码',
      name: 'oldPassword',
      valueType: 'input',
      maxLength: 25,
      mode:'password',
      initialValue: null,
      rules: [{ required: true, message: '请填写旧密码' }]
    }, {
      label: '新密码',
      name: 'newPassword',
      valueType: 'input',
      mode:'password',
      maxLength: 25,
      rules: [{ required: true, message: '请填写新密码' },{min:6,message:'长度不能小于6'}]
    }, {
      label: '确认新密码',
      name: 'confirmPassword',
      valueType: 'input',
      mode:'password',
      maxLength: 25,
      rules: [{ required: true, message: '请填写确认新密码' },{min:6,message:'长度不能小于6'}]
    }]} isEdit />
    


    </BaseModal></Form>
  );
};

export default UpdatePassword;
