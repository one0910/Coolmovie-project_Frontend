import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { GoogleLoginComplete } from "./components/GoogleLoginComplete";
import { CheckComplete } from "./pages/CheckPay/CheckComplete";
import { CheckFail } from "./pages/CheckPay/CheckFail";
import { Loading } from "./components";
import { Suspense } from "react";
import {
  Home,
  Member,
  Movie,
  Seats,
  Ticknumber, MemberInfo,
  CheckPay,
  MemberAccount,
  MemberBonus,
  MemberOrder,
  Benifet,
  AboutUs,
  BackstageHome,
  DashBoard,
  MovieManagement,
  SeatManagement,
  MemberManagement,
  OrderManagement,
} from "./pages"


const routes: RouteObject[] = [
  {
    path: "/",
    element: <Suspense fallback={<Loading isActive={true} />}><Home /></Suspense>,
    children: [
      {
        path: ":viewmode/:password",
        element: <Suspense fallback={<Loading isActive={true} />}><Home /></Suspense>,
      }
    ]
  },
  {
    path: "/member",
    element: <Suspense fallback={<Loading isActive={true} />}><Member /></Suspense>,
    children: [
      {
        path: "",
        element: <Suspense fallback={<Loading isActive={true} />}><MemberInfo /></Suspense>,
      },
      {
        path: "account",
        element: <Suspense fallback={<Loading isActive={true} />}><MemberAccount /></Suspense>,
      },
      {
        path: "bonus",
        element: <Suspense fallback={<Loading isActive={true} />}><MemberBonus /></Suspense>,
      },
      {
        path: "order",
        element: <Suspense fallback={<Loading isActive={true} />}><MemberOrder /></Suspense>,
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ]
  },
  {
    path: "/movie/:id/:isRelease",
    element: <Suspense fallback={<Loading isActive={true} />}><Movie /></Suspense>,
  },
  {
    path: "/ticknumber",
    element: <Suspense fallback={<Loading isActive={true} />}><Ticknumber /></Suspense>,
  },
  {
    path: "/benifet",
    element: <Suspense fallback={<Loading isActive={true} />}><Benifet /></Suspense>,
  },
  {
    path: "/aboutus",
    element: <Suspense fallback={<Loading isActive={true} />}><AboutUs /></Suspense>,
  },
  {
    path: "/chooseSeates/:tickNumber",
    element: <Suspense fallback={<Loading isActive={true} />}><Seats /></Suspense>,
  },
  {
    path: "/checkpay",
    element: <Suspense fallback={<Loading isActive={true} />}><CheckPay /></Suspense>,
  },
  {
    path: "/checkcomplete/:orderId",
    element: <Suspense fallback={<Loading isActive={true} />}><CheckComplete /></Suspense>,
  },
  {
    path: "/checkfail",
    element: <CheckFail />,
  },
  {
    path: "/googleLogin/success",
    element: <GoogleLoginComplete />,
  },
  {
    path: "/googleLogin/error",
    element: <GoogleLoginComplete />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
  {
    path: "/admin",
    element: <Suspense fallback={<Loading isActive={true} />}><BackstageHome /></Suspense>,
    children: [
      {
        index: true,
        element: <Suspense fallback={<Loading isActive={true} />}><DashBoard /></Suspense>,
      },
      {
        path: 'movieMamagment',
        element: <Suspense fallback={<Loading isActive={true} />}><MovieManagement /></Suspense>,
      },
      {
        path: 'seatManagement',
        element: <Suspense fallback={<Loading isActive={true} />}><SeatManagement /></Suspense>,
      },
      {
        path: 'memberManagement',
        element: <Suspense fallback={<Loading isActive={true} />}><MemberManagement /></Suspense>,
      },
      {
        path: 'orderManagement',
        element: <Suspense fallback={<Loading isActive={true} />}><OrderManagement /></Suspense>,
      },
    ]
  }
];

export default routes;