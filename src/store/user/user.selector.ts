import { createSelector } from 'reselect';
import { RootState } from '../store';

export const selectUsesrReducer = (state: RootState) => {
  return state.user
}