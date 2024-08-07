import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { authFetch } from "../../utilities";
import { Loading } from "../../components";
import { HomeKv } from "./components/HomeKv";
import { HomeOrderForm } from "./components/HomeOrderForm";
import { HomeShowing } from "./components/HomeShowing";
import { HomeMovieCard } from "./components/HomeMovieCard";
import { HomeVideo } from "./components/HomeVideo";
import { HomeDiscount } from "./components/HomeDiscount";
import { HomeInvite } from "./components/HomeInvite";
import { MovieDataType } from "../../interface";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAppDispatch } from "../../hooks";
import { setViewMode } from "../../store/common/common.reducer";
import { Navigation, Pagination } from "swiper";
import 'swiper/swiper-bundle.css';


interface HomeProps { }


const Home: React.FC<HomeProps> = ({ }) => {
  const storeDispatch = useAppDispatch()
  const [loading, setLoading] = useState(false);
  const [movieReleaseData, setMovieReleaseData] = useState<MovieDataType[]>([])
  const [movieCommingData, setMovieCommingReleaseData] = useState<MovieDataType[]>([])
  const { viewmode, password } = useParams()
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    (async function () {
      (async function () {
        try {
          let response_release = await authFetch.get('api/movie/?isRelease=true')
          let response_comming = await authFetch.get('api/movie/?isRelease=false')
          setMovieReleaseData(response_release.data.data.data)
          setMovieCommingReleaseData(response_comming.data.data.data)
          // console.log('response_release', response_comming)
          setLoading(false);
        } catch (error) {
          console.log('error', error);
        }
      }())
      try {
      } catch (error) {
      }
    })();

    if (viewmode && password) {
      let viewmode = 'viewmode@gmail.com'
      storeDispatch(setViewMode({ account: viewmode, password: password }))
    }
  }, []);
  return (
    <div className="home">
      <HomeKv>
        <HomeOrderForm></HomeOrderForm>
      </HomeKv>
      <Loading isActive={loading} />
      <div className="container">
        <HomeShowing isShowing={true}>
          <div className="d-flex overflow-hidden">
            {movieReleaseData.length > 0 && (
              <Swiper
                slidesPerView={"auto"}
                // loop={true}
                spaceBetween={24}
                centeredSlides={false}
                // pagination={{
                //   type: "fraction",
                // }}
                navigation={true}
                modules={[Pagination, Navigation]}
              >
                {movieReleaseData.map((movie, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <HomeMovieCard isShowing={true} {...movie} ></HomeMovieCard>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </div>
        </HomeShowing>
        <HomeShowing isShowing={false}>
          <div className="d-flex overflow-hidden">
            <Swiper
              slidesPerView={"auto"}
              loop={true}
              spaceBetween={24}
              centeredSlides={false}
              navigation={true}
              modules={[Pagination, Navigation]}
            >
              {movieCommingData.map((movie, index) => {
                return (
                  <SwiperSlide key={index}>
                    <HomeMovieCard isShowing={false} {...movie}></HomeMovieCard>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </HomeShowing>
        <HomeVideo></HomeVideo>
      </div>
      <HomeDiscount></HomeDiscount>
      <div className="container">
        <HomeInvite></HomeInvite>
      </div>
    </div>
  );
};

export default Home