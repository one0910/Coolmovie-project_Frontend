import { Button, DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd';
import React, { useContext, Dispatch, useEffect, useState } from 'react'
import { useUpdateUserDataMutation } from '../../../../services/memberService';
import { MemberContext } from '../context/member.context';
import { OrderContext } from '../../../../store';
import { converDateFormat } from '../../../../utilities';
import { Loading } from '../../../../components';
import dayjs from 'dayjs';
import { CatchErrorMessage } from '../../../../interface';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { setError } from '../../../../store/common/common.reducer';
import { useTranslation } from 'react-i18next';



interface MemberEditTableModalProps {
  modalOpen: {
    isModalOpen: boolean
    setIsModalOpen: Dispatch<React.SetStateAction<boolean>>
  }
  index: number | null
}

export const MemberEditTableModal: React.FC<MemberEditTableModalProps> = ({ modalOpen, index }) => {
  const storeDispatch = useAppDispatch()
  const { t } = useTranslation()
  const { isModalOpen, setIsModalOpen } = modalOpen
  const { isError } = useAppSelector(state => state.common.error)
  const [form] = Form.useForm();
  const [updateUserData] = useUpdateUserDataMutation()
  const { updateItemToProvider, userItems, isLoading, setLoadingToProvider } = useContext(MemberContext)
  const [state, dispatch] = useContext(OrderContext);
  const userRole = (state.orderList.role) ? state.orderList.role : ''
  const confirmTipText = (userRole === 'view') ? `${t("admin_page.common.view_mode_notice_modify_text")}` : ''
  const isView = (userRole === 'view') ? true : false

  /*按下確定鈕*/
  const submitHandle = async (values: any) => {
    setLoadingToProvider(true)
    const formattedValues = {
      ...values,
      birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null
    };
    try {
      const response = await updateUserData(formattedValues).unwrap();
      updateItemToProvider(formattedValues.index, response.data)
      closeModal()
    } catch (error) {
      const catchError = error as CatchErrorMessage
      console.log('catchError => ', catchError.data?.message)
      setLoadingToProvider(false)
      storeDispatch(setError({ isError: !isError, errorMessage: `${catchError.data?.message}` }))
    }
  }

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  useEffect(() => {
    if (index !== null) {
      const updatedMemberData = {
        index,
        ...userItems[index],
        birthday: converDateFormat(userItems[index].birthday as string),
      };
      form.setFieldsValue({
        index: updatedMemberData.index,
        memberID: updatedMemberData._id,
        nickName: updatedMemberData.nickName,
        email: updatedMemberData.email,
        birthday: (updatedMemberData.birthday) ? dayjs(updatedMemberData.birthday) : "",
        role: updatedMemberData.role,
        phoneNumber: updatedMemberData.phoneNumber,
        profilePic: updatedMemberData.profilePic,
      });
    }
  }, [isModalOpen])
  return (
    <>
      <Loading isActive={isLoading} />
      <Modal
        className='editModal'
        title=<span>{t("admin_page.member_mamagement_page.edit_member_data")} <span style={{ color: '#aaa', fontSize: '12px' }}>{confirmTipText}</span></span>
        open={(isModalOpen === true && index !== null)}
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
          // wrapperCol={{ span: 10 }}
          autoComplete='off'
          onFinish={submitHandle}
        >
          <Form.Item
            name='index'
            style={{ display: 'none' }}
          >
            <Input type='hidden' />
          </Form.Item>
          <Form.Item
            name='memberID'
            label={t("admin_page.member_mamagement_page.member_id")}
          >
            <Input disabled />
          </Form.Item>
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
          >
            <Input placeholder='請輸入會員Email' />
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
            <Button className='btn_primary' htmlType='submit' style={{ marginLeft: 10 }} disabled={isView}>{t("button.confirm")}</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}