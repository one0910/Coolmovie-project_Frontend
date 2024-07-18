import { Button, DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd';
import React, { useContext, Dispatch, useEffect, useState } from 'react'
import { useUpdateUserDataMutation } from '../../../../services/memberService';
import { MemberContext } from '../context/member.context';
import { OrderContext } from '../../../../store';
import { converDateFormat } from '../../../../utilities';
import { Loading } from '../../../../components';
import dayjs from 'dayjs';
import { CatchErrorMessage } from '../../../../interface';



interface MemberEditTableModalProps {
  modalOpen: {
    isModalOpen: boolean
    setIsModalOpen: Dispatch<React.SetStateAction<boolean>>
  }
  index: number | null
}

export const MemberEditTableModal: React.FC<MemberEditTableModalProps> = ({ modalOpen, index }) => {
  const { isModalOpen, setIsModalOpen } = modalOpen
  const [form] = Form.useForm();
  const [updateUserData] = useUpdateUserDataMutation()
  const { updateItemToProvider, userItems, isLoading, setLoadingToProvider } = useContext(MemberContext)
  const [state, dispatch] = useContext(OrderContext);
  const userRole = (state.orderList.role) ? state.orderList.role : ''
  const confirmTipText = (userRole === 'view') ? '(此為瀏覽模式，無法修改)' : ''
  const isView = (userRole === 'view') ? true : false

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
        title=<span>修改資料 <span style={{ color: '#aaa', fontSize: '12px' }}>{confirmTipText}</span></span>
        open={(isModalOpen === true && index !== null)}
        okText='儲存'
        cancelText='取消'
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
            label="會員ID"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name='nickName'
            label="會員名稱"
            rules={[
              {
                required: true,
                message: '請輸入會員的名稱'
              },
              { whitespace: true },
              {
                min: 3,
                message: '最少3個字元'
              }
            ]}
          >
            <Input placeholder='請輸入會員的名稱' />
          </Form.Item>
          <Form.Item
            name='email'
            label="Email"
            rules={[
              {
                required: true,
                message: '請輸入會員Email'
              },
              {
                type: 'email',
                message: '請輸入Email格式，例如abc@def.com'
              },
            ]}
          >
            <Input placeholder='請輸入會員Email' />
          </Form.Item>
          <Form.Item
            name='birthday'
            label="生日"
          >
            <DatePicker
              style={{ width: '100%' }}
              picker='date'
              placeholder='出生年月日' />
          </Form.Item>
          <Form.Item
            name='role'
            label="會員等級"
          >
            <Select placeholder='選擇會員級別' className='roelSelect'>
              <Select.Option value='admin'>管理員</Select.Option>
              <Select.Option value='user'>會員</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name='phoneNumber'
            label="電話號碼"
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
            label="個人圖象URL"
            rules={[
              {
                type: 'url',
                message: '請輸入網址格式'
              },
            ]}
          >
            <Input placeholder='Add your website URL' />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
            <Button className='btn-outline-warning' onClick={closeModal}>關閉</Button>
            <Button className='btn_primary' htmlType='submit' style={{ marginLeft: 10 }} disabled={isView}>確定</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}