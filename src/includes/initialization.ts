import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import store from '../store/store';
import { setIsMobileScreen, setLanguage } from '../store/common/common.reducer';


/*在這裡做一個應用程序初始化的hook*/
export const useInitialization = () => {
  const { t, i18n } = useTranslation();
  const handleMediaQueryChange = (event: MediaQueryListEvent) => {
    store.dispatch(setIsMobileScreen(event.matches));
  };
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng).then(() => {
      store.dispatch(setLanguage(lng));
    })
  };

  /*用來監測螢幕的尺寸是否為手機尺寸*/
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [])

  /*用來監測瀏覽網頁者目前的地理位置，用以調整語系*/
  useEffect(() => {
    const getUserLocationAndSetLanguage = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
        const country = response.data.country;
        // const country = "" as string;

        switch (country) {
          case 'TW':
          case 'CN':
            changeLanguage('zh');
            store.dispatch(setLanguage('zh'));
            break;
          default:
            changeLanguage('en');
            store.dispatch(setLanguage('en'));
            break;
        }
        document.title = t("title.document_title")
      } catch (error) {
        changeLanguage('en');
        store.dispatch(setLanguage('en'));
      }
    };
    getUserLocationAndSetLanguage();
  }, [i18n]);
};
