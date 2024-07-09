import React, { useEffect } from 'react'
import { notification, type NotificationArgsProps } from 'antd';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setError } from '../store/common/common.reducer';
import { WarningOutlined } from '@ant-design/icons';
type NotificationPlacement = NotificationArgsProps['placement'];
interface NotificationProps {

}

const Notification: React.FC<NotificationProps> = ({ }) => {
  const [api, contextHolder] = notification.useNotification();
  const { isError, errorMessage } = useAppSelector(state => state.common.error);
  const storeDispatch = useAppDispatch()
  const openNotification = (placement: NotificationPlacement) => {
    api.info({
      message: <span>{errorMessage}</span>,
      placement,
      // duration: 0,
      className: 'error-Notification',
      icon: <WarningOutlined style={{ color: '#fd7e14' }} />,
      onClose: () => {
        storeDispatch(setError({ isError: isError, errorMessage: '' }))
      }
    });
  };
  useEffect(() => {
    if (errorMessage) {
      openNotification('topRight')
    }
  }, [isError]);
  return (
    <>
      {contextHolder}
    </>
  );
}

export default Notification