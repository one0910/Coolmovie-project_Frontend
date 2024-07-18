import { OrderItem } from "../store/order/order.type";
import { UserItem } from "../pages/BackstagePage/MemberManagement/context/member.type";
export type CardDataType = 'getCurrentStream' | 'getOrderCount' | 'getRegisterCount' | 'getMovieCount';
export interface RTKQuery_APIError {
  data?: {
    message: string;
  };
}

export interface YearlyData {
  Month: string;
  Box: number;
  Total: number;
}

export interface RTKQuery_DataType<T> {
  data: {
    count: number;
    dataForChart: {
      [key: string]: YearlyData[];
    };
    dataForManagement: T;
  };
}

export interface RTKQuery_DataType_Order extends RTKQuery_DataType<OrderItem[]> {
}

export interface RTKQuery_DataType_User extends RTKQuery_DataType<UserItem[]> {
}

