import React, { useRef } from 'react'
import { convertPlayDateFormat } from '../../../utilities';
import { OrderDataType } from '../../../interface';
import { PopUpWindows } from '../../../components';
import { PopUpwindowRefType } from '../../../interface';
import { ScreenCheck } from '../../../components';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../hooks';
import { transArraySeats, transDateString, transLevel, transMovieTitleName } from '../../../helper/transform.language';

export const OrderList: React.FC<OrderDataType> = (order) => {
  const { t } = useTranslation()
  const { language } = useAppSelector(state => state.common)
  const popUpwindowRef = useRef<PopUpwindowRefType | null>(null);
  const openOrderDetail = () => {
    popUpwindowRef.current?.openModal()
  }
  return (
    <>
      <li className="orderContentList" >
        <ul className="orderContentListWrap" onClick={openOrderDetail}>
          <li>{convertPlayDateFormat(order.createTime).dateNoweekday}</li>
          <li>{`${transMovieTitleName(language, order.movieName)}
            (${transLevel(language, order.movielevel)})`}
          </li>
          <li>{`${transDateString(language, order.moviePlayDate)} ${order.moviePlayTime}`}</li>
          {/* <li>{order.seatOrdered.map(seat => seat).join('、')}</li> */}
          <li>{transArraySeats(language, order.seatOrdered)}</li>
          <li>{t("member_page.booking_recod.check_booking_detail")}</li>
        </ul>
      </li>
      <PopUpWindows ref={popUpwindowRef} backgroundClose={true}>
        <ScreenCheck titleMsg={t("screenCheck.order_detail")} order={order}>
          <div className='d-flex justify-content-between mt-3 screenCheck pb-2 mb-0 border-bottom-0'>
            <span>{t("order.payment_method_title")}</span>
            <span>{t("order.payment_method_creditcard")}</span>
          </div>
          <div className='d-flex justify-content-between'>
            <span>{t("screenCheck.total")}</span>
            <span>${order.total}</span>
          </div>
          <button type='button' className='btn_primary me-1 w-100 mt-4' onClick={() => { popUpwindowRef.current?.closeModal() }}>{t("button.ok")}</button>
        </ScreenCheck>
      </PopUpWindows >
    </>
  );
}