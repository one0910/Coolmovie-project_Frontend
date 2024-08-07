import React, { useState, useRef, useEffect, Dispatch } from 'react'
import * as bootstrap from 'bootstrap';
import { SingIn, SignUp } from './';
import styled, { css } from 'styled-components';
import { useAppSelector } from '../hooks';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const customerizedLoginBtn = ({ LoingMsg, Pathname, variable }: { variable?: string, LoingMsg: string, Pathname: string }) => {
	const path = Pathname.match(/^\/([^\/]+)/)
	if (path && path[1] === 'ticknumber' && (LoingMsg === "加入會員" || LoingMsg === "Join Now")) {
		return css`
      background-color: #E7C673;
			padding: 6px 11px;
    `;
	} else if (path && path[1] === 'chooseSeates' && (LoingMsg === "加入會員" || LoingMsg === "Join Now")) {
		return css`
      background-color: #E7C673;
			padding: 7px 11px;
			@media screen and (max-width: 768px){
				font-size: 1rem !important;
			}
    `;
	}
	else {
		return css`
      background-color: transparent;
    `;
	}

};

const LoingBtn = styled.button<{ LoingMsg: string, variable?: string, Pathname?: string }>`
	${({ LoingMsg, Pathname = '', variable }) => customerizedLoginBtn({ LoingMsg, Pathname, variable })}
	width:${({ variable }) => (variable === "fromseats") ? "50%" : "auto"};
	color:${({ LoingMsg }) => (LoingMsg === "加入會員" || LoingMsg === "Join Now") ? "#000" : "#E7C673"};
	border: 1px solid #E7C673;
	&:hover{
		background-color: #E7C673;
	}
	&:focus{
		background-color: transparent;
		color: #E7C673;
		box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.5);
	}
	@media screen and (max-width: 768px){
		padding:${({ variable }) => (variable === "fromseats") ? "7px 11px" : "4px 8px"};
		font-size: .85rem;
		width:${({ LoingMsg, Pathname }) => {
		if (Pathname === '/ticknumber' && LoingMsg === "Join Now") {
			return "37%"
		}
	}}
	}
`;
interface LoginProps {
	isLogin?: boolean
	setIsLogin: Dispatch<React.SetStateAction<boolean>>
	LoingMsg: string
	LoginStatus: string
	variable?: string
};

export const Login: React.FC<LoginProps> = ({ variable, LoginStatus, LoingMsg, setIsLogin }) => {
	const { t } = useTranslation()
	const [currentTab, setCurrentTab] = useState(LoginStatus)
	const modalRef = useRef<HTMLDivElement | null>(null);
	const myModal = useRef<bootstrap.Modal | null>(null);
	let zIndex = (LoginStatus === "login") ? 1035 : 9999;
	const { account, password } = useAppSelector(state => state.common.viewMode)
	const { pathname } = useLocation()

	let openModal = () => {
		myModal?.current?.show()
	}
	useEffect(() => {
		myModal.current = new bootstrap.Modal(modalRef.current as HTMLElement);
	}, []);

	useEffect(() => {
		/*判斷是否為瀏覽模式的方式 (帳號/密碼是否存在store裡，然後只在指定頁面開啟登入modal)*/
		if (account && password && pathname === '/viewmode/a123456789') {
			myModal?.current?.show()
		}
	}, [account])
	return (
		<>
			<LoingBtn
				type="button"
				className="btn text-truncate"
				onClick={openModal}
				LoingMsg={LoingMsg}
				variable={variable}
				Pathname={pathname}>
				{LoingMsg}
			</LoingBtn>
			<div className="modal fade" id="staticBackdrop" data-bs-keyboard="false" tabIndex={-1} ref={modalRef} style={{ zIndex: zIndex }}>
				<div className="modal-dialog">
					<div className="modal-content modelWrap">
						<div className="modal-body">
							<div className="form-wrap">
								<i className="bi bi-x" data-bs-dismiss="modal"></i>
								<div className="tabs">
									<h6 className="login-tab">
										<button
											type='button'
											onClick={() => setCurrentTab('login')}
											style={{ "backgroundColor": (currentTab === "login") ? "#E7C673" : " rgba(55, 55, 55, 0)" }}>
											{t("register.login")}
										</button>
									</h6>
									<h6 className="signup-tab">
										<button
											type='button'
											onClick={() => setCurrentTab('signup')}
											style={{ "backgroundColor": (currentTab === "signup") ? "#E7C673" : "rgba(55, 55, 55, 0)" }}>
											{t("register.signup")}
										</button>
									</h6>
								</div>
								<div className="tabs-content">
									{currentTab === 'login' ? (
										<SingIn myModal={myModal} setIsLogin={setIsLogin} viewModel={{ account, password }} />
									) : (
										<SignUp myModal={myModal} setIsLogin={setIsLogin} />
									)
									}
								</div>
								{/* <button type="button" className="btn-close" data-bs-dismiss="modal"></button> */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>)
}