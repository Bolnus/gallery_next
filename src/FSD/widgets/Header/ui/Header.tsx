import { HeaderToolbar } from "./HeaderToolbar";
import { GalleryNavBar } from "./GalleryNavBar";
import classes from "./Header.module.scss";
import { SearchBar } from "./SearchBar";

export function Header(): JSX.Element {
  return (
    <header className={classes.header}>
      <GalleryNavBar />
      <SearchBar />
      <HeaderToolbar />
    </header>
  );
}
