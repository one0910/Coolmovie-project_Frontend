import React, { createContext, useReducer, ReactNode } from 'react';
import { memberReducer, INITIAL_STATE } from './member.reduer';
import { MemberContextType, UserItem } from './member.type';
import { setItemToUserReducer, clearUserItemReducer, updateItemToUserReducer, setLoading, addItemToUserReducer } from './member.action';

export const MemberContext = createContext<MemberContextType>({
  userItems: [],
  isLoading: false,
  setItemToProvider: () => { },
  updateItemToProvider: () => { },
  clearUserItem: () => { },
  setLoadingToProvider: () => { },
  addItemToProvider: () => { }
});

interface MemberProviderProps {
  children: ReactNode;
}

export const MemberProvider: React.FC<MemberProviderProps> = ({ children }) => {
  const [{ userItems, isLoading }, dispatch] = useReducer(memberReducer, INITIAL_STATE);

  const value = {
    userItems,
    setItemToProvider: (userData: UserItem[]) => setItemToUserReducer(dispatch, userData),
    addItemToProvider: (addData: UserItem) => addItemToUserReducer(dispatch, addData, userItems),
    updateItemToProvider: (updateIndex: number, updatData: UserItem) => updateItemToUserReducer(dispatch, updateIndex, updatData, userItems),
    clearUserItem: () => clearUserItemReducer(dispatch),
    setLoadingToProvider: () => setLoading(dispatch),
    isLoading,
  };

  return (
    <MemberContext.Provider value={value}>{children}</MemberContext.Provider>
  );
};
