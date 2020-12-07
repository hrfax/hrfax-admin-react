import React, {useState, useEffect} from 'react';
import { Select, Spin } from 'antd';
import {SelectProps,SelectValue} from 'antd/lib/select';
import request from '@/utils/request';
import { useRequest } from '@umijs/hooks';
import {formatTreeData} from '@/utils/utils'

const { Option } = Select;

export interface RemoteSelectProps extends SelectProps<SelectValue>  {
  unit?:string;
  action?:string;
  aliasLabel?:any;
  aliasValue?: any;
  params?:any;
  data?:any;

}
const RemoteSelect: React.FC<RemoteSelectProps> = (rest) => {
  const [data, setData] = useState<any>(rest.data||[]);
  const {
    
    action = '/rule',
    aliasLabel='name',
    aliasValue='id',
    params={},
    // disabled,
    ...other
  } = rest
  const fetchData = async()=>{
    const res = await request(action, {
      data:{
        ...params
      },
    });
    if(res){
      const arrData = res.data&&res.data.list?res.data.list:res.data||[]
      return setData(formatTreeData(arrData,aliasLabel,aliasValue))
    }
    return []
    
  }
  // const { loading, run, cancel } = useRequest(fetchData, {
  //   debounceInterval: 500,
  //   manual: true
  // });
  const filterOption = (input, option)=>{
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
  useEffect(() => {
    (async ()=> {
      if(!data||data.length===0){
        fetchData()
      }
      
    })();
    
  }, []);
  
  return <Select
          {...other}
          allowClear
          showSearch
          // labelInValue
          placeholder="请选择"
          // notFoundContent={loading ? <Spin size="small" /> : null}
          // filterOption={false}
          // onSearch={run}
          // onBlur={cancel}
          // loading={loading}
          optionFilterProp="children"
          filterOption={filterOption}
          style={{ width: '100%' }}
          
        >
          {data.map((d,i) => (
            <Option value={d.value} data={d} key={d.label}>{d.label}</Option>
          ))}
        </Select>
}
export default RemoteSelect