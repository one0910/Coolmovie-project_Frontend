import React from "react";
import { MemberContainer } from "../../components/MemberContainer";
import { useTranslation } from "react-i18next";

const MemberBonus: React.FC = ({ }) => {
  const { t } = useTranslation()
  return (
    <>
      <MemberContainer title={t("member_page.bonus.bonus_title")}>
        <div className="memberBonus">
          <div className="memberBonus-total mb-2 d-flex align-center">
            {t("member_page.bonus.bonus_get_point_number")}
            <img src="/images/member/icon_bonus_pink.svg" className="me-2" /> 0
          </div>
          <div className="memberBonus-list">
            <p className="mb-2">{t("member_page.bonus.bonus_get_point_record")}</p>
            {t("member_page.bonus.bonus_get_point_none")}
          </div>
        </div>
      </MemberContainer>
    </>
  );
};

export default MemberBonus