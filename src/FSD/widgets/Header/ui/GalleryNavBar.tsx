"use client";
import { usePathname, useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import React from "react";
import { ButtonIcon } from "../../../shared/ui/button/ButtonIcon/ButtonIcon";
import classes from "./NavBar.module.scss";
import { goBack, onMenuClick } from "../lib/navBarUtils";
import { MenuItem } from "../lib/types";
import { IconName } from "../../../shared/ui/icons/ReactIcon/types";
import { UiSize } from "../../../shared/lib/common/commonTypes";
import { useCurrentAlbumId } from "../../../app/lib/context/useCurrentAlbumId";

export function GalleryNavBar(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const checkBoxRef = React.useRef<HTMLInputElement>(null);
  const [currentAlbumId] = useCurrentAlbumId();

  return (
    <nav className={classes.nav}>
      {pathname?.startsWith("/album") ? (
        <ButtonIcon
          onClick={() => goBack(router, !!currentAlbumId)}
          iconName={IconName.NavBack}
          size={UiSize.SmallAdaptive}
        />
      ) : (
        <div className={classes.nav__controlledMenu}>
          <input type="checkbox" ref={checkBoxRef} className={classes.nav__checkBox} />
          <span />
          <span />
          <span />
          <menu className={`${classes.nav__menu}`}>
            <li
              onClick={(menuClickEvent: React.MouseEvent) =>
                onMenuClick(router, checkBoxRef, MenuItem.MAIN, menuClickEvent)
              }
              className={classes.nav__menuItem}
            >
              {MenuItem.MAIN}
            </li>
            <li
              onClick={(menuClickEvent: React.MouseEvent) =>
                onMenuClick(router, checkBoxRef, MenuItem.CATEGORIES, menuClickEvent)
              }
              className={classes.nav__menuItem}
            >
              {MenuItem.CATEGORIES}
            </li>
            <li
              onClick={(menuClickEvent: React.MouseEvent) =>
                onMenuClick(router, checkBoxRef, MenuItem.ADD, menuClickEvent)
              }
              className={classes.nav__menuItem}
            >
              {MenuItem.ADD}
            </li>
          </menu>
        </div>
      )}
    </nav>
  );
}
