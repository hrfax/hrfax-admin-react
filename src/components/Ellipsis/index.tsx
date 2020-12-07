import React from 'react';
import Tooltip, {TooltipProps} from 'antd/lib/tooltip';

interface EllipsisProps extends TooltipProps {
  length?: number;
  title?: string | number | React.ReactNode;
  children: string | number;
}
export default class Ellipsis extends React.Component<EllipsisProps, any>{
  

  render() {
    const { length = Infinity, children, title = children } = this.props;
    if (typeof children === 'string' || typeof children === 'number') {
      const text = `${children}`;
      if (text.length > length) {
        return <Tooltip overlayStyle={{maxWidth: 400}} title={title}>{`${text.slice(0, length)}...`}</Tooltip>
      } 
      return text || '--'
      
    } 
      return children || '--';
    
  }
}