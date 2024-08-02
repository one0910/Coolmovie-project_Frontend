import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { Spinner } from '../../../../components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAppSelector } from '../../../../hooks';
import { useGetOrderDataQuery } from '../../../../services/orderService';

import { ChartDataType } from '../../../../interface';
import { useTranslation } from 'react-i18next';
import { transMonth } from '../../../../helper/transform.language';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,

);


interface ChartLineComponentProps {

}

export const ChartLineComponent: React.FC<ChartLineComponentProps> = ({ }) => {
  const { t } = useTranslation()
  const { language } = useAppSelector(state => state.common)
  const { data, error, isLoading } = useGetOrderDataQuery({ parameter: 'dataForChart', daterange: 'all' })
  const [revenueData, setRevenueData] = useState<ChartDataType>({
    labels: [],
    datasets: []
  });

  const isMoblieScreen = useAppSelector(state => state.common.isMoblieScreen);
  useEffect(() => {
    const charLabels = data?.data.dataForChart['2023'].slice(5, 12).map((chardata) => {
      return transMonth(language, chardata.Month)
    }) || [];
    const charDatas = data?.data.dataForChart['2023'].slice(5, 12).map((chardata) => {
      return chardata.Box
    }) || [];

    const dataSource = {
      labels: charLabels,
      datasets: [
        {
          label: "Revenue",
          data: charDatas,
          fill: { above: '#393a3abc', below: '#393a3abc', target: { value: 0 } },
          borderColor: '#E7C673',
          backgroundColor: '#E7C673',
        },

      ],
    };
    setRevenueData(dataSource);

  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        // position: 'top' as const,
        display: false,
      },
      layout: {
        padding: {
          left: 10,
          right: 0,
        },
      },
      title: {
        position: 'top' as const,
        display: true,
        text: t("admin_page.dashboard_page.box_office_data"),
        color: 'rgba(255, 255, 255, 0.9)',
        align: 'start' as const,
        font: {
          size: (isMoblieScreen) ? 14 : 16,
        },
        padding: {
          bottom: (isMoblieScreen) ? 15 : 20,
        },
      },
    },
  };

  return (
    <Card className='chartCard' >
      {
        (isLoading) ? <Spinner /> :
          <Line options={options} data={revenueData} height={(isMoblieScreen) ? 170 : 0} />
      }
    </Card>
  );
}