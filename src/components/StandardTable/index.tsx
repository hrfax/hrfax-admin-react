import React, { useState, useRef } from 'react';
import ProTable, {ProColumns, ProTableProps } from '@ant-design/pro-table';
import styles from './index.less';
// ProColumns, ActionType,
// export type ProColumns
// export interface TableColumns extends ProColumns<any> {
//   xx:any;
// }
export interface StandardTableProps extends ProTableProps<any,any>  {
  overlayClassName?: string;
  columnsWidth?:number;
}
// export interface ColumnsProps extends ProColumns <any> {

// }

const StandardTable: React.FC<StandardTableProps> = ({ overlayClassName: cls, ...restProps }) => {
  const [sorter, setSorter] = useState<string>('');
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const searchConfig = {
    collapsed,
    onCollapse:(c)=>setCollapsed(c)
    // collapseRender: () => null,
  };
  const {
    scroll={ 
      x: 'max-content', 
      y: window.innerHeight * 0.7,
      scrollToFirstRowOnChange: true
    },
    columns=[],
    columnsWidth,
    dataSource=[],
    request
  } = restProps
  // 设置表格列默认宽和key
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let Columnswidth = 0
  const tableColumns = columns.map((item,index)=>{
    if(!item.hideInTable){
      Columnswidth +=item.width||150
    }
    
    return {...item,
      key:item.dataIndex||index,
      width:item.width||columnsWidth,
      ellipsis: item.ellipsis===undefined?!item.render:item.ellipsis,
      dataIndex:item.dataIndex || item.title,
    }
  })
  const myrequest = async(params:any) => {
    if(request){
      const res:any = await request(params)
      if(res.data&&res.data.list){
        return new Promise((resolve) => {
          resolve({
            ...res.data,
            data:res.data.list,
          })
        });
      }
      
      
    }
    // else{
    //   return new Promise((resolve) => {
    //     resolve({
    //       data:dataSource,
    //     })
    //   });
      
    // }
    
  } 
  const box = document.getElementById('standardTable');
  // setTimeout(() => {
  //   if(box&&scroll&&scroll.x==='max-content' && tableRef && tableRef.tableRef){
  //     const {clientWidth, clientHeight} = tableRef.tableRef;
  //     // 表格列宽和小于视图宽度
  //     if(Columnswidth<clientWidth){
  //       const lastColumns = tableColumns[tableColumns.length-1]
  //       const lastColumnsWidth = lastColumns.width;
  //       // 最后一列宽度 = 原来宽度+差额-单选框宽度-滚动条宽度
  //       tableColumns[tableColumns.length-1].width = lastColumnsWidth+(clientWidth-Columnswidth)-(rest.rowSelection?60:0)-25
  //     }
  //   }
  // }, 100);
    
  const tableRef:any = useRef();
  const beforeSearchSubmit = (params)=>{
    console.log('beforeSearchSubmit==params',params)
    return params;
  }

  return (<div className={styles.standardTable} id="standardTable" ref={tableRef}>
    <ProTable
      rowKey="id"
      search={searchConfig}
      {...restProps}
      pagination={{
        showQuickJumper:true
      }}
      beforeSearchSubmit={beforeSearchSubmit}
      scroll={scroll}
      columns={tableColumns}
      request={request?myrequest:undefined}
      dataSource={dataSource}
      
      
      
    />
  </div>)

}





export default StandardTable;