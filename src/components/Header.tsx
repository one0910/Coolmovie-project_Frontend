import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { OrderContext } from "../store";
import { Login, Logout, HamburgerMenu } from "./";
import { authFetch, logoutClear, getCookie } from "../utilities";
import logoImg from './../assets/images/Logo.png'
import { useTranslation, Trans } from 'react-i18next';
import { useForm, useWatch } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setLanguage } from "../store/common/common.reducer";

interface HeaderProps { }

export const Header: React.FC<HeaderProps> = ({ }) => {
  const { t, i18n } = useTranslation();
  const storeDispatch = useAppDispatch()
  const [state, dispatch] = useContext(OrderContext);
  const [isLogin, setIsLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { register, getValues, control, setValue } = useForm<any>();
  const memberName = state.orderList.memberName ? state.orderList.memberName : "";
  const userRole = (state.orderList.role) ? state.orderList.role : ''
  const token = localStorage.getItem("userToken") ? localStorage.getItem("userToken") : null;
  useWatch({ control, name: ['language'] });
  const { language } = useAppSelector(state => state.common)
  // 當網頁重新整理refresh時，檢查是否已有登入過
  useEffect(() => {
    const rememberMe = getCookie("remember_me");
    if (token) {
      const tokenExpTime = JSON.parse(atob(token?.split(".")[1] || "")).exp;
      const userId = JSON.parse(atob(token?.split(".")[1] || "")).id;
      const currentTime = Math.floor(Date.now() / 1000);
      // 如果原本的token沒過期，則繼續向後端拿資料
      if (rememberMe && tokenExpTime > currentTime) {
        (async function () {
          try {
            let response = await authFetch.get("/api/member/getUser");
            const userName = response.data.data.nickName;
            const userMail = (response.data.data.email) ? response.data.data.email : null
            const googleId = (response.data.data.googleId) ? response.data.data.googleId : null
            const userRole = (response.data.data.role) ? response.data.data.role : ''

            dispatch({
              type: "ADD_MEMBER_DATA",
              payload: {
                memberId: userId,
                googleId: googleId,
                memberName: userName,
                memberMail: userMail,
                role: userRole,
                status: "member",
              },
            });

          } catch (error) {
            console.log("error", error);
          }
          setIsLogin(true);
        })();
      } else {
        logoutClear(dispatch);
        setIsLogin(false);
      }
    } else {
      logoutClear(dispatch);
      setIsLogin(false);
    }

  }, [dispatch]);

  /*這邊先用來設置語系，將store裡的Language設置到header裡的language select*/
  useEffect(() => {
    setValue('language', language)
  }, [])

  /*當select有變更時，則更新相關併發的副作用程式*/
  useEffect(() => {
    const lng = getValues().language
    if (lng) {
      i18n.changeLanguage(lng).then(() => {
        document.title = t("title.document_title")
        storeDispatch(setLanguage(lng))
      });
    }

  }, [getValues().language])

  return (
    <div className="headerContainer position-sticky left-0 top-0">
      <nav className="navbar container">
        <div className="container-fluid p-0 space-between">
          <a className="logo" onClick={() => window.location.href = '/'}>
            {/* <img src="/images/Logo.png" alt="" /> */}
            <img src={logoImg} alt="" />
          </a>
          <ul className="menuWrap">
            {/* <NavLink to={`/benifet`}>
              <li>{t("menu.benefit")}</li>
            </NavLink>
            <NavLink to={`/aboutus`}>
              <li>{t("menu.about")}</li>
            </NavLink> */}
            {(userRole == 'admin' || userRole == 'view') &&
              <NavLink to={`/admin`}><li>{t("menu.aminPanel")}</li></NavLink>
            }
          </ul>
          <div className="d-flex align-items-center headerBtnContainer">
            {(isLogin || state.orderList.status === "member") ? (
              /*登入後會員頭像*/
              <div className="loginNav">
                <NavLink className="nav-link navLink" to={`/member`}>
                  <i className=" bi-person-circle btn-outline-warning"></i>
                </NavLink>
                {/* <span className="me-2 memberName">{memberName} 您好</span> */}
                <span className="me-2 memberName">
                  <Trans
                    i18nKey={t('greeting')}
                    values={{
                      greet: memberName
                    }}
                  />
                </span>
                {/* 登出按鈕 */}
                <Logout isLogin={isLogin} setIsLogin={setIsLogin} />
              </div>
            ) : (
              <Login setIsLogin={setIsLogin} LoingMsg={`${t('register.login')} / ${t('register.signup')}`} LoginStatus={"login"} />
            )}
            <form className="ms-2">
              <select
                {...register("language", {
                  required: {
                    value: true,
                    message: '請選擇語言',
                  }
                })}
                value={language}
                className="select-language"
                style={{ backgroundImage: 'url(/images/home/language-icon.png)' }}
              >
                <option value="en">English</option>
                <option value="zh">繁體中文</option>
              </select>

            </form>
            <div
              className="navbar-hamburger ms-2 d-block d-md-none"
              role="button"
              onClick={() => setIsOpen(true)}
            >
              <img src="/images/menu-hamburger.png" />
            </div>
          </div>
        </div>
      </nav>
      <HamburgerMenu
        isLogin={isLogin}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      ></HamburgerMenu>
    </div>
  );
};
