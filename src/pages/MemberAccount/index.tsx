import React, { useState } from "react";
import { MemberContainer } from "../../components/MemberContainer";
import { useForm } from "react-hook-form";
import { I_ChangePassword } from "../../interface"
import { changePassword } from "../../api/member";
import { Loading } from "../../components";
import { CatchErrorMessage } from "../../interface";
import { t } from "i18next";

const MemberAccount: React.FC = ({ }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 表單資料
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<I_ChangePassword>();

  const onSubmit = async (formData: I_ChangePassword) => {
    setIsSubmitting(true);
    try {
      const { data: response } = await changePassword({
        ...formData,
      });
      if (response.status) {
        alert('修改密碼成功')
        return;
      }
      alert(response.message);
    } catch (error) {
      const CatchErrorMessage = error as CatchErrorMessage
      alert(CatchErrorMessage.response.data.message);
    } finally {
      reset()
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Loading isActive={isSubmitting}></Loading>
      <MemberContainer title={t("member_page.edit_password.edit_passowrd_sidebar")}>
        <div className="MemberAccount">
          <form className="MemberAccount-form d-flex flex-column" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2">
              <label htmlFor="password" className="mb-2">
                {t("member_page.edit_password.new_passowrd")}
              </label>
              <input
                id="password"
                type="password"
                className="input mb-2"
                autoComplete="off"
                placeholder={t("member_page.edit_password.new_passowrd")}
                {...register("password", { required: "請輸入密碼" })}
              />
              {errors.password && (
                <span className="member-form-error">
                  {errors.password.message}
                </span>
              )}
              <input
                id="passwordCheck"
                type="password"
                className="input"
                autoComplete="off"
                placeholder={t("member_page.edit_password.confirm_passowrd")}
                {...register("confirmPassword", { required: "再次確認新密碼" })}
              />
              {errors.confirmPassword && (
                <span className="member-form-error">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            <input
              type="submit"
              className="button align-self-end"
              value={t("button.save")}
            />
          </form>
        </div>
      </MemberContainer>
    </>
  );
};

export default MemberAccount