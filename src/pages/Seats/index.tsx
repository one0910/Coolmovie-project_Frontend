import React, { MutableRefObject, useState, useRef, useEffect, useContext } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { SeatList } from './components/SeatList';
import { OrderContext } from '../../store';
import { authFetch } from '../../utilities';
import { Loading, Login, PopUpWindows, MessageBox } from '../../components';
import { PopUpwindowRefType } from '../../interface';
import { ScreenCheck } from '../../components/ScreenCheck';
import styled from 'styled-components';
import io, { Socket } from "socket.io-client";
import { filterSeat } from '../../utilities';
import { useAppSelector } from '../../hooks';
import { useTranslation } from 'react-i18next';
interface SeatsProps {
}

export interface SeatsType {
	seat_id: string,
	is_booked: boolean
}

const Screen = styled.div`
	ul{
		grid-template-columns: ${(props) => (props.theme.theaterSize == "豪華廳") ? "auto auto auto 2fr auto auto auto auto auto auto auto 2fr auto auto auto auto" : ""};
		width: ${(props) => (props.theme.theaterSize == "豪華廳") ? "78%" : ""};
		@media screen and (max-width: 768px){
			width: ${(props) => (props.theme.theaterSize == "豪華廳") ? "99%" : ""};
			li{
				width: ${(props) => (props.theme.theaterSize == "豪華廳") ? "12px" : ""};
				height: ${(props) => (props.theme.theaterSize == "豪華廳") ? "12px" : ""};
				font-size:0rem
			}
		}
	}
`

const SeatIndicatorText = styled.strong<{ language: string }>`
	font-weight: normal;
	font-size: 0.8rem;
	@media screen and (max-width: 768px){
		font-size:${({ language }) => {
		if (language === 'en') {
			return '0.66rem'
		}
	}};
	}
`

const SingUpTipSamllText = styled.small<{ language: string }>`
		@media screen and (max-width: 768px){
		font-size:${({ language }) => {
		if (language === 'en') {
			return '0.8rem'
		}
	}};
	}
`

const Seats: React.FC<SeatsProps> = ({ }) => {
	const [state, dispatch] = useContext(OrderContext);
	const [isLogin, setIsLogin] = useState(false);
	const [seatsReady, setSeatsReady] = useState(false);
	const socketIoRef = useRef<Socket>()
	const socketScreenId = useRef<string>("")
	const seatRef = useRef<HTMLUListElement>(null)
	const seatNumRef = useRef<number>(0)
	const seatIndexRef = useRef<number[]>([])
	const tickNumber = Number(useParams().tickNumber)
	const [seats, setSeats] = useState<SeatsType[]>([])
	const [loading, setLoading] = useState(false)
	const [selectSeat, setSelectSeat] = useState<string[]>([]);
	const screenId = state.orderList.screenId
	const navigate = useNavigate()
	const url = process.env.REACT_APP_REMOTE_URL || "http://localhost:3000"
	const timerRef = useRef<number>(0)
	const popUpwindowRef = useRef<PopUpwindowRefType | null>(null);
	const { language } = useAppSelector(state => state.common)
	const { t } = useTranslation()
	const screenImg = (language === 'zh') ? '/images/screen2.svg' : '/images/screen_eng.svg'


	/*進入該頁時，先載入座位表*/
	useEffect(() => {
		socketIoRef.current = io(url, { transports: ['websocket'], upgrade: false });

		// 確認是否由checkpay page的上一頁進來，若是的話，先將之前已經劃位的位子清除掉
		if (state.lastPage == "/checkpay" && state.orderList.socketId) {
			socketIoRef?.current?.emit("leaveScreen", {
				socketId: state.orderList.socketId,
				screenId: state.orderList.screenId,
				leave: false
			});
		}

		(async function () {
			setLoading(true)
			try {
				let response = await authFetch.post(`api/screens/moviePlaySeats`, {
					"screenId": [screenId]
				})

				setSeats(response.data.data[0].seatsStatus);
				seatNumRef.current = response.data.data[0].seatsStatus.length
				setLoading(false)
				if (window.scrollY > 0) {
					window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
				}
			} catch (error) {
				console.log('error', error);
			}
		}());
	}, [])


	/*當一進入選位頁面時，監聽socket的頻道, 是否有其他使用者在劃位中 */
	useEffect(() => {
		(async function () {
			//先取得socketId
			socketIoRef?.current?.on("userIDChannel", (id: string) => {
				socketScreenId.current = id
				dispatch({
					type: "SET_SELECT_SEATS",
					payload: {
						socketId: id,
					},
				});
			})
			socketIoRef?.current?.emit("join_screen", screenId);
			socketIoRef?.current?.on('join_screen', async (data: string | number[]) => {
				let seatDataIndex = (data !== "訪客進來了") ? filterSeat(socketScreenId.current, data) : []
				if (seatRef.current) {
					seatDataIndex.map((i: number) => {
						const element = seatRef?.current?.childNodes[i] as HTMLElement
						if (element) {
							element.dataset.seatselect = "true";
							element.classList.add("addScreenStyle");
						}
					});
				}
			})
		}());


		// 倒數計時2分鐘，2分鐘後，跳出訊息告知操作逾時重選
		const timer = setInterval(() => {
			timerRef.current += 1;
			if (timerRef.current >= 120) {
				clearInterval(timer)
				socketIoRef?.current?.emit("leaveScreen", {
					socketId: state.orderList.socketId,
					screenId: state.orderList.screenId,
					leave: false
				});
				popUpwindowRef.current?.openModal();
			}
		}, 1000);
		return () => { clearInterval(timer); };
		// 使用seatsReady的狀態管理方式，來確保seat裡的Li DOM已渲染完成
	}, [seatsReady])


	// 監聽當位置點擊時, sokcet server回傳的的座位狀態
	useEffect(() => {
		socketIoRef?.current?.on("reurnSeatStatus", async (data: {
			screenId: string;
			[key: string]: number[] | string;
		}) => {
			// 先將所有的位置初始化
			if (seatRef.current) {
				for (let i = 0; i < seatRef.current.childNodes.length; i++) {
					const element = seatRef?.current?.childNodes[i] as HTMLElement
					if (element) {
						element.dataset.seatselect = "false";
						element.classList.remove("addScreenStyle");
					}
				}
			}

			// 再針對被選到的位置在畫面上的處理
			let filteredData = filterSeat(socketScreenId.current, data)
			filteredData.map((i: number) => {
				58
				if (seatRef.current) {
					const element = seatRef?.current?.childNodes[i] as HTMLElement
					if (element) {
						element.dataset.seatselect = "true";
						element.classList.add("addScreenStyle");
					}
				}
			});
		})

	}, [])

	// 監聽其他使用者的訂票是否完成，若是完成，則改變劃位狀態
	useEffect(() => {
		socketIoRef?.current?.on("order", async (indexData: []) => {
			indexData.map((i: number) => {
				if (seatRef.current) {
					const element = seatRef?.current?.childNodes[i] as HTMLElement
					if (element) {
						element.dataset.seatselect = "order";
						element.classList.add("addScreenStyleOrder");
					}
				}
			});
		})
	}, [])


	/*隨時監控點選的座位表位子*/
	useEffect(() => {
		dispatch({
			type: "SET_SELECT_SEATS",
			payload: {
				seat_ordered: selectSeat,
				seat_orderedIndex: seatIndexRef.current
			},
		});
		socketIoRef?.current?.emit("seatStatus", { screenId: screenId, socketId: socketScreenId.current, seatIndex: seatIndexRef.current });
	}, [selectSeat])

	// 點擊座位

	const pickSeat = (seat_id: string, selectRef: MutableRefObject<boolean>, DomRef: MutableRefObject<HTMLLIElement | null>, index: number) => {
		setSelectSeat((prevData) => {
			// 選擇座位
			if (prevData.length < tickNumber && !prevData.includes(seat_id)) {
				selectRef.current = !(selectRef.current);
				seatIndexRef.current = [...seatIndexRef.current, index]
				return [...prevData, seat_id];
				// 取消原本的座位
			} else if (prevData.includes(seat_id)) {
				selectRef.current = !(selectRef.current)
				seatIndexRef.current = seatIndexRef.current.filter((indexValue) => {
					return indexValue !== index
				});
				return prevData.filter((seat) => seat !== seat_id);
			} else if (prevData.length >= tickNumber) {
				alert(t("seats.exceeded_seat_selected"));
			}
			return prevData;
		})
	}
	const goCheckPage = () => {
		const slectSeatNums = state.orderList.seat_ordered?.length as number
		if (state.orderList.quantity - slectSeatNums == 0) {
			navigate("/checkpay")
		} else {
			alert(`${t("seats.remaining_seat_alert", { count: state.orderList.quantity - slectSeatNums })}`);
		}
	}

	let childWrapDiv = null
	if (state.orderList.status == "quick") {
		childWrapDiv = <>
			<div className='d-flex justify-content-between align-items-end'>
				<button type='button' className='btn_primary w-50 me-2 mt-3 px-0' onClick={goCheckPage}>{t("screenCheck.proceed_to_payment_btn")}</button>
				<Login setIsLogin={setIsLogin} LoingMsg={t("screenCheck.join_us_btn")} LoginStatus={"signup"} variable={"fromseats"} />
			</div>
			<div className='text-end mt-1'>
				<SingUpTipSamllText
					className='color-primary fst-italic'
					language={language}
				>
					{t("screenCheck.join_us_content")}
				</SingUpTipSamllText>
			</div>
		</>
	} else {
		childWrapDiv =
			<button type='button' className='btn_primary w-100 mt-3' onClick={goCheckPage}>{t("screenCheck.proceed_to_payment_btn")}</button>
	}

	return (
		<div className='container mb-5'>
			<Loading isActive={loading} />
			<div className='row'>
				<Screen className="col-md-8 text-center">
					{/* <p>選擇座位為<span>{`${selectSeat}`}</span></p> */}
					<img src={screenImg} className='screenImg' alt="" />
					<div className='salseStatus d-flex justify-content-center mb-3'>
						<div className='me-2 me-lg-4'>
							<span className='d-inline-block me-2 rounded-circle'></span>
							<SeatIndicatorText language={language}>{t("seats.available")}</SeatIndicatorText>
						</div>
						<div className='me-2 me-lg-4'>
							<span className='d-inline-block me-2 rounded-circle'></span>
							<SeatIndicatorText language={language}>{t("seats.selected")}</SeatIndicatorText>
						</div>
						<div className='me-2 me-lg-4'>
							<span className='d-inline-block me-2 rounded-circle'></span>
							<SeatIndicatorText language={language}>{t("seats.sold")}</SeatIndicatorText>
						</div>
						<div className='me-2 me-lg-4'>
							<span className='d-inline-block me-2 rounded-circle'></span>
							<SeatIndicatorText language={language}>{t("seats.being_selected")}</SeatIndicatorText>
						</div>
					</div>
					<ul className='theater' ref={seatRef}>
						{seats.map((seat, index) => {
							return (
								<SeatList setSeatsReady={setSeatsReady} seatNumRef={seatNumRef} key={seat.seat_id} {...seat} index={index} onClick={pickSeat} />
							)
						})}
					</ul>
				</Screen>
				<div className="col-md-4">
					<ScreenCheck>
						{childWrapDiv}
					</ScreenCheck>
				</div>
			</div>
			<PopUpWindows ref={popUpwindowRef} backgroundClose={false}>
				<Loading isActive={loading} />
				<MessageBox >
					<div className='text-center'>
						<i className="bi bi bi-alarm-fill color-primary fw-bold fs-2 me-3"></i>
						<strong className='color-primary fs-2'>{t("title_out.select_seat_timeout_tile")}</strong>
					</div>
					<div className='orderedMovieInfo mt-2 px-lg-4 py-lg-3 px-2 py-2 rounded'>
						<p>{t("title_out.select_seat_timeout_content")}</p>
					</div>
					<button className='btn_primary me-1 w-100 mt-1' onClick={() => {
						popUpwindowRef.current?.closeModal()
						// navigate('/')
						window.location.href = '/'
					}}>{t("button.ok")}</button>
				</MessageBox>
			</PopUpWindows >
		</div>
	);
}

export default Seats