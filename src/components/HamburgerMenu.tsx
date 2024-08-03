import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { OrderContext } from "../store";
import { t } from "i18next";

interface HamburgerMenuProps {
  isLogin: boolean;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isLogin,
  isOpen,
  setIsOpen,
}) => {

  const location = useLocation();
  const navigate = useNavigate();
  const navigateHandler = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  const [state, dispatch] = useContext(OrderContext);
  const isGoogleMember = (state.orderList.googleId) ? true : false
  return (
    <>
      <div
        className="hamburger-menu"
        style={{
          display: isOpen ? "block" : "none",
        }}
      >
        <div className="d-flex justify-content-between align-items-center p-3">
          <div className="hamburger-menu-logo">
            <img src="/images/Logo.svg" />
          </div>
          <div
            className="hamburger-menu-close"
            role="button"
            onClick={() => setIsOpen(false)}
          >
            <img src="/images/close-icon.png" />
          </div>
        </div>
        <ul className="hamburger-menu-link">
          {/* <li>
            <p
              className={location.pathname.match("/benifet") ? "active" : ""}
              onClick={() => navigateHandler("/benifet")}
              role="button"
            >
              好康優惠
            </p>
          </li> */}
          {/* <li>
            <p
              className={location.pathname.match("/aboutus") ? "active" : ""}
              onClick={() => navigateHandler("/aboutus")}
              role="button"
            >
              關於影城
            </p>
          </li> */}
          <li>
            <p
              className={location.pathname.match("/admin") ? "active" : ""}
              onClick={() => navigateHandler("/admin")}
              role="button"
            >
              {t("menu.aminPanel")}
            </p>
          </li>
          {isLogin && (
            <>
              <li>
                <p
                  className={location.pathname === "/member" ? "active" : ""}
                  onClick={() => navigateHandler("/member")}
                  role="button"
                >
                  {t("member_page.profile.profile_title")}
                </p>
              </li>
              {(!isGoogleMember) &&
                <li>
                  <p
                    className={
                      location.pathname.match("/member/account") ? "active" : ""
                    }
                    onClick={() => navigateHandler("/member/account")}
                    role="button"
                  >
                    {t("member_page.edit_password.edit_passowrd_sidebar")}
                  </p>
                </li>
              }
              <li>
                <p
                  className={
                    location.pathname.match("/member/order") ? "active" : ""
                  }
                  onClick={() => navigateHandler("/member/order")}
                  role="button"
                >
                  {t("member_page.booking_recod.booking_record_sidebar")}
                </p>
              </li>
              <li>
                <p
                  className={
                    location.pathname.match("/member/bonus") ? "active" : ""
                  }
                  onClick={() => navigateHandler("/member/bonus")}
                  role="button"
                >
                  {t("member_page.bonus.bonus_sidebar")}
                </p>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};
