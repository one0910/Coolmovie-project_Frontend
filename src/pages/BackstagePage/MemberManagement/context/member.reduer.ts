import { MEMBER_ACTION_TYPE } from './member.action';
import { MemberState, MemberAction } from './member.type';

export const INITIAL_STATE: MemberState = {
  userItems: [],
  isLoading: true,
};

export const memberReducer = (state: MemberState, action: MemberAction): MemberState => {
  const { type, payload } = action;

  switch (type) {
    case MEMBER_ACTION_TYPE.SET_MEMBER_DATA:
      return { ...state, isLoading: false, userItems: payload || [] };
    case MEMBER_ACTION_TYPE.SET_LOADING:
      return { ...state, isLoading: true };
    case MEMBER_ACTION_TYPE.CLEAR_MEMBER_DATA:
      return { ...state, userItems: [] };
    default:
      throw new Error(`unhandled type of ${type} in memberReducer`);
  }
};