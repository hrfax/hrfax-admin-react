import React, { useState, useCallback } from 'react'
import moment from 'moment'
import { Modal,Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import styles from './index.less'
export const Card = (props) => {
  const { info } = props;
  const open = useCallback(async() => {
    const response = await props.fetch({id: info.id})
    if(response && response.code === 0){
      Modal.info({
        icon: '',
        width: 740,
        okText: '确定',
        content: (
          <div>
            <p>文件名称：{response.data.templateName}</p>
            <table className={styles.table}>
              <thead>
                <tr>
                  {
                    (response.data.table || []).map(item => {
                      return <th>{item.formulaName}</th>
                    })
                  }
                </tr>
              </thead>
              <tbody>
                <tr>
                  {
                    (response.data.table || []).map(item => {
                      return <td>{item.formulaData && item.formulaData.map(it => Number(it.dataId) === 0 ? it.dataMappingName : `{${it.dataMappingName}}`).join(' ')}</td>
                    })
                  }
                </tr>
              </tbody>
            </table>
          </div>
        ),
        onOk() { },
      })
    }
  }, [])
  return <div className={styles.card}>
    <div onClick={props.onClick}>{info.templateName}</div>
    <div>{moment(info.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
    <div><a onClick={open}>预览</a></div>
    <Popconfirm title="确定是否要删除？" placement="topRight" onConfirm={props.onDelete}>
      <DeleteOutlined  />
    </Popconfirm>
    
  </div>
}