"use client";
import React from "react";

const SearchNameContext = React.createContext<[string, React.Dispatch<React.SetStateAction<string>>]>(["", () => ""]);

export function SearchNameProvider({ children }: { children: React.ReactNode }) {
  const [searchName, setSearchName] = React.useState("");

  return <SearchNameContext.Provider value={[searchName, setSearchName]}>{children}</SearchNameContext.Provider>;
}

export function useSearchName() {
  return React.useContext(SearchNameContext);
}

global?.window && window.addEventListener("resize", function () {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});
