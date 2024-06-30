import { Flex } from 'antd';
import { ChartLineComponent } from './Chart.Line.Component';
import { ChartBarComponent } from './Chart.Bar.Component';
import { useAppSelector } from '../../../../hooks';


interface ChartContainerProps { }

export const ChartContainer: React.FC<ChartContainerProps> = ({ }) => {
  const isMoblieScreen = useAppSelector(state => state.common.isMoblieScreen);

  return (
    <Flex vertical={isMoblieScreen} gap={(isMoblieScreen) ? '1rem' : '1.5rem'} >
      <ChartLineComponent />
      <ChartBarComponent />
    </Flex>
  );
}
