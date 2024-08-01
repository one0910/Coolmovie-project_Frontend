import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { transMoviePosterImg, transMovieTitleName } from "../../../helper/transform.language";
import { useAppSelector } from "../../../hooks";
import styled from 'styled-components';
import { transLevelData } from "../../../helper/transform.language";

const SliderBtn = styled.button<{ Language: string, isMoblieScreen: boolean }>`
    width: ${({ Language, isMoblieScreen }) => {
    if (Language === 'en' && !isMoblieScreen) {
      return '60%'
    } else if (Language === 'en' && isMoblieScreen)
      return '85%'
  }} ;
`
const CardImgContainer = styled.div<{ movieLevel: { level: string, color: string } }>`
  &.homeMovieCard-img::before{
    content:"${({ movieLevel }) => movieLevel.level}";;
		color: ${({ movieLevel }) => movieLevel.color};
		border: 2px solid ${({ movieLevel }) => movieLevel.color}  ;
  }
`

interface HomeMovieCard {
  isShowing?: boolean;
}

export const HomeMovieCard: React.FC<any> = (props) => {
  const { isShowing, name, releaseData, _id, level } = props
  const { t } = useTranslation()
  const date = new Date(releaseData);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}/${month}/${day}`;
  const { language, isMoblieScreen } = useAppSelector(state => state.common)
  const movieName = transMovieTitleName(language, name)
  const movieLevel = transLevelData(language, level)
  const imgs = transMoviePosterImg(language, name, props.imgs)
  return (
    <div className="homeMovieCard homeMovieCard-showing">
      <Link to={`/movie/${_id}/${isShowing}`}>
        <SliderBtn className="homeMovieCard-order" Language={language} isMoblieScreen={isMoblieScreen}>{(isShowing) ? t("movie.online_ticketing") : t("movie.coming_soon")}</SliderBtn>
        <CardImgContainer
          className="homeMovieCard-img overflow-hidden"
          movieLevel={movieLevel}
        >
          <img src={imgs?.[0]} />
        </CardImgContainer>
        <div className="homeMovieCard-content">
          <p className="homeMovieCard-title text-truncate">{movieName}</p>
          <p className="homeMovieCard-time d-flex justify-content-between align-items-center">
            <span className="text-truncate">{t('movie.release_date')}:</span>
            <span>{formattedDate}</span>
          </p>
        </div>
      </Link>
    </div>
  );
};
