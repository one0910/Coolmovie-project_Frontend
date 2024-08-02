import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import React, { useContext, Dispatch, FocusEvent, useState } from 'react'
import { useCheckEmailMutation, useCreateAccountMutation } from '../../../../services/memberService';
import { MemberContext } from '../context/member.context';
import { Loading } from '../../../../components';
import dayjs from 'dayjs';
import { UserItem } from '../context/member.type';
import { CatchErrorMessage } from '../../../../interface';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

interface MemberCreateTableModalProps {
  modalOpen: {
    createNewModalOpen: boolean
    setCreateNewModalOpen: Dispatch<React.SetStateAction<boolean>>
  }
}

export const MemberCreateTableModal: React.FC<MemberCreateTableModalProps> = ({ modalOpen }) => {
  const { t } = useTranslation()
  const { createNewModalOpen, setCreateNewModalOpen } = modalOpen
  const [emailValidationStatus, setEmailValidationStatus] = useState<{ status: 'success' | 'error' | 'validating' | undefined, message: string | null }>({ status: undefined, message: null });
  // const [emailValidationStatus, setEmailValidationStatus] = useState({ status: '', message: '' })
  const [form] = Form.useForm();
  const { addItemToProvider, isLoading, setLoadingToProvider } = useContext(MemberContext)
  const [checkEmail] = useCheckEmailMutation()
  const [createAccount] = useCreateAccountMutation()

  const checkEmailHandler = async (e: FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (email) {
      try {
        const response = await checkEmail(email).unwrap()
        setEmailValidationStatus({ status: 'success', message: response.data.message });

      } catch (error: any) {
        console.log('error => ', error)
        setEmailValidationStatus({ status: 'error', message: error.data.message });
      }

    }
  };

  /*按下確定鈕*/
  const submitHandle = async (values: UserItem) => {
    const random = Math.floor(Math.random() * 10000000)
    const formattedValues = {
      ...values,
      profilePic: (values.profilePic) ? values.profilePic : `https://api.dicebear.com/7.x/miniavs/svg?seed=${random}`,
      birthday: (values.birthday && dayjs.isDayjs(values.birthday)) ? values.birthday.format('YYYY-MM-DD') : null,
    };
    setLoadingToProvider(true)
    try {
      const { data } = await createAccount(formattedValues).unwrap()
      addItemToProvider(data)
      closeModal()
    } catch (error) {
      const catchError = error as CatchErrorMessage
      console.log('catchError => ', catchError.data?.message)
      setLoadingToProvider(false)
      // closeModal()
    }

  }

  const closeModal = () => {
    setCreateNewModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Loading isActive={isLoading} />
      <Modal
        className='createNewModal'
        title={t("admin_page.member_mamagement_page.add_new_member")}
        open={createNewModalOpen}
        okText={t("button.save")}
        cancelText={t("button.cancel")}
        maskClosable={false}
        footer={null}
        onCancel={closeModal}
        destroyOnClose={true}
        keyboard={false}
      >
        <Form
          form={form}
          className='editMemberForm'
          labelCol={{ span: 5 }}
          autoComplete='off'
          onFinish={submitHandle}
          initialValues={{
            role: 'user',
          }}
        >
          <Form.Item
            name='nickName'
            label={t("admin_page.member_mamagement_page.member_nick_name")}
            rules={[
              {
                required: true,
                message: '請輸入會員的名稱'
              },
              { whitespace: true },
              {
                min: 3,
                message: t("admin_page.form_formated_vertification.enter_at_least_x_characters")
              }
            ]}
            hasFeedback
          >
            <Input placeholder='請輸入會員的名稱' />
          </Form.Item>
          <Form.Item
            name='email'
            label={t("admin_page.member_mamagement_page.email")}
            rules={[
              {
                required: true,
                message: '請輸入會員Email'
              },
              {
                type: 'email',
                message: t("admin_page.member_mamagement_page.a_valid_email_address")
              },
            ]}
            // hasFeedback
            validateStatus={emailValidationStatus.status}
            help={
              emailValidationStatus.message && (
                <span
                  style={{
                    color: (emailValidationStatus.status === 'success') ? '#3ced9c' :
                      (emailValidationStatus.status === 'error') ? '#fd8686' : 'rgba(255, 255, 255, 0.9)'
                  }}
                >
                  {emailValidationStatus.message}
                </span>
              )
            }
          >
            {/* <Input placeholder='請輸入會員Email' /> */}
            <Input placeholder='請輸入會員Email' onBlur={checkEmailHandler} />
          </Form.Item>
          <Form.Item
            name='password'
            label={t("admin_page.member_mamagement_page.password")}
            rules={[
              {
                required: true,
                message: t("admin_page.admin_page.form_formated_vertification.password_field_is_required")
              },
              { min: 5 },
            ]}
            hasFeedback
          >
            <Input.Password placeholder='請輸入密碼' />
          </Form.Item>
          <Form.Item
            name='confirmPassowrd'
            label={t("admin_page.form_formated_vertification.confirm_password")}
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: '請做密碼確認'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(t("admin_page.form_formated_vertification.passwords_do_not_match"))
                }
              })
            ]}
            hasFeedback
          >
            <Input.Password placeholder='Confirm Your Password' />
          </Form.Item>
          <Form.Item
            name='birthday'
            label={t("admin_page.member_mamagement_page.birthday")}
          >
            <DatePicker
              style={{ width: '100%' }}
              picker='date'
              placeholder='出生年月日' />
          </Form.Item>
          <Form.Item
            name='role'
            label={t("admin_page.member_mamagement_page.level")}
            rules={[
              {
                required: true,
                message: t("admin_page.form_formated_vertification.level_field_is_required")
              },
            ]}
          >
            <Select placeholder='選擇會員級別' className='roelSelect'>
              <Select.Option value='admin'>{t("admin_page.member_mamagement_page.level_admin")}</Select.Option>
              <Select.Option value='user'>{t("admin_page.member_mamagement_page.level_general")}</Select.Option>
              <Select.Option value='view'>{t("admin_page.member_mamagement_page.level_browsing")}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name='phoneNumber'
            label={t("admin_page.member_mamagement_page.phone_number")}
            rules={[
              {
                validator: (_, value) =>
                  value && !/^\d+$/.test(value)
                    ? Promise.reject('請輸入數字格式')
                    : Promise.resolve(),
              },
            ]}
          >
            <Input placeholder='輸入電話號碼' />
          </Form.Item>
          <Form.Item
            name='profilePic'
            label={t("admin_page.member_mamagement_page.profile_picture_url")}
            rules={[
              {
                type: 'url',
                message: t("admin_page.form_formated_vertification.profilePic_field_formated_invalid")
              },
            ]}
          >
            <Input placeholder='Add your website URL' />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
            <Button className='btn-outline-warning' onClick={closeModal}>{t("button.cancel")}</Button>
            <Button className='btn_primary' htmlType='submit' style={{ marginLeft: 10 }}>{t("button.confirm")}</Button>
          </Form.Item>

        </Form>
      </Modal >
    </>
  );
}