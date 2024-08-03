import React, { useEffect, useState, useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { getMember } from "../../api/member";
import { format } from "date-fns";
import { Loading } from "../../components";
import { I_MEMBER } from "../../interface";
import { OrderContext } from "../../store";
import { useTranslation } from "react-i18next";


const Member: React.FC = () => {
  const { t } = useTranslation()
  const [isLoading, setLoading] = useState(false);
  const [state, dispatch] = useContext(OrderContext);
  const isGoogleMember = (state.orderList.googleId) ? true : false
  const [member, setMember] = useState<I_MEMBER>({
    birthday: "",
    email: "",
    nickName: "",
    phoneNumber: "",
    profilePic: "",
    role: ""
  });
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const { data: response } = await getMember();
        if (response.status) {
          const { data: memberInfo } = response;
          const { birthday, email, nickName, phoneNumber, profilePic, role } = memberInfo;
          setMember({
            birthday: birthday ? format(new Date(birthday), "yyyy-MM-dd") : t("member_page.no_data"),
            email: email || t("member_page.no_data"),
            nickName: nickName || t("member_page.no_data"),
            phoneNumber: phoneNumber || t("member_page.no_data"),
            profilePic: profilePic || "/images/member/default_avatar.svg",
            role: role
          });
          return;
        }
        alert(response.message);
      } catch (error) {
        alert(t("ErroMsg"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <Loading isActive={isLoading}></Loading>
      <div className="member py-5 p-md-5">
        <div className="container  d-flex">
          <div className="member-sidebar me-4 d-none d-lg-block">
            <div className="member-sidebar-user  p-3 pt-5 mb-4 d-flex flex-column">
              <div
                className="member-sidebar-user-avatar align-self-center rounded-circle overflow-hidden mb-1"
                style={{
                  backgroundImage: `url(${member.profilePic})`,
                }}
              ></div>
              <hr className="my-2" />
              <div className="member-sidebar-user-name">
                <p className="text-muted">{t("member_page.member")}</p>
                <p>{member.nickName}</p>
              </div>
              <hr className="my-2" />
              <div className="member-sidebar-user-email">
                <p className="text-muted">{t("member_page.email")}</p>
                <p className="mb-1x">{member.email}</p>
              </div>
            </div>
            <ul className="member-sidebar-nav py-5 ps-0">
              <li>
                <NavLink
                  end
                  to={`/member`}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {t("member_page.profile.profile_title")}
                </NavLink>
              </li>
              {(!isGoogleMember) &&
                <li>
                  <NavLink to={`/member/account`}>{t("member_page.edit_password.edit_passowrd_sidebar")}</NavLink>
                </li>
              }

              <li>
                <NavLink to={`/member/order`}>{t("member_page.booking_recod.booking_record_sidebar")}</NavLink>
              </li>
              <li>
                <NavLink to={`/member/bonus`}>{t("member_page.bonus.bonus_sidebar")}</NavLink>
              </li>
            </ul>
          </div>
          <Outlet context={{ member, setMember }}></Outlet>
        </div>
      </div>
    </>
  );
};

export default Member
