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

export interface RTKQuery_DataType {
  data: {
    count: number;
    dataForChart: {
      [key: string]: YearlyData[];
    };
    dataForManagement: UserItem[];
  };
}

export interface UserItem {
  __v: number;
  _id: string;
  createdAt: string;
  email: string;
  nickName: string;
  profilePic: string;
  role: string;
  updatedAt: string;
  birthday?: string;
  phoneNumber?: string;
}