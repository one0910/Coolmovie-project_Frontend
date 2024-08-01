import React, { useState, MutableRefObject, Dispatch, SetStateAction, useContext, useEffect } from 'react'
import { OrderContext } from '../store';
import { useForm, useWatch } from "react-hook-form"
import { authFetch } from '../utilities';
import { Loading, ErrorMsg } from './';
import { CatchErrorMessage } from '../interface';
import { AxiosResponse } from 'axios';
import { useAppDispatch } from '../hooks';
import { setUser } from '../store/user/user.reducer';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


interface LoginPropsType {
	myModal: MutableRefObject<bootstrap.Modal | null>
	setIsLogin: Dispatch<SetStateAction<boolean>>
	viewModel?: { account: string, password: string | undefined }
}

export interface SignInType {
	normal_ticket_num: any;
	useremail: string,
	password: string
	remember_me: boolean
}


export const SingIn: React.FC<LoginPropsType> = ({ myModal, setIsLogin, viewModel }) => {
	const { t } = useTranslation()
	const storeDispatch = useAppDispatch()
	const [state, dispatch] = useContext(OrderContext);
	const [errMsg, setErrMsg] = useState<string>()
	const [loading, setloading] = useState(false)
	const { register, handleSubmit, control, getValues, setValue, setError, formState: { errors } } = useForm<SignInType>({
		defaultValues: {
			remember_me: true
		}
	});
	const watchForm = useWatch({ control });
	const navigate = useNavigate()

	useEffect(() => {
		if (viewModel?.account) {
			const { account, password } = viewModel
			setValue('useremail', account);
			setValue('password', password as string);
		}
	}, [viewModel]);


	/******************登入後，將後傳回來的資料做處理*******************/
	const setDataUI = (response: AxiosResponse<any, any>) => {
		const userToken = response.data.data.token
		const userId = response.data.data.signinRes._id
		const userMail = response.data.data.signinRes.email
		const userRole = response.data.data.signinRes.role
		const userName = response.data.data.signinRes.nickName
		const quantity = (state.orderList.quantity) ? state.orderList.quantity : 1
		const price = (state.orderList.price > 0) ? (state.orderList.price) - 50 : state.orderList.price
		const googleId = (response.data.data.signinRes.googleId) ? response.data.data.signinRes.googleId : ""
		localStorage.setItem('userToken', userToken)
		storeDispatch(setUser({ token: userToken, mail: userMail, role: userRole }))

		// 監控若是有勾選"保持登入"
		if (getValues().remember_me) {
			document.cookie = "remember_me=true; path=/; SameSite=None; Secure";
		} else {
			document.cookie = "remember_me=; SameSite=None; Secure; expires=Thu, 01 Jan 1970 00:00:00 UTC";
		}

		// 登入後，將會員名稱、會員ID、會員狀態、價格重新寫入store
		dispatch({
			type: "ADD_MEMBER_DATA",
			payload: {
				memberId: userId,
				memberName: userName,
				memberMail: userMail,
				price: price,
				status: "member",
				googleId: googleId,
				role: userRole,
			}
		})

		// 登入後，總價重新寫入store
		dispatch({
			type: "SET_TOTAL_PRICE",
			payload: {
				quantity: quantity,
				total: quantity * price,
			},
		});
		myModal.current?.hide();
		setloading(false)
		setIsLogin(true)

		// 若為瀏覽模式，則使用viewmode@gmail.com登入後直接進入後台頁面
		if (viewModel?.account) {
			navigate('/admin')
		}

	}
	const loginForm = (data: SignInType) => {
		(async function () {
			try {
				setloading(true)
				const response = await authFetch.post('/api/member/signin', {
					email: data.useremail,
					password: data.password
				})
				setDataUI(response)
			} catch (error) {
				setloading(false)
				const CatchErrorMessage = error as CatchErrorMessage
				if (CatchErrorMessage.code === "ERR_NETWORK") {
					setErrMsg(t("ErroMsg.err_netowrk"))
				}

				if (CatchErrorMessage.response.status === 404) {
					const errorMessage = CatchErrorMessage.response.data?.message;
					if (errorMessage.includes('帳號不存在')) {
						setError("useremail", {
							type: "serverError",
							message: t("register.account_not_exist")
						});

					} else if (errorMessage.includes('密碼錯誤')) {
						setError("password", {
							type: "serverError",
							message: t("register.password_is_incorrect")
						});
					}
				}
			}
		}())
	}
	/*******************當按下google註冊時的按鈕*********************/
	const openGoogleLogin = () => {
		let timer: NodeJS.Timeout | null = null;
		const googleLoginURL = `${process.env.REACT_APP_REMOTE_URL}/api/google/login`;
		const newWindow = window.open(
			googleLoginURL,
			"_blank",
			"width=500,height=600"
		)
		if (newWindow) {
			timer = setInterval(() => {
				if (newWindow.closed) {
					(async function () {
						try {
							// let response = await axios.get(`${process.env.REACT_APP_REMOTE_URL}/api/google/login/success`, { withCredentials: true })
							let response = await authFetch.get('/api/google/login/success', { withCredentials: true })
							setDataUI(response)
						} catch (error) {
							console.log('error', error);
						}
					}())
					myModal.current?.hide();
					if (timer) clearInterval(timer);
				}
			}, 500);
		}
	}
	return (
		<>
			<Loading isActive={loading} />
			<div id="login-tab-content">
				<form className="login-form" onSubmit={handleSubmit(loginForm)}>
					{/* google 登入 */}
					<button type="button" className="button mt-3" onClick={openGoogleLogin} style={{ "letterSpacing": "1px" }}>
						<i className="bi bi-google me-1"></i>
						{t("register.google_login")}
					</button >
					<div className='d-flex cross-line my-2'><span>{t("or")}</span></div>

					{/* 若是為瀏覽模式是，所顯示的文字提醒 */}
					{(viewModel?.account) && <span className='valid-feedback d-inline'>{t("register.view_mode_msg")}</span>}

					{/* 帳號密碼登入 登入 */}
					<input
						type="text"
						className={`input ${errors.useremail && 'is-invalid'}`}
						id="user_login"
						autoComplete="off"
						placeholder="Email"
						{...register("useremail", {
							required: {
								value: true,
								message: t("inputPrompt.email_empty"),
							},
							pattern: {
								value: /^\S+@\S+$/i,
								message: t("inputPrompt.email_invalid"),
							},
						})}
					/>
					{errors.useremail && (
						<div className="invalid-feedback">{errors?.useremail?.message}</div>
					)}
					<input
						type="password"
						className={`input ${errors.password && 'is-invalid'}`}
						id="user_pass"
						autoComplete="off"
						placeholder="Password"
						{...register("password", {
							required: {
								value: true,
								message: t("inputPrompt.password_empty"),
							},
						})}
					/>
					{errors.password && (
						<div className="invalid-feedback">{errors?.password?.message}</div>
					)}
					<input
						type="checkbox"
						className="checkbox"
						id="remember_me"
						{...register("remember_me")}
					/>
					<label htmlFor="remember_me" className='remember_me'>{t("register.stay_login")}</label>
					<button type="submit" className="button">
						{(viewModel?.account) ? t("register.login_directly_msg") : t("register.email_login")}

					</button >
				</form>
				<div className="help-text">
				</div>
				<ErrorMsg>{errMsg}</ErrorMsg>
			</div>
		</>
	);
}