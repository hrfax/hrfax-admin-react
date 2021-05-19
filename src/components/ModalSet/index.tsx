import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { Button, Form, Input, Select, message } from 'antd'
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { TableSet, RemoteSelect } from '@/components/Form'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card } from './component'
import * as services from '@/services/setting'
import * as CONST from '@/utils/constants';
import styles from './index.less'

interface SettingProps {
  mode: 'capital' | 'organization'
  voucherId: number | string,
  dicts?:any;
}

const Setting: React.FC<SettingProps> = (props) => {
  const {
    dicts,
  } = props
  const [showAdd, setShowAdd] = useState(false)
  const [treeData, setTreeData] = useState([])
  const [exportFactorTypeData, setExportFactorTypeData] = useState<any[]>([])
  const [list, setList] = useState<any[]>([])
  const servicesApi = useRef(services[props.mode])  // 根据父级传参确定是调机构还是资方接口
  const layout = useMemo(() => ({
    labelCol: { span: 5 },
    // wrapperCol: { span: 16 },
  }), [])
  const [form] = Form.useForm()

  const fetchList = useCallback(async () => {
    const response = await servicesApi.current.list({ no: props.voucherId })
    if (response.code === 0) {
      setList(response.data || [])
    }
  }, [])
  const fetchSave = useCallback(async () => {
    const params = await form.validateFields()
    // todo 表格数据格式未确定
    console.log(params);
    params.table = params.table.map(item => {
      return {
        formulaName: item.tableTitle,
        formulaData: item.rules.map(item => {
          const row = {
            ...item,
            dataSource: item.editable === 0 ? 0 : 3,  // 后端接口与组件定义不同，转换一下
            dataId: item.editable === 0 ? item.dataId : 0,
            dataMappingName: item.name,
          }
          delete row.name
          delete row.editable
          return row
        }),
      }
    })
    console.log('--save--', params)
    // return
    const response = await servicesApi.current[params.id ? 'update' : 'create']({ ...params, relationNo: props.voucherId })
    if (response && response.code === 0) {
      setShowAdd(false)
      fetchList()
      form.resetFields()
      message.success('操作成功')
    }
  }, [])
  const onCancel = useCallback(() => {
    setShowAdd(false)
    form.resetFields()
  }, [])
  const getTreeData = useCallback(async () => {
    const response = await servicesApi.current.getTreeData({})
    if (response && response.code === 0) {
      // console.log(response.data)
      setTreeData(response.data)
    }
  }, [])

  const todoEdit = useCallback(async (id) => {
    // todo 拿到该条模板数据后将默认值设置，然后显示showAdd
    const response = await servicesApi.current.getDetailById({ id })
    if (response && response.code === 0) {
      form.setFieldsValue({
        id,
        estageOrderStatusList: response.data.estageOrderStatusList,
        exportFactorType: response.data.exportFactorType,
        tradeStatusList: response.data.tradeStatusList,
        templateName: response.data.templateName,
        table: response.data.table.map(item => ({ ...item, tableTitle: item.formulaName, rules: item.formulaData.map(it => ({ ...it, editable: Number(it.dataId) === 0 ? 1 : 0, name: it.dataMappingName })) })),
      })
      console.log(response.data.table.map(item => ({ ...item, tableTitle: item.formulaName, rules: item.formulaData.map(it => ({ ...it, editable: Number(it.dataId) === 0 ? 1 : 0, name: it.dataMappingName })) })))
      setShowAdd(true)
    }
  }, [])
  const onDelete = useCallback(async (id) => {
    const response = await servicesApi.current.del({ id })
    if (response && response.code === 0) {
      setShowAdd(false)
      fetchList()
      form.resetFields()
      message.success('操作成功')
    }
  }, [])
  // const fetchDict = useCallback(async () => {
  //   const response = await queryDict()
  //   if (response && response.code === 0) {
  //     for (let item of response.data) {
  //       if (Number(item.dictType) === 4000) {
  //         setExportFactorTypeData(item.dictList)
  //       }
  //     }

  //   }
  // }, [])
  useEffect(() => {
    // fetchDict()
    fetchList()
    getTreeData()
  }, [])
  const tradeStatusOpts = CONST.transformDict(dicts,'tradeStatus_search',false,false);
  return <PageHeaderWrapper>

    <div className={styles.container}>
      <div className={styles.left}>
        {
          list.length < 11 && <Button onClick={() => { form.resetFields(); setShowAdd(true) }} type='primary'>新建模板</Button>
        }
        {
          list.map(item => <Card fetch={servicesApi.current.getDetailById} key={item.id} info={item} onDelete={() => { onDelete(item.id) }} onClick={() => { todoEdit(item.id) }} />)
        }
      </div>
      <div className={styles.right}>
        {
          showAdd && <Form form={form}>
            <div className={styles.title}>模版名称设置</div>
            <div>
              <Form.Item name='id' style={{ display: 'none' }}>
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item {...layout} name='templateName' required rules={[{ required: true, message: '模板名称不能为空' },{max:20,message:"最多20个字符"}]} className={styles['input-container']} label='模板名称'>
                <Input placeholder="请输入" />
              </Form.Item>
            </div>
            <div className={styles.title}>导出条件设置</div>
            <div>
              <Form.Item {...layout} name='exportFactorType' required rules={[{ required: true, message: '导出条件不能为空' }]} label='导出条件'>
                <Select placeholder="请选择">
                  {
                    CONST.transformDict(dicts,'4000',false,false).map(item => <Select.Option value={item.value} data={item} key={item.label}>{item.label}</Select.Option>)
                  }
                  {/* <Select.Option value={0}>全部（且）</Select.Option>
                  <Select.Option value={1}>任何（或）</Select.Option> */}
                </Select>
              </Form.Item>
              <Form.Item {...layout} name='tradeStatusList' rules={[]} label='当前短融状态'>
                <Select placeholder="请选择" optionFilterProp="children" mode="multiple">
                  {
                    CONST.transformDict(dicts,'tradeStatus_search',false,false).map(item => <Select.Option value={item.value} data={item} key={item.label}>{item.label}</Select.Option>)
                  }
                </Select>
              </Form.Item>
              <Form.Item {...layout} name='estageOrderStatusList' rules={[]} label='当前分期业务状态'>
                {/* <RemoteSelect mode="multiple" action="/trade/loan/status" /> */}
                <Select placeholder="请选择" mode="multiple">
                  {
                    CONST.transformDict(dicts,'loanStatus',false,false).map(item => <Select.Option key={item.label} value={item.value}>{item.label}</Select.Option>)
                  }
                </Select>
              </Form.Item>
              <Form.Item required rules={[{ required: true, message: '不能为空' }]} name='table' >
                <TableSet treeData={treeData} />
              </Form.Item>

            </div>
            <div style={{ textAlign: 'center' }}>
              <Button onClick={fetchSave} type='primary'>保存</Button>
              <Button onClick={onCancel} style={{ marginLeft: 24 }}>取消</Button>
            </div>
          </Form>
        }
      </div>
    </div>

  </PageHeaderWrapper>
}
export default connect(({ global, loading }: ConnectState) => ({
  dicts: global.dicts,
  loading: loading.global,
}))(Setting);