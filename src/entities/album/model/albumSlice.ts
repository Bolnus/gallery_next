import { PayloadAction, ThunkAction, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { AlbumState, ChangesSaveState } from "./albumTypes";

const initialState: AlbumState = {
  currentAlbumId: ""
};

export const albumSlice = createSlice({
  name: "Album",
  initialState,
  reducers: {
    setCurrentAlbumId(state, action: PayloadAction<string>) {
      state.currentAlbumId = action.payload;
    }
  }
});

export const { setCurrentAlbumId } = albumSlice.actions;
