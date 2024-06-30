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
  };
}