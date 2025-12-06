"use client";
import React from "react";

export const SearchContext = React.createContext<{
  searchName: [string, React.Dispatch<React.SetStateAction<string>>];
  currentAlbumId: [string, React.Dispatch<React.SetStateAction<string>>];
}>({
  searchName: ["", () => ""],
  currentAlbumId: ["", () => ""]
});

export function SearchProvider({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {
  const [searchName, setSearchName] = React.useState("");
  const [currentAlbumId, setCurrentAlbumId] = React.useState("");

  return (
    <SearchContext.Provider
      value={{
        searchName: [searchName, setSearchName],
        currentAlbumId: [currentAlbumId, setCurrentAlbumId]
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
