import React from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../hooks";
interface FooterProps { }

export const Footer: React.FC<FooterProps> = () => {
  const { t } = useTranslation()
  const { language } = useAppSelector(state => state.common)

  return (
    <>
      <div className="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-12">
              <div className="footer-logo">
                <img src="/images/Logo.png" />
              </div>
              <ul className="d-flex footer-content">
                <li>{t("footer.contact_us")}</li>
                <li>{t("footer.faq")}</li>
                <li>{t("footer.privacy_policy_statement")}</li>
              </ul>
              <div className="d-flex">
                <div className="footer-fb">
                  <img src="/images/fb-icon.png" />
                </div>
                <div className="footer-ig ms-4">
                  <img src="/images/ig-icon.png" />
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-12 mt-4 d-lg-block d-none">
              <div>{t("title.document_title")}</div>
              <ul className="footer-contact">
                <li>02-8502-2208</li>
                {(language === 'zh') && <li>台北市市民大道 22 號 6 樓</li>}
                <li>
                  6F, No.22, Jingye 3rd Rd., Zhongshan Dist.,Taipei City 104,
                  Taiwan (R.O.C.)
                </li>
              </ul>
            </div>
          </div>
          <hr />
          <div className="row footer-copyright">
            <div className="col-12 text-center">
              Copyright @ 2023 Cinemas. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
