import React, { useRef, useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { OrderContext } from '../../store';
import { ScreenCheck, PopUpWindows, MessageBox } from '../../components/';
import { PopUpwindowRefType } from '../../interface';
import { authFetch } from '../../utilities';
import { Loading } from '../../components';
import { CompleteResDataType } from '../../interface';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAppSelector } from '../../hooks';
import { transArraySeats, transDateString, transMovieTitleName, transTheaterSize } from '../../helper/transform.language';

const CompleteBookingItemDiv = styled.div<{ language: string }>`
  span.title{
    width: 100px;
    padding: 2px 0px;
    text-align: center;
    letter-spacing: 1px;
  }
`

interface CheckCompleteProps {

}

export const CheckComplete: React.FC<CheckCompleteProps> = ({ }) => {
  const { t } = useTranslation()
  const { language } = useAppSelector(state => state.common)
  const [state, dispatch] = useContext(OrderContext);
  const orderId = useParams().orderId
  const [loading, setLoading] = useState(false)
  const popUpwindowRef = useRef<PopUpwindowRefType | null>(null);
  const navigate = useNavigate();
  const [completeOrderData, setCompleteOrderData] = useState<{
    id: string,
    movieName: string,
    moviePlayDate: string,
    moviePlayTime: string,
    seatOrdered: []
    theater_size: string,
    status: string
  } | null>(null)

  useEffect(() => {
    setLoading(true);
    popUpwindowRef.current?.openModal();
    (async function () {
      try {
        let response = await authFetch.get(`api/order/getOrderData/?orderId=${orderId}`)
        console.log('response => ', response)
        setCompleteOrderData(response.data.data)
        dispatch({
          type: "ADD_ORDER_FROM_HOME",
          payload: {
            memberMail: response.data.data.userEmail,
          },
        });
        setLoading(false)
      } catch (error) {
        console.log('error', error);
      }
    }())
  }, [])
  return (
    <>
      {/* <h1>結帳完成</h1> */}

      <PopUpWindows ref={popUpwindowRef} backgroundClose={false}>
        <Loading isActive={loading} />
        <MessageBox >
          <div className='text-center'>
            <i className="bi bi-ticket-perforated color-primary fw-bold fs-2 me-3"></i>
            <strong className='color-primary fs-2'>{t("order.booking_complete_title")}</strong>
          </div>
          <div className='orderedMovieInfo mt-3 mb-3 px-lg-4 py-lg-3 px-2 py-2 rounded'>
            <CompleteBookingItemDiv language={language} className='d-flex justify-content-between'>
              <span className='title'>{t("screenCheck.order_id")}</span>
              <span>{completeOrderData?.id}</span>
            </CompleteBookingItemDiv>
            <CompleteBookingItemDiv language={language} className='d-flex justify-content-between mt-3'>
              <span className='title'><span className='title'>{t("screenCheck.movie_name")}</span></span>
              <span>{`${transMovieTitleName(language, completeOrderData?.movieName)} 
                    (${transTheaterSize(language, completeOrderData?.theater_size)})`
              }</span>
            </CompleteBookingItemDiv>
            <CompleteBookingItemDiv language={language} className='d-flex justify-content-between my-3'>
              <span className='title'>{t("screenCheck.date")}</span>
              <span>{`${transDateString(language, completeOrderData?.moviePlayDate as string)} ${completeOrderData?.moviePlayTime}`}</span>
            </CompleteBookingItemDiv>
            <CompleteBookingItemDiv language={language} className='d-flex justify-content-between align-items-center seats'>
              <span className='title'>{t("screenCheck.seats")}</span>
              <span>{transArraySeats(language, completeOrderData?.seatOrdered as [])}</span>
            </CompleteBookingItemDiv>
          </div>
          <p className='mt-2 text-start'>{t("order.booking_complete_content")}</p>
          {(completeOrderData?.status === "member") ?
            <div className='d-flex justify-content-between'>
              <button type='button' className='btn_primary mt-4 me-1 w-100' onClick={() => {
                popUpwindowRef.current?.closeModal()
                navigate('/member')
              }}>{t("member_page.member_center_title")}
              </button>
              <button type='button' className='btn_primary mt-4 ms-1 w-100' onClick={() => {
                popUpwindowRef.current?.closeModal()
                navigate('/')
              }}>{t("button.ok")}
              </button>
            </div> :
            <button className='btn_primary me-1 w-100 mt-2' onClick={() => {
              popUpwindowRef.current?.closeModal()
              navigate('/')
            }}>{t("button.ok")}</button>
          }
        </MessageBox>
      </PopUpWindows >
    </>
  );
}