import React from "react";
import { useTranslation } from "react-i18next";

interface HomeDiscount { }

export const HomeDiscount: React.FC<HomeDiscount> = () => {
  const { t } = useTranslation()
  return (
    <div
      className="homeDiscount"
      style={{ backgroundImage: "url(/images/home/discount-bg.png)" }}
    >
      <div className="container d-flex justify-content-between align-items-center flex-column flex-lg-row h-100">
        <div className="homeDiscount-desc" style={{ backgroundImage: "url(/images/home/discount-bg.png)" }}>
          <h2>{t("copy.coupon_title")}</h2>
          <p>{t("copy.coupon_content")}</p>
        </div>
        <div className="homeDiscount-img">
          <img src="/images/home/discount-pic.png" />
        </div>
      </div>
    </div>
  );
};
