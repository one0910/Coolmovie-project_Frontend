import { Divider } from 'antd'
import React from 'react'
import { MemberProvider } from './context/member.context'
import { MemberTable } from './components/Member.table';


interface MemberManagementProps {

}

export const MemberManagement: React.FC<MemberManagementProps> = ({ }) => {
  return (
    <MemberProvider>
      <Divider orientation="left" className='divider'>使用者管理列表</Divider>
      <MemberTable />
    </MemberProvider>
  );
}