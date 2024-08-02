import { Divider } from 'antd'
import React from 'react'
import { MemberProvider } from './context/member.context'
import { MemberTable } from './components/Member.table';
import { useTranslation } from 'react-i18next';


interface MemberManagementProps {

}

const MemberManagement: React.FC<MemberManagementProps> = ({ }) => {
  const { t } = useTranslation()
  return (
    <MemberProvider>
      <Divider orientation="left" className='divider'>
        {t("admin_page.member_mamagement_page.usesr_management_list")}
      </Divider>
      <MemberTable />
    </MemberProvider>
  );
}

export default MemberManagement