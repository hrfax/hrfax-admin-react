import React,{useState,useEffect} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Typography, Alert, Form,Input, Button } from 'antd';

import dayjs from 'dayjs'
import styles from './Welcome.less';


const Welcome: React.FC<any> = (props) => {
  const [now,setNow]= useState(dayjs());
  const [form] = Form.useForm();
  const [list,setList] = useState<any>([])
  setTimeout(() => {
    setNow(dayjs())
  }, 1000);
  
  const add =()=>{
    setList([...list,{label:'姓名',key:`dd-${Date.now}${Math.random()}`}])
  }
  const remove =(i)=>{
    setList(list.filter((_,index)=>index!==i))
  }
  
  return <PageHeaderWrapper>
    {/* <Card title="测试form">
    <Form
      form={form}>
        <Button onClick={add}>添加</Button>
        {
        list.map((item:any,i)=><div style={{display:"flex"}} key={item.key}><Form.Item name={item.key} label={item.label}><Input/></Form.Item><span style={{paddingLeft:8}} onClick={()=>{remove(i)}}>删除索引</span></div>)
        }

      </Form>
    </Card> */}
  <div className={styles.timer} style={{textAlign:'center',paddingTop:'30vh'}}>{dayjs(now).format('YYYY-MM-DD hh:mm:ss')}</div>
</PageHeaderWrapper>
};
export default Welcome;

