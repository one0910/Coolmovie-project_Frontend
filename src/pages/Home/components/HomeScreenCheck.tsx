import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { SeatsType } from '../../Seats';
import { authFetch } from '../../../utilities';
import { SeatList } from '../../Seats/components/SeatList';
import { Loading } from '../../../components';
import { useTranslation } from 'react-i18next';
import { transTheaterSize } from '../../../helper/transform.language';
import { useAppSelector } from '../../../hooks';
interface HomeScreenCheckProps {
	screenDataRef?: {
		screenId: string,
		movieName: string,
		screenTime: string,
	}
}
const TextContainer = styled.div`
@media screen and (max-width: 768px){
	/* min-width: 63%; */
	p {
		font-size:10px
	}
}
`;


const Screen = styled.div<{ language: string }>`
	ul{
		grid-template-columns: ${(props) => (props.theme.theaterSize === transTheaterSize(props.language, "豪華廳")) ? "auto auto auto 2fr auto auto auto auto auto auto auto 2fr auto auto auto auto" : ""};
		width: ${(props) => {
		return (props.theme.theaterSize == transTheaterSize(props.language, "豪華廳")) ? "90%" : "60%"
	}};
		@media screen and (max-width: 768px){
			width: ${({ theme, language }) => (theme.theaterSize == transTheaterSize(language, "豪華廳")) ? "99%" : "93%"};
			li{
				width: ${({ theme, language }) => (theme.theaterSize == transTheaterSize(language, "豪華廳")) ? "12px" : ""};
				height: ${({ theme, language }) => (theme.theaterSize == transTheaterSize(language, "豪華廳")) ? "12px" : ""};
				font-size:0rem
			}
		}
	}
`

export const HomeScreenCheck: React.FC<HomeScreenCheckProps> = ({ screenDataRef }) => {
	const { t } = useTranslation()
	const [isLogin, setIsLogin] = useState(false);
	const [seats, setSeats] = useState<SeatsType[]>([])
	const [loading, setLoading] = useState(false)
	const { language } = useAppSelector(state => state.common)
	const screenImg = (language === 'zh') ? '/images/screen2.svg' : '/images/screen_eng.svg'
	useEffect(() => {
		(async function () {
			setLoading(true)
			try {
				if (screenDataRef?.screenId) {
					let response = await authFetch.post(`api/screens/moviePlaySeats`, {
						"screenId": [screenDataRef?.screenId]
					})
					setSeats(response.data.data[0].seatsStatus);
					setLoading(false)
				}

			} catch (error) {
				console.log('error', error);
			}
		}());
	}, [screenDataRef?.screenId])

	return (
		<>
			<Screen className='text-center' language={language}>
				<Loading isActive={loading} />
				<img src={screenImg} className='screenImg' alt="" />
				<div className='salseStatus d-flex justify-content-center align-items-center mb-3'>
					<TextContainer className='d-flex flex-column-reverse align-items-center align-items-md-start me-4 bg-2nd rounded-2 text-color p-2' style={{ fontSize: '.8rem' }}>
						<p className='m-0'>{screenDataRef?.screenTime}</p>
						<p className='mb-1'>{screenDataRef?.movieName}</p>
					</TextContainer>
					<div className='me-2 me-lg-4'><span className='d-inline-block me-2 rounded-circle' style={{ background: "rgba(185, 182, 182, 0.24)" }}></span><strong>{t("seats.available")}</strong></div>
					<div className='me-2 me-lg-4'><span className='d-inline-block me-2 rounded-circle' style={{ background: "rgb(72, 0, 0)" }}></span><strong>{t("seats.sold")}</strong></div>
				</div>
				<ul className='theater'>
					{seats.map((seat, index) => {
						return (
							<SeatList key={seat.seat_id} {...seat} index={index} />
						)
					})}
				</ul>
			</Screen>
		</>
	)
}