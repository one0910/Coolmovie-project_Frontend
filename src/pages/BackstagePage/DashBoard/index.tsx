import { Flex } from 'antd';
import React from 'react'
import { CardsContainer } from './components/CardsContainer';
import { ChartContainer } from './components/ChartContainer';
interface DashBoardProps {
}


const DashBoard: React.FC<DashBoardProps> = ({ }) => {
  return (
    <Flex vertical gap={'2rem'}>
      <CardsContainer />
      <ChartContainer />
    </Flex>

  );
}

export default DashBoard