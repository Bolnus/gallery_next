import { configureStore } from "@reduxjs/toolkit";
import { albumsListSlice } from "../../../entities/albumsList/model/albumsListSlice";
import { albumSlice } from "../../../entities/album/model/albumSlice";
import { useDispatch, useSelector } from "react-redux";

// const reducers = combineReducers(reducersObject);
const storeOptions = {
  reducer: {
    albumsList: albumsListSlice.reducer,
    album: albumSlice.reducer
  }
};

export function generateStore() {
  return configureStore(storeOptions);
}

// type ActionTypes = TasksActions | TaskListActions | AuthActions | GalleryActions;
export type AppStore = ReturnType<typeof generateStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type SliceActions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer A ? A : never;
}[keyof T];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useTypedSelector = useSelector.withTypes<RootState>();
