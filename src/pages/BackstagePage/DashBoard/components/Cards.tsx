import React, { useEffect } from 'react';
import { Card, Col, Flex, Statistic } from 'antd';
import { DatabaseOutlined, FundViewOutlined, UnorderedListOutlined, UserAddOutlined } from '@ant-design/icons';
import { useGetOrderDataQuery } from '../../../../services/orderService';
import { useGetMovieDataQuery } from '../../../../services/movieService';
import { useGetUserDataQuery } from '../../../../services/memberService';
import { RTKQuery_APIError } from '../../../../interface/rtk-query';
import { CardDataType } from '../../../../interface/rtk-query';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';


interface CardProps {
  isMobileSize: boolean;
  cartData: CardDataType;
}


const getIcon = (cartData: CardDataType, isMobileSize: boolean) => {
  const { t } = useTranslation()
  const style = { fontSize: `${isMobileSize ? '1.2rem' : '1.5rem'}` };
  switch (cartData) {
    case 'getCurrentStream':
      return <FundViewOutlined style={style} />;
    case 'getOrderCount':
      return <UnorderedListOutlined style={style} />;
    case 'getRegisterCount':
      return <UserAddOutlined style={style} />;
    case 'getMovieCount':
      return <DatabaseOutlined style={style} />;
    default:
      return <DatabaseOutlined style={style} />;
  }
};

export const Cards: React.FC<CardProps> = ({ isMobileSize, cartData }) => {
  const fetchQueryAPI = {
    getCurrentStream: {
      api: useGetOrderDataQuery({ parameter: 'count', daterange: 'all' }),
      title: t("admin_page.dashboard_page.website_visits_today")
    },
    getOrderCount: {
      api: useGetOrderDataQuery({ parameter: 'count', daterange: 'all' }),
      title: t("admin_page.dashboard_page.current_booking_count")
    },
    getRegisterCount: {
      api: useGetUserDataQuery({ parameter: 'count', daterange: 'all' }),
      title: t("admin_page.dashboard_page.registered_users")
    },
    getMovieCount: {
      api: useGetMovieDataQuery({ parameter: 'count', daterange: 'all' }),
      title: t("admin_page.dashboard_page.total_movies")
    }
  };

  const { api, title } = fetchQueryAPI[cartData];
  const { data, error, isLoading } = api;


  useEffect(() => {
    if (error) {
      const errorMessage = (error as RTKQuery_APIError).data?.message || 'An error occurred';
      console.error('Error fetching data:', errorMessage);
      alert(errorMessage);
      window.location.replace('/');
    }
  }, [error]);

  return (
    <Col md={6} sm={12} xs={12}>
      <Card className='card'>
        <Flex gap={'middle'}>
          <Flex align='center' justify='center' flex={`0 0 ${(isMobileSize) ? '40px' : '60px'}`} style={{ backgroundColor: 'rgba(55, 55, 55, 0.9)' }}>
            {getIcon(cartData, isMobileSize)}
          </Flex>
          <Flex flex={'1'} align='center' className='StatisticContainer'>
            <Statistic
              title={title}
              value={data ? data.data.count : 0}
              className='Statistic'
              loading={isLoading}
            />
          </Flex>
        </Flex>
      </Card>
    </Col>
  );
};
