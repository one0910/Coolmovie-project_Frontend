import React, { useState, useContext, useEffect, useRef, MutableRefObject } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, useWatch, } from "react-hook-form"
import { ScreenCheck, PopUpWindows, MessageBox } from '../../components/';
import { OrderContext } from '../../store';
import { PopUpwindowRefType, CreditCardType, CompleteResDataType } from '../../interface';
import { authFetch } from '../../utilities';
import { Loading } from '../../components';
import io, { Socket } from "socket.io-client";
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../hooks';
import { transDateString, transMovieTitleName, transPaymentMethod, transSeats } from '../../helper/transform.language';

interface CheckPayProps { }

const ContactInfoInput = styled.div<{ language: string }>`
  span{
    width:auto;
    letter-spacing:${({ language }) => language === 'zh' ? '17px' : '1px'};
    @media screen and (max-width: 768px){
      letter-spacing:${({ language }) => language === 'zh' ? '4px' : '1px'};
      font-size: ${({ language }) => language === 'en' && '12px'};
    }
  }
`

const CreditCardInputLabel = styled.div<{ language: string }>`
  span{
    width:${({ language }) => language === 'en' && '150px'};
    @media screen and (max-width: 768px){
      /* width:117px; */
      width:${({ language }) => language === 'zh' ? '117px' : '90px'};
      font-size: ${({ language }) => language === 'en' && '12px'};
    }
  }
`

const CompleteBookingItemDiv = styled.div<{ language: string }>`
  span.title{
    width: 100px;
    padding: 2px 0px;
    text-align: center;
    letter-spacing: 1px;
  }

`

const CheckPay: React.FC<CheckPayProps> = ({ }) => {
  const [state, dispatch] = useContext(OrderContext);
  const [loading, setLoading] = useState(false)
  const [bankcodes, setBankcodes] = useState([])
  const [completeResData, setCompleteResData] = useState<CompleteResDataType | null>(null)
  const [isPayComplete, setIsPayComplete] = useState(false)
  const popUpwindowRef = useRef<PopUpwindowRefType | null>(null);
  const socketIoRef = useRef<Socket>()
  const { t } = useTranslation()
  const { language } = useAppSelector(state => state.common)
  const { register, handleSubmit, getValues, setValue, control, setError, formState: { errors } } = useForm<CreditCardType>({
    defaultValues: {
      email: state.orderList.memberMail || ""
    }
  });
  const navigate = useNavigate();
  const watchForm = useWatch({ control });
  const location = useLocation();
  const url = process.env.REACT_APP_REMOTE_URL || "http://localhost:3000";
  const orderId = useRef<string>("")
  let orderData = {
    "status": state.orderList.status,
    "memberId": state.orderList.memberId,
    "memberName": state.orderList.memberName,
    "movieId": state.orderList.movieId,
    "movie_name": state.orderList.movie_name,
    "movie_date": state.orderList.movie_date,
    "movie_time": state.orderList.movie_time,
    "movie_level": state.orderList.movie_level,
    "screenId": state.orderList.screenId,
    "seatOrdered": state.orderList.seat_ordered,
    "theater_size": state.orderList.theater_size,
    "quantity": state.orderList.quantity,
    "price": state.orderList.price,
    "total": state.total,
    "payMethod": "信用卡",
    "orderId": ""
  };
  // const payMethod = (getValues().payMethod === `creditCard`) ? ' - 信用卡' : (getValues().payMethod === `ecPay`) ? ' - 綠界金流' : ""
  const payMethod = ` - ${transPaymentMethod(language, getValues().payMethod)}` || ''

  // 進入該頁時，載入銀行的代碼
  useEffect(() => {
    setLoading(true)

    // transMovieTitleName('en', '小美人魚 (豪華廳)', true)
    // popUpwindowRef.current?.openModal()
    // setIsPayComplete(true)
    // popUpwindowRef.current?.closeModal()
    // setIsPayComplete(false)
    socketIoRef.current = io(url, { transports: ['websocket'] });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    dispatch({
      type: "SET_LAST_PAGE",
      payload: {
        lastPage: location.pathname,
      },
    });
    (async function () {
      try {
        let response = await authFetch.get('https://9b71893b-9621-4845-b234-553e758f8f8a.mock.pstmn.io/bankcode')
        setBankcodes(response.data.bankcode)
        setLoading(false)
      } catch (error) {
        console.log('error', error);
      }
    }())
  }, [])

  /*隨時監控form，若有錯誤，scroll移到最上方，先把此功能關掉，因為當它一出現錯誤，
    滑鼠滾輪就會移到最上面，干擾使用時的體驗
  */

  useEffect(() => {
    // if (errors) {
    //   window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    // }
  }, [watchForm])

  // 登入或註冊將會員email寫到email的input欄位
  useEffect(() => {
    setValue('email', state.orderList.memberMail)
  }, [state.orderList.memberMail])

  //按下一步時，跳出再次確認資訊的畫面
  const clickNextStep = (data: CreditCardType) => {
    popUpwindowRef.current?.openModal()
  };

  // 按下結帳
  const clickCheckPay = (data: CreditCardType) => {
    setLoading(true);
    let orderData = {
      "status": state.orderList.status,
      "phoneNumber": (data.phoneNumber) ? data.phoneNumber : "",
      "email": (data.email) ? data.email : "",
      "memberId": state.orderList.memberId,
      "memberName": state.orderList.memberName,
      "movieId": state.orderList.movieId,
      "movie_name": state.orderList.movie_name,
      "movie_date": state.orderList.movie_date,
      "movie_time": state.orderList.movie_time,
      "movie_level": state.orderList.movie_level,
      "screenId": state.orderList.screenId,
      "seatOrdered": state.orderList.seat_ordered,
      "theater_size": state.orderList.theater_size,
      "quantity": state.orderList.quantity,
      "price": state.orderList.price,
      "total": state.total,
      "payMethod": "信用卡",
      "orderId": ""
    };

    (async function () {
      try {
        let response = await authFetch.post(`api/order`, orderData)

        // 再把回傳的orderId寫回到orderData，用以傳送MAIL相關訂單明細
        orderData.orderId = response.data.data.OrderId;
        setIsPayComplete(true)
        setCompleteResData(response.data.data)
        socketIoRef?.current?.emit("order", {
          socketId: state.orderList.socketId,
          screenId: state.orderList.screenId,
          seatOrderedIndex: state.orderList.seat_orderedIndex,
        });
        setLoading(false);
        authFetch.post(`api/mail/orderMail`, orderData)

      } catch (error) {
        console.log('catch_error', error);
      }
    }())


  };

  const clickCheckECPay = async (data: CreditCardType) => {
    // let response = await axios.post('http://localhost:3050/checkout')
    const contactInfo = {
      "phoneNumber": (data.phoneNumber) ? data.phoneNumber : "",
      "email": (data.email) ? data.email : ""
    }
    let response = await authFetch.post(`api/order/ecpayCheckout`,
      { ...orderData, ...contactInfo },
      { withCredentials: true }
    )

    socketIoRef?.current?.emit("order", {
      socketId: state.orderList.socketId,
      screenId: state.orderList.screenId,
      seatOrderedIndex: state.orderList.seat_orderedIndex,
    });
    alert(`${t("order.ecpay_alert_notification")}`);
    document.write(response.data.data);
  }

  const payMethodBtnClick = (getValues().payMethod === `creditCard`) ? clickCheckPay : clickCheckECPay
  let creditCardInputErrMsgDiv = null
  let creditCardExpirationErrMsgDiv = null
  let screenContent = null
  if (!isPayComplete) {
    /*結帳之前 - 再次確認訂票資訊*/
    screenContent =
      <ScreenCheck titleMsg={t("screenCheck.title_check")}>
        <div className='d-flex justify-content-between mt-3 screenCheck pb-2 mb-0 border-bottom-0'>
          <span>{t("screenCheck.phone_number")}</span>
          <span>{getValues().phoneNumber}</span>
        </div>
        <div className='d-flex justify-content-between pb-2'>
          <span>{t("screenCheck.email_address")}</span>
          <span>{getValues().email}</span>
        </div>
        <div className='d-flex justify-content-between'>
          <button type='button' className='btn_primary mt-4 me-1 w-100' onClick={() => {
            if (window.scrollY > 0) {
              window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            }
            popUpwindowRef.current?.closeModal()
          }}>{t("screenCheck.cancel")}
          </button>
          {/* <button type='button' className='btn_primary mt-4 ms-1 w-100' onClick={handleSubmit(clickCheckPay)}>結帳</button> */}
          <button type='button' className='btn_primary mt-4 ms-1 w-100' onClick={handleSubmit(payMethodBtnClick)}>{t("screenCheck.checkout")}</button>
        </div>
      </ScreenCheck >
  } else {
    /*結帳完成後 - 訂票完成資訊*/
    screenContent = <MessageBox >
      <div className='text-center'>
        <i className="bi bi-ticket-perforated color-primary fw-bold fs-2 me-3"></i>
        <strong className='color-primary fs-2'>{t("order.booking_complete_title")}</strong>
      </div>
      <div className='orderedMovieInfo mt-3 mb-3 px-lg-4 py-lg-3 px-2 py-2 rounded'>
        <CompleteBookingItemDiv language={language} className='d-flex justify-content-between'>
          <span className='title'>{t("screenCheck.order_id")}</span>
          <span>{completeResData?.OrderId}</span>
        </CompleteBookingItemDiv>
        <CompleteBookingItemDiv language={language} className='d-flex justify-content-between mt-3'>
          <span className='title'>{t("screenCheck.movie_name")}</span>
          <span>{transMovieTitleName(language, completeResData?.MovieName, true)}</span>
        </CompleteBookingItemDiv>
        <CompleteBookingItemDiv language={language} className='d-flex justify-content-between my-3'>
          <span className='title'>{t("screenCheck.date")}</span>
          <span>
            {`${transDateString(language, completeResData?.MoviePlayDate as string)}  ${completeResData?.MoviePlayTime}`}
          </span>
        </CompleteBookingItemDiv>
        <CompleteBookingItemDiv language={language} className='d-flex justify-content-between align-items-center seats'>
          <span className='title'>{t("screenCheck.seats")}</span>
          <span>{transSeats(language, completeResData?.OrderSeat as string)}</span>
        </CompleteBookingItemDiv>
      </div>
      <p className='mt-2 text-start'>{t("order.booking_complete_content")}</p>

      {(state.orderList.status === "member") ?
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

  }

  /*信用卡號錯誤補捉訊息判斷*/
  if (errors.creditCardNumber1?.message === t("order.credit_card_input_cardnumber_label") || errors.creditCardNumber2?.message === t("order.credit_card_input_cardnumber_label") || errors.creditCardNumber3?.message === "請輸入卡號" || errors.creditCardNumber4?.message === "請輸入卡號") {
    creditCardInputErrMsgDiv = <p className="error-Msg">{t("order.card_number_require")}</p>
  } else if (errors.creditCardNumber1?.message === "卡號總共需輸入16碼" || errors.creditCardNumber2?.message === "卡號總共需輸入16碼" || errors.creditCardNumber3?.message === "卡號總共需輸入16碼" || errors.creditCardNumber4?.message === "卡號總共需輸入16碼") {
    creditCardInputErrMsgDiv = <p className="error-Msg">{t("order.credit_card_input_invalid_card_16-digit")}</p>
  } else {
    creditCardInputErrMsgDiv = null
  }

  /*信用卡號錯誤補捉訊息判斷*/
  if (errors.expirationMonth?.message === "請輸入信用卡有效月份(例:01/28)" || errors.expirationYear?.message === "請輸入信用卡有效年份(例如01/28)") {
    creditCardExpirationErrMsgDiv = <p className="error-Msg">{t("order.this_field_is_required")}</p>
  } else if (errors.expirationMonth?.message === "月份的有效輸入為01~12") {
    creditCardExpirationErrMsgDiv = <p className="error-Msg">{t("order.credit_card_input_invalid_card_month_(01-12)")}</p>
  } else if (errors.expirationYear?.message === "請輸入年份，例如2024，則輸入24") {
    creditCardExpirationErrMsgDiv = <p className="error-Msg">{t("order.credit_card_input_invalid_card_year_(YYYY)")}</p>
  } else {
    creditCardExpirationErrMsgDiv = null
  }

  return (
    <div className='container mb-5'>
      <Loading isActive={loading} />
      <div className="row">
        <div className="col-md-8">
          {
            <div className='contactInfo'>
              <div className="mb-2 mt-4">
                <i className="bi bi-telephone-fill align-middle fs-5 color-primary"></i>
                <span className='ms-3 color-primary fw-bold'>{t("order.contact_information_title")}</span>
              </div>
              <div className='creditCardInput bg-2nd py-4 ps-3 rounded-1'>
                <ContactInfoInput language={language}>
                  <span>{t("screenCheck.phone_number")}</span>:
                  <input
                    type="text"
                    size={30}
                    maxLength={10}
                    {...register('phoneNumber',
                      {
                        required: { value: true, message: t("order.phone_number_require"), },
                        minLength: { value: 10, message: t("order.phone_number_10-digit_is_require"), }
                      })
                    } />
                </ContactInfoInput>
                {errors.phoneNumber && (
                  <p className="error-Msg">{errors.phoneNumber.message}</p>
                )}
                <ContactInfoInput language={language} className='mt-3'>
                  <span>{t("screenCheck.email_address")}</span>:
                  <input type="text" size={30} {...register('email', { required: { value: true, message: t("order.email_address_require"), }, pattern: { value: /^\S+@\S+$/i, message: '您的email格式不正確', }, })} />
                </ContactInfoInput>
                {errors.email && (
                  <p className="error-Msg">{errors.email.message}</p>
                )}
              </div>
            </div>
          }
          <div className="mb-2 mt-4">
            <i className="bi bi-credit-card-fill align-middle fs-5 color-primary"></i>
            <span className='ms-3 color-primary fw-bold'>{`${t("order.payment_method_title")}${payMethod}`}</span>
          </div>
          <form className='screenFrom mb-2'>
            <div className='screenTime'>
              <span>
                <input
                  type="radio"
                  id="creditCard"
                  value="creditCard"
                  {...register('payMethod', {
                    required: {
                      value: true,
                      message: t("order.payment_method_require"),
                    }
                  })}
                />
                <label htmlFor="creditCard" className='rounded'>{t("order.payment_method_creditcard")}</label>
              </span>
              <span>
                <input
                  type="radio"
                  id="ecPay"
                  value="ecPay"
                  {...register('payMethod', {
                    required: {
                      value: true,
                      message: t("order.payment_method_require"),
                    }
                  })}
                />
                <label htmlFor="ecPay" className='rounded'>{t("order.payment_method_ecpay")}</label>
              </span>
            </div>
            {errors.payMethod && (
              <p className="error-Msg">{errors.payMethod.message}</p>
            )}
          </form>
          {(getValues().payMethod === 'creditCard') ?
            <>
              <span className='text-secondary fs-6'>{`**${t("order.payment_reminder_message")}**`}</span>
              <div className='creditCardInput bg-2nd py-4 ps-3 rounded-1 mt-2'>
                <img src="/images/creditCard.png" className='d-block creditCardImg' alt="" />
                <CreditCardInputLabel language={language} className='mt-4'>
                  <span>{t("order.credit_card_input_bank_label")}</span>:
                  <select {...register("bankCode", {
                    required: {
                      value: true,
                      message: t("order.bank_field_require"),
                    }
                  })}
                  >
                    <option value="">{t("order.credit_card_input_bank_label")}</option>
                    {
                      bankcodes?.map((bankcode, index) => {
                        return (
                          <option key={index} value={bankcode}>
                            {bankcode}
                          </option>
                        )
                      })
                    }
                  </select>
                </CreditCardInputLabel>
                {errors.bankCode && (
                  <p className="error-Msg">{errors.bankCode.message}</p>
                )}
                <CreditCardInputLabel language={language} className='mt-3'>
                  <span>{t("order.credit_card_input_cardnumber_label")}</span>:
                  {/* <input type="text" size={2} maxLength={4} {...register("creditCardNumber", { required: { value: true, message: '卡號總共需輸入16碼', }, })} /> - */}
                  <input type="text" size={3} maxLength={4} {...register('creditCardNumber1', { required: { value: true, message: t("order.credit_card_input_cardnumber_label"), }, minLength: { value: 4, message: '卡號總共需輸入16碼', }, })} /> -
                  <input type="text" size={3} maxLength={4} {...register('creditCardNumber2', { required: { value: true, message: t("order.credit_card_input_cardnumber_label"), }, minLength: { value: 4, message: '卡號總共需輸入16碼', }, })} /> -
                  <input type="text" size={3} maxLength={4} {...register('creditCardNumber3', { required: { value: true, message: t("order.credit_card_input_cardnumber_label"), }, minLength: { value: 4, message: '卡號總共需輸入16碼', }, })} /> -
                  <input type="text" size={3} maxLength={4} {...register('creditCardNumber4', { required: { value: true, message: t("order.credit_card_input_cardnumber_label"), }, minLength: { value: 4, message: '卡號總共需輸入16碼', }, })} />
                </CreditCardInputLabel>
                {creditCardInputErrMsgDiv}
                <CreditCardInputLabel language={language} className='my-3'>
                  <span>{t("order.credit_card_input_cardexpiredate_label")}</span>:
                  <input type="text" size={3} maxLength={2} {...register('expirationMonth', { required: { value: true, message: '請輸入信用卡有效月份(例:01/28)', }, pattern: { value: /^(0[1-9]|1[0-2])$/, message: '月份的有效輸入為01~12', }, })} /> -
                  <input type="text" size={3} maxLength={2} {...register('expirationYear', { required: { value: true, message: '請輸入信用卡有效年份(例如01/28)', }, minLength: { value: 2, message: '請輸入年份，例如2024，則輸入24', }, })} />
                  <small className='ms-2 text-secondary'>{t("order.credit_card_input_cardexpiredate_example_label")}</small>
                </CreditCardInputLabel>
                {creditCardExpirationErrMsgDiv}
                <CreditCardInputLabel language={language} className='securityNum'>
                  <span>{t("order.credit_card_input_verificationvalue_label")}</span>:
                  <input type="text" size={2} maxLength={3} {...register('securityNum', { required: { value: true, message: t("order.this_field_is_required"), }, minLength: { value: 3, message: t("order.credit_card_input_invalid_card_cvc_3-digit"), }, })} />
                  <img src="/images/security_number.jpg" />
                </CreditCardInputLabel>
                {errors.securityNum && (
                  <p className="error-Msg">{errors.securityNum.message}</p>
                )}
              </div></> : (getValues().payMethod === 'ecPay') ?
              <div>{t("order.click_next_button_to_checkout")}</div> : <div></div>
          }

        </div>
        <div className="col-md-4">
          <ScreenCheck>
            <button type='button' className='btn_primary me-1 w-100 mt-4' onClick={handleSubmit(clickNextStep)}>{t("button.next")}</button>
            <PopUpWindows ref={popUpwindowRef} backgroundClose={false}>
              {screenContent}
            </PopUpWindows >
          </ScreenCheck>
        </div>
      </div>
    </div>
  );
}

export default CheckPay