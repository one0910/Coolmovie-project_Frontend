import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import React, { useContext, Dispatch, FocusEvent, useState } from 'react'
import { useCheckEmailMutation, useCreateAccountMutation } from '../../../../services/memberService';
import { MemberContext } from '../context/member.context';
import { Loading } from '../../../../components';
import dayjs from 'dayjs';
import { UserItem } from '../context/member.type';
import { CatchErrorMessage } from '../../../../interface';

interface MemberCreateTableModalProps {
  modalOpen: {
    createNewModalOpen: boolean
    setCreateNewModalOpen: Dispatch<React.SetStateAction<boolean>>
  }
}

export const MemberCreateTableModal: React.FC<MemberCreateTableModalProps> = ({ modalOpen }) => {
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
        title='新增使用者'
        open={createNewModalOpen}
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
          autoComplete='off'
          onFinish={submitHandle}
          initialValues={{
            role: 'user',
          }}
        >
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
            hasFeedback
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
            label="密碼"
            rules={[
              {
                required: true,
                message: '需要輸入密碼'
              },
              { min: 5 },
            ]}
            hasFeedback
          >
            <Input.Password placeholder='請輸入密碼' />
          </Form.Item>
          <Form.Item
            name='confirmPassowrd'
            label="密碼確認"
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
                  return Promise.reject('密碼輸入不一致，請再確認輸入的密碼')
                }
              })
            ]}
            hasFeedback
          >
            <Input.Password placeholder='Confirm Your Password' />
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
            rules={[
              {
                required: true,
                message: '請選擇會員等級'
              },
            ]}
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
            <Button className='btn_primary' htmlType='submit' style={{ marginLeft: 10 }}>確定</Button>
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
}