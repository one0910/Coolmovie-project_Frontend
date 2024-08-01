import React from "react";
import { useAppSelector } from "../../../hooks";
import { useTranslation } from "react-i18next";

interface HomeShowing {
  isShowing: boolean;
  children?: React.ReactNode;
}

export const HomeShowing: React.FC<HomeShowing> = ({ children, isShowing }) => {
  const { t } = useTranslation();
  const { language } = useAppSelector(state => state.common)

  const getTitleElement = () => {
    if (language === 'zh') {
      return (
        <h2 className="homeShowing-title">
          {isShowing ? "熱映中" : "即將上映"}
          <span className="ms-4">{isShowing ? "NOW SHOWING" : "COMING SOON"}</span>
        </h2>
      );
    } else if (language === 'en') {
      return (
        <h2 className="text-uppercase color-primary-dark">
          {t(isShowing ? "movie.now_showing" : "movie.coming_soon")}
        </h2>
      );
    }
    return null;
  };


  return (
    <div className="homeShowing">
      {getTitleElement()}
      <hr />
      {children}
    </div>
  );
};
