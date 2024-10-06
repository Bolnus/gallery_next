"use client";
import { usePathname, useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import React from "react";
import { ButtonIcon } from "../../../shared/ui/button/ButtonIcon/ButtonIcon";
import classes from "./header.module.scss";
import { goBack, onMenuClick } from "../lib/navBarUtils";
import { MenuItem } from "../lib/types";
import { IconName } from "../../../shared/ui/icons/ReactIcon/types";

export function GalleryNavBar(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const checkBoxRef = React.useRef<HTMLInputElement>(null);

  return (
    <nav className={classes.nav}>
      {pathname?.startsWith("/album") ? (
        <ButtonIcon onClick={goBack.bind(null, router, false)} iconName={IconName.NavBack} />
      ) : (
        <div className={classes.nav__controlledMenu}>
          <input type="checkbox" ref={checkBoxRef} className={classes.nav__checkBox} />
          <span />
          <span />
          <span />
          <menu className={`${classes.nav__menu}`}>
            <li onClick={onMenuClick.bind(null, router, checkBoxRef, MenuItem.MAIN)} className={classes.nav__menuItem}>
              {MenuItem.MAIN}
            </li>
            <li
              onClick={onMenuClick.bind(null, router, checkBoxRef, MenuItem.CATEGORIES)}
              className={classes.nav__menuItem}
            >
              {MenuItem.CATEGORIES}
            </li>
          </menu>
        </div>
      )}
    </nav>
  );
}
