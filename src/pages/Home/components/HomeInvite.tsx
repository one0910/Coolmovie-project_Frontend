import React from "react";
import { useTranslation } from "react-i18next";

interface HomeInvite { }

export const HomeInvite: React.FC<HomeInvite> = () => {
  const { t } = useTranslation()

  return (
    <div className="homeInvite">
      <h2 className="homeInvite-title">{t("copy.invite_title")}</h2>
      <ul className="homeInvite-card d-flex justify-content-between flex-column flex-md-row">
        <li className="d-flex flex-column align-items-center">
          <div
            className="homeInvite-card-img"
            style={{ backgroundImage: "url(/images/home/link-icon.png)" }}
          ></div>
          <p className="homeInvite-card-title">{t("copy.invite_link_share")}</p>
          <p className="homeInvite-card-subtitle">{t("copy.invite_link_share_content")}</p>
        </li>
        <li className="d-flex flex-column align-items-center">
          <div
            className="homeInvite-card-img"
            style={{ backgroundImage: "url(/images/home/ticket-icon.png)" }}
          ></div>
          <p className="homeInvite-card-title">{t("copy.invite_friend_register")}</p>
          <p className="homeInvite-card-subtitle">
            {t("copy.invite_friend_register_content")}
          </p>
        </li>
        <li className="d-flex flex-column align-items-center">
          <div
            className="homeInvite-card-img"
            style={{ backgroundImage: "url(/images/home/good-icon.png)" }}
          ></div>
          <p className="homeInvite-card-title">{t("copy.invite_get_benefit")}</p>
          <p className="homeInvite-card-subtitle">
            {t("copy.invite_get_benefit_content")}
          </p>
        </li>
      </ul>
    </div>
  );
};
