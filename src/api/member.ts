import { authFetch } from '../utilities/authFetch'
import { I_MEMBER, I_ChangePassword } from '../interface'

export const getMember = async () => {
    return await authFetch.get(`/api/member/getUser`);
}


export const checkAdminToken = async () => {
    return await authFetch.get(`/api/member/checkToken`);
}

export const updateMember = async ({
    nickName,
    phoneNumber,
    birthday,
    profilePic,
    role
}: I_MEMBER) => {
    return await authFetch.post(`/api/member/updateUser`, {
        nickName,
        phoneNumber,
        birthday,
        profilePic,
        role
    });
}

export const changePassword = async ({
    password,
    confirmPassword
}: I_ChangePassword) => {
    return await authFetch.post(`/api/member/changePassword`, {
        password,
        confirmPassword
    });
}