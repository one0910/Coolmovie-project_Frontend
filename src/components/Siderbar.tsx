import React, { useState, useEffect } from 'react'
import { MenuInfo } from "rc-menu/lib/interface";
import {
  UserOutlined,
  DashboardOutlined,
  VideoCameraAddOutlined,
  GitlabOutlined,
  AuditOutlined
} from '@ant-design/icons'
import { Flex, Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom';

interface SiderbarProps {

}

export const Siderbar: React.FC<SiderbarProps> = ({ }) => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");

  const navigate = useNavigate()
  const goNavigate = (item: MenuInfo) => {
    navigate(`${item.key}`)
  }

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname])

  return (
    <Menu
      mode='inline'
      onClick={goNavigate}
      className='menu-bar'
      selectedKeys={[selectedKeys]}
      items={[
        {
          key: '/admin',
          icon: <DashboardOutlined />,
          label: '後台總覽'
        },
        {
          key: '/admin/movieMamagment',
          icon: <VideoCameraAddOutlined />,
          label: '電影管理'
        },
        {
          key: '/admin/seatManagement',
          icon: <GitlabOutlined />,
          label: '廳位管理'
        },
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

      ]}
    >
    </Menu>);
}