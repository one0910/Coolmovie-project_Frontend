import { Button, Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import React, { useContext, useEffect, useState } from 'react'
import { Siderbar } from '../../components';
import { Outlet } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Notification from '../../components/Notification';
import NotificationAlert from '../../components/Notification.alert';
import { OrderContext } from '../../store';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setAlert } from '../../store/common/common.reducer';
interface indexProps {

}

export const BackstageHome: React.FC<indexProps> = ({ }) => {
  const storeDispatch = useAppDispatch()
  const [collapsed, setCollapsed] = useState(false)
  const [state] = useContext(OrderContext);
  const { isAlert } = useAppSelector(state => state.common.alert)
  const userRole = (state.orderList.role) ? state.orderList.role : ''
  const alertMsg = (userRole === 'view') ? '此帳號為瀏覽模式，部份功能會無法使用' : ''
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = () => {
      if (mediaQuery.matches) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    handleResize();
    mediaQuery.addEventListener('change', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, [])

  useEffect(() => {
    if (userRole === 'view') {
      storeDispatch(setAlert({ isAlert: !isAlert, alertMessage: `${alertMsg}` }))
    }
  }, [userRole])

  return (
    <Layout>
      <Sider
        className='backStageSider'
        collapsed={collapsed}
      // collapsed={true}
      >
        <Siderbar />
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: 18 }} /> : <MenuFoldOutlined style={{ fontSize: 18 }} />}
          onClick={() => setCollapsed(!collapsed)}
          className='triger-btn'
        />
      </Sider>
      <Content className='backStageContent'>
        <Notification />
        <NotificationAlert />
        <Outlet />
      </Content>
    </Layout>
  );
}