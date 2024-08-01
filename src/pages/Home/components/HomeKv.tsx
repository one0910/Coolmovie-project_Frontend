import React from "react";
import { Autoplay } from "swiper";
import { useTranslation } from "react-i18next";

import { Swiper, SwiperSlide } from "swiper/react";

interface HomeKvProps {
  children?: React.ReactNode;
}

export const HomeKv: React.FC<HomeKvProps> = ({ children }) => {
  const { t } = useTranslation()
  return (
    <div className="homeKv">
      <div className="bannerTitle text-center">
        <h1>{t("title.home_title")}</h1>
      </div>
      <Swiper
        className="homeKv-swiper"
        modules={[Autoplay]}
        slidesPerView={1}
        loop={true}
        speed={2000}
        autoplay={{
          delay: 2000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        }}
      >
        <SwiperSlide>
          <picture>
            <img src="/images/home/banner.jpg" />
          </picture>
        </SwiperSlide>
      </Swiper>
      {children}
    </div>
  );
};
