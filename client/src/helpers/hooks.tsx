import { ActionCreatorsMapObject, bindActionCreators } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/store/store.types';

export const useAppDispatch = useDispatch<AppDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useActionCreators = (actions: ActionCreatorsMapObject) => {
  const dispatch = useAppDispatch();

  return useMemo(() => bindActionCreators(actions, dispatch), [actions, dispatch]);
};
