export interface UserItem {
  index?: number | null
  _id: string;
  createdAt: string;
  email: string;
  nickName: string;
  profilePic: string;
  role: string;
  updatedAt: string;
  birthday?: string;
  phoneNumber?: string
  googleId?: string
}

export interface MemberContextType {
  userItems: UserItem[];
  isLoading: boolean;
  setItemToProvider: (data: UserItem[]) => void;
  addItemToProvider: (data: UserItem) => void;
  updateItemToProvider: (updateIndex: number, updateData: UserItem) => void;
  clearUserItem: () => void;
  setLoadingToProvider: (isLoading: boolean) => void;
}

export interface MemberState {
  userItems: UserItem[];
  isLoading: boolean;
}

export interface MemberAction {
  type: string;
  payload?: UserItem[] | boolean
}
