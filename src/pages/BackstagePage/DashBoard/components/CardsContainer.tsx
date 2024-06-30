import React, { useEffect, useState } from 'react'
import { Row } from 'antd';
import { Cards } from './Cards';
import { CardDataType } from '../../../../interface/rtk-query';
;

interface CardsContainerProps {

}

export const CardsContainer: React.FC<CardsContainerProps> = ({ }) => {
  const [isMobileSize, setIsMobileSize] = useState(false)
  const cartDatas: CardDataType[] = ['getCurrentStream', 'getOrderCount', 'getRegisterCount', 'getMovieCount'];
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
    <Row gutter={isMobileSize ? [5, 10] : [40, 10]}>
      {
        cartDatas.map((cartData: CardDataType, index) => {
          return (
            <Cards
              key={index}
              isMobileSize={isMobileSize}
              cartData={cartData}
            />
          )
        })
      }
    </Row >
  );
}