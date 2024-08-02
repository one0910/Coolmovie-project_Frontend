import { Divider } from 'antd';
import React from 'react'
import { Ordertable } from './components/Order.table';
import { useTranslation } from 'react-i18next';

interface OrderManagementProps {

}

const OrderManagement: React.FC<OrderManagementProps> = ({ }) => {
  const { t } = useTranslation()
  return (
    <>
      <Divider orientation="left" className='divider'>{t("admin_page.order_mamagement_page.booking_management_list")}</Divider>
      <Ordertable />
    </>
  );
}

export default OrderManagement