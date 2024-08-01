import React, { useState, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components';
import { Login } from '../../../components';
import { useTranslation } from 'react-i18next';


const Figure = styled.figure<{ isLogin: boolean }>`
  display:${(props) => {
    if (props.isLogin) {
      return "none"
    } else {
      return "block"
    }
  }};
`
interface CallToActioProps {
  isLogin: boolean;
  setIsLogin?: Dispatch<SetStateAction<boolean>>
}

export const CallToActio: React.FC<CallToActioProps> = (props) => {
  const { t } = useTranslation()
  const [isLogin, setIsLogin] = useState(false);
  return (
    <Figure className='joinMember mt-1 mb-4 shadow' isLogin={props.isLogin}>
      <div className='mb-2'>
        <i className="bi bi-person-hearts align-middle fs-5 color-primary"></i>
        <span className='ms-3 color-primary fw-bold'>{t("ticketPage.join_us_title")}</span>
      </div>
      <div className="bg-2nd py-4 ps-3 rounded-1">
        {/* <div className='m-0 d-inline-block'> */}
        <div className='m-0 d-flex align-items-center'>
          {/* <button type='button' className='btn_primary me-2 me-lg-3'>加入會員</button> */}
          <Login setIsLogin={setIsLogin} LoingMsg={t("ticketPage.join_us_btn")} LoginStatus={"signup"} />
          <span className='ms-3'>{t("ticketPage.join_us_content")}</span>
        </div>
      </div>
    </Figure>
  );
}
