import React, { useContext, useEffect, useState } from 'react'
import { useGetUserDataQuery, useDeleteUserDataMutation } from '../../../../services/memberService';
import { MemberContext } from '../context/member.context';
import { UserItem } from '../context/member.type';
import { Avatar, Button, Flex, Modal, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { converDateFormat } from '../../../../utilities';
import { useAppSelector } from '../../../../hooks';
import { MemberEditTableModal } from './MemberEditTable.modal';
import { MemberCreateTableModal } from './MemberCreateTable.modal';



interface MemberTableProps {

}

export const MemberTable: React.FC<MemberTableProps> = ({ }) => {
  const { data, error, isLoading } = useGetUserDataQuery({ parameter: 'dataForManagement', daterange: 'all' })
  const { setItemToProvider, userItems, setLoadingToProvider } = useContext(MemberContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({ current: 1, pageSize: 10 });
  const [createNewModalOpen, setCreateNewModalOpen] = useState(false)
  const [index, setIndex] = useState<number | null>(null)
  const [deleteUserData] = useDeleteUserDataMutation()
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
      title: '確定要刪除此筆資料會員資料嗎 ?',
      okText: '確定',
      cancelText: '取消',
      className: 'confirmModal',
      onOk: async () => {
        setLoadingToProvider()
        const { data } = await deleteUserData(record._id).unwrap()
        setItemToProvider(data as UserItem[]);
      },
      okButtonProps: {
        style: { backgroundColor: '#E7C673', color: '#393A3A' },
      },
      cancelButtonProps: {
        className: 'btn-outline-warning',
      },
    })
  }

  const columns = [
    {
      key: '1',
      title: 'ID',
      dataIndex: '_id',
      width: 200,
      ellipsis: true
    },
    {
      key: '2',
      title: 'Profile',
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
      title: 'Name',
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
      title: 'Birthday',
      dataIndex: 'birthday',
      render: (record: string) => {
        let brithDate = (record) ? converDateFormat(record) : ''
        return brithDate
      }
    },
    {
      key: '6',
      title: 'Role',
      dataIndex: 'role',
      width: 160,
      render: (role: string, record: UserItem) => {
        let color = (role === 'admin') ? 'magenta' : 'green'
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
      title: 'Phone Number',
      dataIndex: 'phoneNumber'
    },
    {
      key: '8',
      title: 'Action',
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
