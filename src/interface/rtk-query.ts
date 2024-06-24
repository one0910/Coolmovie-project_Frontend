export type CardDataType = 'getCurrentStream' | 'getOrderCount' | 'getRegisterCount' | 'getMovieCount';
export interface RTKQuery_APIError {
  data?: {
    message: string;
  };
}

export interface RTKQuery_DataType {
  data: {
    count: number;
  };
}