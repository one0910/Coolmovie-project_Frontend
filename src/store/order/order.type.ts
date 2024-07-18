export interface OrderItem {
  index?: number | null
  id?: string
  _id?: string
  theater_size?: string,
  movieId?: string,
  movieName: string,
  movielevel: string,
  moviePlayDate: string,
  moviePlayTime: string,
  seatOrdered: [],
  status: string,
  price: number,
  quantity: number,
  total: number,
  payMethod: string
  createTime: string
}

export interface OrderStateType {
  orders: OrderItem[];
  isLoading: boolean
}