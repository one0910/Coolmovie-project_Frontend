import axios from 'axios';
import store from '../store/store';
import { getEngErrMessage } from '../helper/transform.language';
const url = process.env.REACT_APP_REMOTE_URL
const authFetch = axios.create({
  baseURL: url,
});


// request 攔截封裝
authFetch.interceptors.request.use((config) => {
  const token = (localStorage.getItem("userToken")) ? (localStorage.getItem("userToken") || "") : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// response 攔截封裝
authFetch.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { language } = store.getState().common
    const message = error.response?.data?.message || error.message
    const errMessage = (language === 'zh') ? message : getEngErrMessage(message)

    console.error(`API Error: ${errMessage}`)
    if (message !== '該信箱已被註冊') {
      alert(errMessage);
    }
    if (error.response?.status === 401) {
      window.location.replace('/')
    }
    // return Promise.reject(message);
    return Promise.reject(error);
  }
);

export { authFetch };