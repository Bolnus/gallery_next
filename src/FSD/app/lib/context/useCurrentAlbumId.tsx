"use client";
import React from "react";
import { SearchContext } from "./searchContext";

export function useCurrentAlbumId(): [string, React.Dispatch<React.SetStateAction<string>>] {
  const { currentAlbumId } = React.useContext(SearchContext);
  return currentAlbumId;
}
