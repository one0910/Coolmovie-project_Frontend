import React, { useEffect } from 'react'
import { notification, type NotificationArgsProps } from 'antd';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setAlert } from '../store/common/common.reducer';
import { WarningOutlined } from '@ant-design/icons';
type NotificationPlacement = NotificationArgsProps['placement'];
interface NotificationProps {

}

const Notification: React.FC<NotificationProps> = ({ }) => {
  const [api, contextHolder] = notification.useNotification();
  const { isAlert, alertMessage } = useAppSelector(state => state.common.alert);
  const storeDispatch = useAppDispatch()
  const openNotification = (placement: NotificationPlacement) => {
    api.info({
      message: <span>{alertMessage}</span>,
      placement,
      duration: 0,
      className: 'alert-Notification',
      icon: <WarningOutlined style={{ color: '#059213' }} />,
      onClose: () => {
        storeDispatch(setAlert({ isAlert: !isAlert, alertMessage: '' }))
      }
    });
  };
  useEffect(() => {
    if (alertMessage) {
      openNotification('bottomRight')
    }
  }, [isAlert]);
  return (
    <>
      {contextHolder}
    </>
  );
}

export default Notification