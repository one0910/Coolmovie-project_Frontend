import React, { useContext, ReactNode } from 'react'
import styled from 'styled-components';
import { OrderContext } from '../store';
import { OrderDataType } from '../interface';
import { t } from 'i18next';
import { useAppSelector } from '../hooks';
import { transArraySeats, transDateString, transLevel, transLevelData, transMovieTitleName, transTheaterSize } from '../helper/transform.language';

const Aside = styled.aside`
  border: 10px solid;
  border-image-slice: 1;
  border-width: 2px;
  border-image-source: linear-gradient(90deg, #8D7129 0.62%, #E7C673 23.69%, #DDD2AC 51.62%, #E7C673 81.1%, #8D7129 99.93%);
  .screenCheck{
    padding: 17px 0 16px 0;
    margin: 8px 0 15px 0;
    border: 10px solid;
    border-image-slice: 1;
    border-width: 2px;
    border-left: 0;
    border-right: 0;
    border-image-source: linear-gradient(90deg, #8D7129 0.62%, #E7C673 23.69%, #DDD2AC 51.62%, #E7C673 81.1%, #8D7129 99.93%);
  }
  .seatCheck{
    display: flex;
    justify-content:space-between;
    span:nth-of-type(1){
      width:44%
    }
  }
  .movieInfo{
    span:nth-of-type(1){
      color:${props => props.theme.movieLevel};
      border:1px solid ${props => props.theme.movieLevel};
    }
  }
`

interface ScreenCheckProps {
  children?: ReactNode;
  titleMsg?: string
  order?: OrderDataType
}

export const ScreenCheck: React.FC<ScreenCheckProps> = ({ order, titleMsg, children }) => {
  const [state] = useContext(OrderContext);
  const { language } = useAppSelector(state => state.common)

  const movie_level = (order) ? transLevel(language, order.movielevel) : transLevel(language, state.orderList.movie_level)
  const movie_name = (order) ? order.movieName : state.orderList.movie_name
  const movie_date = (order) ? order.moviePlayDate : state.orderList.movie_date
  const movie_time = (order) ? order.moviePlayTime : state.orderList.movie_time
  const theater_size = (order) ? order.theater_size : state.orderList.theater_size
  // const seat_ordered = (order) ? order.seatOrdered.map(seat => `[${seat}]`).join('、') : state.orderList.seat_ordered?.map(item => `[${item}]`).join('、')
  const seat_ordered = (order) ? transArraySeats(language, order.seatOrdered) : state.orderList.seat_ordered?.map(item => `[${item}]`).join('、')
  return (
    <Aside className='px-3 py-3 mt-5 mt-lg-4' >
      <i className={`align-middle fs-4 color-primary ${(titleMsg) ? "bi bi-ui-checks" : "bi bi-list-check"}`}></i>
      <span className='ms-3 color-primary fw-bold'>{titleMsg ? `${titleMsg}` : t("screenCheck.select_check")}</span>
      <div className="screenCheck">
        {(order) ?
          <div className='d-flex justify-content-between mb-2'>
            <span>{t("screenCheck.order_id")}</span>
            <span>{order.id}</span>
          </div> :
          <div className='movieInfo d-flex justify-content-start mb-3'>
            <span className='px-1 me-2'>{state.orderList.movie_level}</span>
            <span className='border px-1'>{state.orderList.movie_length}</span>
          </div>
        }
        <div className='d-flex justify-content-between mb-2'>
          <span>{t("screenCheck.movie_name")}</span>
          <span>{`${transMovieTitleName(language, movie_name)} (${movie_level})`}
          </span>
        </div>
        <div className='d-flex justify-content-between mb-2'>
          <span>{t("screenCheck.date")}</span>
          <span>{transDateString(language, movie_date)}</span>
        </div>
        <div className='d-flex justify-content-between'>
          <span>{t("screenCheck.time")}</span>
          <span>{movie_time}</span>
        </div>
      </div>
      <div className="theaterSizeCheck d-flex  justify-content-between mb-2">
        <span>{t("screenCheck.theater")}</span>
        <span>{transTheaterSize(language, theater_size)}</span>
      </div>
      <div className="seatCheck mb-2">
        <span>{t("screenCheck.seats")}</span>
        <span>{seat_ordered}</span>
      </div>
      {(order) && <div className="priceCheck d-flex  justify-content-between">
        <span>{t("screenCheck.ticket_number")}</span>
        <span>{t("screenCheck.ticket_quantity", { quantity: order.quantity })}</span>
      </div>}
      {(!titleMsg) && <div className="priceCheck d-flex  justify-content-between">
        <span>{t("screenCheck.total")}</span>
        <span>${state.total}</span>
      </div>}
      {children}
    </Aside>
  );
}