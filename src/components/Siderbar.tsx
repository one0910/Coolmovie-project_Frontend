import React, { useState, useEffect, useContext } from 'react'
import { MenuInfo } from "rc-menu/lib/interface";
import {
  UserOutlined,
  DashboardOutlined,
  VideoCameraAddOutlined,
  GitlabOutlined,
  AuditOutlined
} from '@ant-design/icons'
import { Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom';
import { OrderContext } from '../store';

interface MenuItem {
  key: string;
  icon: JSX.Element;
  label: string;
  disabled?: boolean
}

export const Siderbar: React.FC = () => {
  const location = useLocation();
  const [state] = useContext(OrderContext);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const navigate = useNavigate();

  const goNavigate = (item: MenuInfo) => {
    navigate(`${item.key}`);
  }

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys([pathName]);
  }, [location.pathname]);

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: '後台總覽',
    },
    {
      key: '/admin/movieMamagment',
      icon: <VideoCameraAddOutlined />,
      label: '電影管理',
      disabled: (state.orderList.role === 'admin') ? false : true
    },
    {
      key: '/admin/seatManagement',
      icon: <GitlabOutlined />,
      label: '廳位管理',
      disabled: (state.orderList.role === 'admin') ? false : true
    },
    // (state.orderList.role === 'admin') && {
    //   key: '/admin/seatManagement',
    //   icon: <GitlabOutlined />,
    //   label: '廳位管理'
    // },
    {
      key: '/admin/memberManagement',
      icon: <UserOutlined />,
      label: '會員管理'
    },
    {
      key: '/admin/orderManagement',
      icon: <AuditOutlined />,
      label: '訂票管理'
    },
  ].filter(Boolean) as MenuItem[];

  return (
    <Menu
      mode='inline'
      onClick={goNavigate}
      className='menu-bar'
      selectedKeys={selectedKeys}
      items={menuItems}
    />
  );
}
