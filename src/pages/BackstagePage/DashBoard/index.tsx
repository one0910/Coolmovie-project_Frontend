import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Flex, Row, Space, Statistic, Typography } from 'antd';
import React, { useEffect, useState } from 'react'

interface DashBoardProps {

}

export const DashBoard: React.FC<DashBoardProps> = ({ }) => {
  const [isMobileSize, setIsMobileSize] = useState(false)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = () => {
      setIsMobileSize(mediaQuery.matches ? true : false);
    };
    handleResize();
    mediaQuery.addEventListener('change', handleResize);
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, [])
  return (
    <>
      <Row gutter={isMobileSize ? [5, 10] : [40, 10]}>
        <Col md={6} sm={12} xs={12}>
          <Card className='card'>
            <Flex gap={'middle'} >
              <Flex align='center' justify='center' flex={`0 0 ${(isMobileSize) ? '40px' : '60px'}`} style={{ backgroundColor: 'rgba(55, 55, 55, 0.9)' }}>
                {<UserOutlined style={{ fontSize: `${(isMobileSize) ? '1.2rem' : '1.5rem'}` }} />}
              </Flex>
              <Flex flex={'1'}>
                <Statistic title={'title'} value={'2314'} className='Statistic' />
              </Flex>
            </Flex>
          </Card>
        </Col>
        <Col md={6} sm={12} xs={12}>
          <Card className='card'>
            <Flex gap={'middle'} >
              <Flex align='center' justify='center' flex={`0 0 ${(isMobileSize) ? '40px' : '60px'}`} style={{ backgroundColor: 'rgba(55, 55, 55, 0.9)' }}>
                {<UserOutlined style={{ fontSize: `${(isMobileSize) ? '1.2rem' : '1.5rem'}` }} />}
              </Flex>
              <Flex flex={'1'}>
                <Statistic title={'title'} value={'2314'} className='Statistic' />
              </Flex>
            </Flex>
          </Card>
        </Col>
      </Row >
    </>
  );
}