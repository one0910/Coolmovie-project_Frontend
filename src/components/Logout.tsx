import React, { useContext, Dispatch, SetStateAction } from 'react'
import { OrderContext } from '../store'
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../utilities';
import { setAlert } from '../store/common/common.reducer';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { orderApi } from '../services/orderService';
import { userLogout } from '../store/user/user.action';
import { useTranslation } from 'react-i18next';

const LogoutBtn = styled.button`
	@media screen and (max-width: 768px){
		font-size: .85rem;;
		padding: 4px 6px !important; 
		margin-right:0px !important
	}
`;

interface LogoutProps {
	isLogin: boolean
	setIsLogin: Dispatch<SetStateAction<boolean>>
}

export const Logout: React.FC<LogoutProps> = ({ isLogin, setIsLogin }) => {
	const { t } = useTranslation();
	const storeDispatch = useAppDispatch()
	const [state, dispatch] = useContext(OrderContext);
	const navigate = useNavigate()
	const { isAlert } = useAppSelector(state => state.common.alert);

	const clickHandler = () => {
		localStorage.removeItem("userToken")
		document.cookie = "remember_me=; path=/; SameSite=None; Secure; expires=Thu, 01 Jan 1970 00:00:00 UTC";
		// storeDispatch(setUser({ token: '', mail: '' }))
		storeDispatch(userLogout())
		storeDispatch(orderApi.util.resetApiState())
		authFetch.get('/api/google/logout')
		setIsLogin(false)
		storeDispatch(setAlert({ isAlert: !isAlert, alertMessage: '' }))
		if (isLogin || state.orderList.status === "member") {
			dispatch({
				type: "CLEAR_ORDER",
				payload: {
					memberId: null,
					status: "quick",
					memberName: "",
					role: "",
				}
			})
			navigate("/")
		}

	}
	return (
		<LogoutBtn className="btn btn-outline-warning me-2 text-truncate" type="button" onClick={clickHandler}>
			{t("register.logout")}
		</LogoutBtn>
	);
}