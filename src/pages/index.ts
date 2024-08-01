import { lazy } from 'react';

export const Home = lazy(() => import('./Home'));
export const Member = lazy(() => import('./Member'));
export const Movie = lazy(() => import('./Movie'));
export const Ticknumber = lazy(() => import('./Ticknumber'));
export const Seats = lazy(() => import('./Seats'));
export const CheckPay = lazy(() => import('./CheckPay'));
export const MemberInfo = lazy(() => import('./MemberInfo'));
export const MemberAccount = lazy(() => import('./MemberAccount'));
export const MemberBonus = lazy(() => import('./MemberBonus'));
export const MemberOrder = lazy(() => import('./MemberOrder'));
export const Benifet = lazy(() => import('./Benifet'));
export const AboutUs = lazy(() => import('./AboutUs'));
export const BackstageHome = lazy(() => import('./BackstagePage'));
export const DashBoard = lazy(() => import('./BackstagePage/DashBoard'));
export const MemberManagement = lazy(() => import('./BackstagePage/MemberManagement'));
export const MovieManagement = lazy(() => import('./BackstagePage/MovieManagement'));
export const OrderManagement = lazy(() => import('./BackstagePage/OrderManagement'));
export const SeatManagement = lazy(() => import('./BackstagePage/SeatManagement'));

