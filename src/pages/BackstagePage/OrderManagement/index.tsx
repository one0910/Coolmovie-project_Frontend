import { Divider } from 'antd';
import React from 'react'
import { Ordertable } from './components/Order.table';

interface OrderManagementProps {

}

export const OrderManagement: React.FC<OrderManagementProps> = ({ }) => {
  return (
    <>
      <Divider orientation="left" className='divider'>訂單管理列表</Divider>
      <Ordertable />
    </>
  );
}