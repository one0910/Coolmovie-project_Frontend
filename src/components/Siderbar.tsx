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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation()

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
      label: t("admin_page.sidebar_menu.dashboard"),
    },
    {
      key: '/admin/movieMamagment',
      icon: <VideoCameraAddOutlined />,
      label: t("admin_page.sidebar_menu.movie_management"),
      disabled: (state.orderList.role === 'admin') ? false : true
    },
    {
      key: '/admin/seatManagement',
      icon: <GitlabOutlined />,
      label: t("admin_page.sidebar_menu.theater_management"),
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
      label: t("admin_page.sidebar_menu.member_management"),
    },
    {
      key: '/admin/orderManagement',
      icon: <AuditOutlined />,
      label: t("admin_page.sidebar_menu.order_management"),
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
