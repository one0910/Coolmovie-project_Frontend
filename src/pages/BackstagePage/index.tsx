import { Button, Flex, Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useState } from 'react'
import { Siderbar } from '../../components';
import { Outlet } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

interface indexProps {

}

export const BackstageHome: React.FC<indexProps> = ({ }) => {
  const [collapsed, setCollapsed] = useState(false)
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
  return (
    <Layout>
      <Sider
        className='backStageSider'
        collapsed={collapsed}
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
        <Outlet />
      </Content>
    </Layout>
  );
}