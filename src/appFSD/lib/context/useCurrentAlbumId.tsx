"use client";
import React from "react";
import { SearchContext } from "./searchContext";

export function useCurrentAlbumId() {
  const { currentAlbumId } = React.useContext(SearchContext);
  return currentAlbumId;
}
