import React from 'react';
import { ModalProps } from 'antd/es/modal';
import { Modal, Button } from 'antd';
import styles from './index.less';

interface BaseModalProps extends ModalProps {
  modalVisible: boolean;
  onCancel?: () => void;
  onOk: () => void;
  width?:string;
  title?:any;
  hasCancel?: boolean; // 是否有取消按钮
  loading?: boolean;
}

const BaseModal: React.FC<BaseModalProps> = (props) => {
  const { 
    modalVisible, 
    onCancel, 
    onOk, 
    title, 
    width, 
    hasCancel=true,
    cancelText,
    okText,
    loading=false,
    destroyOnClose=true
  } = props;

  const onClose = ()=>{
    // 单个按钮的时候 可以根据onOk关闭弹窗
    if(hasCancel && onCancel){
      return onCancel()
    }
    return onOk()
    
  }
  return (
    <Modal
      destroyOnClose={destroyOnClose}
      wrapClassName={styles.baseModal}
      title={title}
      width={width}
      visible={modalVisible}
      onCancel={onClose}
      confirmLoading={loading}
      // onOk={onOk}
      footer={<div className={styles.footer}>
      <Button loading={loading} onClick={() => !loading&&onOk && onOk()} type='primary' >{okText || '保存'}</Button>
      {hasCancel && <Button onClick={() => onCancel && onCancel()} >{cancelText || '取消'}</Button>}
      
      
    </div>}
    >
      {props.children}
      
    </Modal>
  );
};

export default BaseModal;
