import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { Drawer, Input, Button, Tree, Form } from 'antd'
import { SortableTag } from '@/components'
import styles from './index.less'



const TableSet = (props) => {
  const [visible, setVisible] = useState<boolean | string | number>(false)
  const [list, setList] = useState<undefined[] | any[]>([undefined])
  const [isAdd, setIsAdd] = useState(false)
  const [form] = Form.useForm()
  useEffect(() => {
    console.log('effect', props.value)
    setList(props.value ? props.value : [undefined])
  }, [props.value])
  const onClose = useCallback(() => {
    setVisible(false)
  }, [])
  const onClick = useCallback((index, isAdd = false) => {
    form.resetFields()
    setIsAdd(isAdd)
    if (!isAdd) {
      form.setFieldsValue(list[index])
    }
    setVisible(index)
  }, [list])
  const stopPropagation = useCallback((evt) => {
    evt.preventDefault()
    evt.stopPropagation()
  }, [])
  const onAddRule = useCallback((item) => {
    const rules = form.getFieldValue('rules')
    form.setFieldsValue({
      rules: [...(rules || []), {
        ...item,
        name: item.dataMappingName,
        editable: 0,
      }]
    })
  }, [])

  const formatRubbishJavaResponseData = useCallback((data) => { // 用于格式化垃圾java接口返回的垃圾数据
    return data.map(item => ({
      children: item.excelBaseData.map(item => {
        const _item = { ...item, dataId: item.dataId || item.id }
        delete _item.id
        return _item
      }),
      dataMappingName: item.dataSourceMsg,
      dataId: item.dataSourceMsg,
    }))
  }, [])
  const formatTreeData = useCallback((data, label, value, children) => {
    return data.map(item => {
      if (item[children]) {
        return {
          ...item,
          title: item[label],
          key: item[label],
          children: formatTreeData(item[children], label, value, children)
        }
      } else {
        return {
          ...item,
          title: <span onClick={_ => onAddRule(item)}>{item[label]}</span>,
          key: item[value],
        }
      }
    })
  }, [])
  const onDelete = useCallback((index) => {
    const _list = [...list]
    _list.splice(index, 1)
    update(_list.length === 0 ? [undefined] : _list)
  }, [list])
  const onSave = useCallback(async () => {
    const values = await form.validateFields()
    const _list = [...list]
    if (isAdd) {
      _list.splice((visible as number) + 1, 0, values)
    } else {
      _list[(visible as number)] = values
    }
    update(_list)
    setIsAdd(false)
    setVisible(false)
    form.resetFields()
  }, [list, visible, isAdd])
  const update = useCallback((list) => {
    console.log('update', list)
    if (props.onChange) {
      props.onChange(list)
    } else {
      setList(list)
    }
  }, [])
  return <div className={styles.container}>
    <div style={{ fontSize: 20, color: '#333', marginTop: 4, marginBottom: 12 }}>表格设置</div>
    <table className={styles.table}>
      <thead>
        <tr>
          <th></th>
          <th>表头名称</th>
          <th>公式</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {
          (list as any).map((item: any, index) => {
            return <tr key={`tr-${index}`} onClick={() => { onClick(index) }}>
              <td onClick={stopPropagation}>{index + 1}</td>
              <td>{(item && item.tableTitle) || ''}</td>
              <td>{(item && item.rules) ? item.rules.map(i => i.editable ? i.name : ` {${i.name}} `).join('') : ''}</td>
              <td onClick={stopPropagation}>
                {
                  !item ? '' : <div>
                    <PlusCircleOutlined onClick={() => onClick(index, true)} title='在当前行下加一行' />
                    <MinusCircleOutlined onClick={() => onDelete(index)} title='删除当前行' />
                  </div>
                }
              </td>
            </tr>
          })
        }
      </tbody>
    </table>
    <Drawer
      title="表格设置"
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible !== false}
      width={580}
    >
      <Form form={form}>
        <div className={styles.title}>表头名称</div>
        <div>
          <Form.Item rules={[{ required: true, message: '表头名称不能为空' },{max:20,message:'最多20个字符'}]} name='tableTitle'>
            <Input />
          </Form.Item>
        </div>
        <div className={styles.title}>信息规则（公式）</div>
        <div className={styles.content}>
          <Form.Item style={{ margin: 0 }} rules={[{ required: true, message: '信息规则（公式）不能为空' }]} name='rules'>
            <SortableTag showAdd />
          </Form.Item>
        </div>
        <div className={styles.title}>信息库</div>
        <div style={{ maxHeight: 520, overflow: 'auto' }} className={styles.content}>
          <Tree
            treeData={formatTreeData(formatRubbishJavaResponseData(props.treeData), 'dataMappingName', 'dataId', 'children')}
            selectable={false}
          />
        </div>
        <div style={{ marginTop: 24 }}>
          <Button onClick={onSave} type='primary'> 确 定 </Button>
        </div>
      </Form>
    </Drawer>
  </div>
}

export default TableSet