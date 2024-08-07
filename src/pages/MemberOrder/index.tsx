import React, { useState, useEffect, useContext, useRef } from "react";
import { OrderContext } from "../../store";
import { authFetch } from "../../utilities";
import { MemberContainer } from "../../components/MemberContainer";
import { OrderDataType, PopUpwindowRefType } from "../../interface";
import { Loading } from "../../components";
import { PopUpWindows } from "../../components";
import { OrderList } from "./components/OrderList";
import { t } from "i18next";

const MemberOrder: React.FC = ({ }) => {
  const [state, dispatch] = useContext(OrderContext);
  const [loading, setLoading] = useState(false)
  const [orderData, setOrderData] = useState<OrderDataType[]>([])


  useEffect(() => {
    (async function () {
      setLoading(true)
      try {
        let response = await authFetch.get(`api/order/getMemberOrder/?memberId=${state.orderList.memberId}`)
        setOrderData(response.data.data)
        setLoading(false)
      } catch (error) {
        console.log('error', error);
      }
    }())
  }, [])

  return (
    <>
      <MemberContainer title={t("member_page.booking_recod.booking_record_sidebar")}>
        <Loading isActive={loading} />
        <div className="memberOrder">
          <ul className="orderHead">
            <li>{t("member_page.booking_recod.title_booking_time")}</li>
            <li>{t("member_page.booking_recod.title_booking_movie")}</li>
            <li>{t("member_page.booking_recod.title_booking_date")}</li>
            <li>{t("member_page.booking_recod.title_booking_seats")}</li>
          </ul>
          <ul className="orderContentWrap">
            {orderData.map((order, index) => {
              return (
                <OrderList key={order.id} {...order} />
              )
            })}
          </ul>
        </div>

      </MemberContainer>
    </>
  );
};

export default MemberOrder
