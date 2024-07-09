import { Dispatch } from 'react';
import { UserItem, MemberAction } from './member.type';

export const MEMBER_ACTION_TYPE = {
  SET_MEMBER_DATA: 'SET_MEMBER_DATA',
  CLEAR_MEMBER_DATA: 'CLEAR_MEMBER_DATA',
  SET_LOADING: 'SET_LOADING',
};


export const setLoading = (dispatch: Dispatch<MemberAction>, isLoading: boolean) => {
  dispatch({
    type: MEMBER_ACTION_TYPE.SET_LOADING,
    payload: isLoading
  });
};

export const setItemToUserReducer = (dispatch: Dispatch<MemberAction>, userData: UserItem[]) => {
  dispatch({
    type: MEMBER_ACTION_TYPE.SET_MEMBER_DATA,
    payload: userData,
  });
};

export const addItemToUserReducer = (dispatch: Dispatch<MemberAction>, addData: UserItem, userData: UserItem[]) => {
  const newUserData = [...userData, addData];
  dispatch({
    type: MEMBER_ACTION_TYPE.SET_MEMBER_DATA,
    payload: newUserData,
  });
};


export const updateItemToUserReducer = (dispatch: Dispatch<MemberAction>, updateIndex: number, updateData: UserItem, userData: UserItem[]) => {
  const newUserData = [...userData];
  newUserData[updateIndex] = updateData;
  dispatch({
    type: MEMBER_ACTION_TYPE.SET_MEMBER_DATA,
    payload: newUserData,
  });
};


export const clearUserItemReducer = (dispatch: Dispatch<MemberAction>) => {
  dispatch({
    type: MEMBER_ACTION_TYPE.CLEAR_MEMBER_DATA,
  });
};
