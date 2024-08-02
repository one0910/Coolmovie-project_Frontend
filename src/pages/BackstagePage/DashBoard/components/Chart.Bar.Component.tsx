import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAppSelector } from '../../../../hooks';
import { useGetUserDataQuery } from '../../../../services/memberService';
import { Spinner } from '../../../../components';
import { ChartDataType } from '../../../../interface';
import { useTranslation } from 'react-i18next';
import { transMonth } from '../../../../helper/transform.language';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


interface ChartBarComponentProps {

}

export const ChartBarComponent: React.FC<ChartBarComponentProps> = ({ }) => {
  const { t } = useTranslation()
  const { language } = useAppSelector(state => state.common)
  const { data, error, isLoading } = useGetUserDataQuery({ parameter: 'dataForChart', daterange: 'all' })

  const [revenueData, setRevenueData] = useState<ChartDataType>({
    labels: [],
    datasets: []
  });
  const isMoblieScreen = useAppSelector(state => state.common.isMoblieScreen);

  useEffect(() => {

    const charLabels = data?.data.dataForChart['2023'].slice(2, 10).map((chardata) => {
      return transMonth(language, chardata.Month)
    }) || [];
    const charDatas = data?.data.dataForChart['2023'].slice(2, 10).map((chardata) => {
      return chardata.Total
    }) || [];


    const dataSource = {
      labels: charLabels,
      datasets: [
        {
          label: "Revenue",
          data: charDatas,
          fill: { above: '#393a3abc', below: 'red', target: { value: 350 } },
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
        text: t("admin_page.dashboard_page.number_of_registered_members"),
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
    scales: {
      y: {
        ticks: {
          stepSize: 0.5
        }
      }
    }
  };

  return (
    <Card className='chartCard' >
      {
        (isLoading) ? <Spinner /> :
          <Bar options={options} data={revenueData} height={(isMoblieScreen) ? 170 : 0} />
      }
    </Card>
  );
}