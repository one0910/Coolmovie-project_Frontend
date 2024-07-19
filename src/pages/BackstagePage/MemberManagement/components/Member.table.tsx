import React, { useContext, useEffect, useState } from 'react'
import { useGetUserDataQuery, useDeleteUserDataMutation } from '../../../../services/memberService';
import { MemberContext } from '../context/member.context';
import { OrderContext } from '../../../../store';
import { UserItem } from '../context/member.type';
import { Avatar, Button, Flex, Modal, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { converDateFormat } from '../../../../utilities';
import { MemberEditTableModal } from './MemberEditTable.modal';
import { MemberCreateTableModal } from './MemberCreateTable.modal';
import { CatchErrorMessage } from '../../../../interface';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { setError } from '../../../../store/common/common.reducer';

const getColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'magenta';
    case 'user':
      return 'green';
    case 'view':
      return 'geekblue';
    default:
      return 'lime';
  }
}

export const MemberTable: React.FC = () => {
  const [state, dispatch] = useContext(OrderContext);
  const { data, error, isLoading } = useGetUserDataQuery({ parameter: 'dataForManagement', daterange: 'all' })
  const { isError } = useAppSelector(state => state.common.error)
  const storeDispatch = useAppDispatch()
  const { setItemToProvider, userItems, setLoadingToProvider } = useContext(MemberContext)
  const [deleteUserData] = useDeleteUserDataMutation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({ current: 1, pageSize: 10 });
  const [createNewModalOpen, setCreateNewModalOpen] = useState(false)
  const [index, setIndex] = useState<number | null>(null)
  const userRole = (state.orderList.role) ? state.orderList.role : ''
  const confirmTipText = (userRole === 'view') ? '(此為瀏覽模式，無法刪除)' : ''
  const isView = (userRole === 'view') ? true : false

  useEffect(() => {
    const userData = data?.data.dataForManagement.map((user: UserItem) => ({
      ...user,
      profilePic: user.profilePic ? user.profilePic : `https://api.dicebear.com/7.x/miniavs/svg?seed=${user._id}`
    }));
    setItemToProvider(userData as UserItem[]);
  }, [data])

  const isMoblieScreen = useAppSelector(state => state.common.isMoblieScreen);

  const openEditModal = (index: number) => {
    const userItemIndex = (pagination.current > 1) ?
      (pagination.current - 1) * (pagination.pageSize + index) : index
    setIsModalOpen(true);
    setIndex(userItemIndex)
  };

  const onenDleteModal = (record: UserItem) => {
    Modal.confirm({
      title: <span>確定要刪除此筆資料會員資料嗎 ? <span style={{ color: '#aaa', fontSize: '12px' }}>{confirmTipText}</span></span>,
      okText: '確定',
      cancelText: '取消',
      className: 'confirmModal',
      onOk: async () => {
        try {
          setLoadingToProvider(true)
          const { data } = await deleteUserData(record._id).unwrap()
          setItemToProvider(data as UserItem[]);
        } catch (error) {
          const catchError = error as CatchErrorMessage
          console.log('catchError => ', catchError.data?.message)
          setLoadingToProvider(false)
          storeDispatch(setError({ isError: !isError, errorMessage: `${catchError.data?.message}` }))
        }
      },
      okButtonProps: {
        disabled: isView,
        className: 'btn_primary'
      },
      cancelButtonProps: {
        className: 'btn-outline-warning',
      },
    })
  }

  const columns = [
    {
      key: '1',
      title: 'ID編號',
      dataIndex: '_id',
      width: 200,
      ellipsis: true
    },
    {
      key: '2',
      title: '圖像',
      dataIndex: 'profilePic',
      width: 80,
      ellipsis: {
        showTitle: true,
      },
      render: (link: string) => {
        return <Avatar src={link} />
      }
    },
    {
      key: '3',
      title: '名稱',
      dataIndex: 'nickName'
    },
    {
      key: '4',
      title: 'Email',
      dataIndex: 'email',
      width: 250,
    },
    {
      key: '5',
      title: '生日',
      dataIndex: 'birthday',
      render: (record: string) => {
        let brithDate = (record) ? converDateFormat(record) : ''
        return brithDate
      }
    },
    {
      key: '6',
      title: '級別',
      dataIndex: 'role',
      width: 160,
      render: (role: string, record: UserItem) => {
        const color = getColor(role)
        return (
          <>
            <Tag color={color} key={record._id}>{role.toUpperCase()}</Tag>
            {record.googleId && <Tag color={'gold'} key={record.googleId}>GOOGLE</Tag>}
          </>
        )
      }
    },
    {
      key: '7',
      title: '電話號碼',
      dataIndex: 'phoneNumber'
    },
    {
      key: '8',
      title: '執行',
      fixed: 'right' as const,
      render: (text: UserItem, record: UserItem, index: number) => {
        return <>
          <EditOutlined
            style={{ color: '#E7C673', fontSize: 16 }}
            onClick={() => { openEditModal(index) }}

          />
          <DeleteOutlined
            style={{ color: '#fd8686', fontSize: 16, marginLeft: 12 }}
            onClick={() => { onenDleteModal(record) }}
          />
        </>
      }
    },
  ]

  return (
    <>
      <Flex justify={'end'} style={{ marginBottom: 16 }}>
        <Button className='btn_primary' onClick={() => setCreateNewModalOpen(true)}>新增使用者</Button>
      </Flex>
      <Flex vertical justify='start'>
        <Table
          rowKey={'_id'}
          className='memberTable'
          columns={columns}
          dataSource={userItems}
          scroll={{ x: isMoblieScreen ? 'max-content' : '100%' }}
          pagination={{
            position: ['bottomLeft'],
            pageSize: pagination.pageSize,
          }}
          loading={isLoading}
          onChange={(pagination) => {
            setPagination({
              current: pagination.current || 1,
              pageSize: pagination.pageSize || 10,
            });
          }}
        >
        </Table>
        {/* <MemberEditTablemodal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} index={index} /> */}
        <MemberEditTableModal
          modalOpen={{ isModalOpen, setIsModalOpen }}
          index={index} />
        <MemberCreateTableModal
          modalOpen={{ createNewModalOpen, setCreateNewModalOpen }}
        />
      </Flex>
    </>
  );
}
