import { HeaderToolbar } from "./HeaderToolbar";
import { GalleryNavBar } from "./GalleryNavBar";
import classes from "./Header.module.scss";
import { SearchBar } from "./SearchBar";
import { Suspense } from "react";

export function Header(): JSX.Element {
  return (
    <header className={classes.header}>
      <GalleryNavBar />
      <SearchBar />
      <Suspense fallback={<div />}>
        <HeaderToolbar />
      </Suspense>
    </header>
  );
}
