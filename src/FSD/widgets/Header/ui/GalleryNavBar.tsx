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
import { useTranslations } from "next-intl";
import { PieIcon } from "../../../shared/ui/icons/PieIcon/PieIcon";
import { getUnitedClassnames } from "../../../shared/lib/common/commonUtils";

export function GalleryNavBar(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const checkBoxRef = React.useRef<HTMLInputElement>(null);
  const [currentAlbumId] = useCurrentAlbumId();
  const intl = useTranslations("Navbar");

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
          <menu className={classes.nav__menu}>
            <li
              onClick={(menuClickEvent: React.MouseEvent) =>
                onMenuClick(router, checkBoxRef, MenuItem.MAIN, menuClickEvent)
              }
              className={getUnitedClassnames([classes.nav__menuItem, classes.nav__menuItem_icon])}
            >
              <PieIcon />
            </li>
            <li
              onClick={(menuClickEvent: React.MouseEvent) =>
                onMenuClick(router, checkBoxRef, MenuItem.MAIN, menuClickEvent)
              }
              className={getUnitedClassnames([classes.nav__menuItem, classes.nav__menuItem_text])}
            >
              {intl(MenuItem.MAIN)}
            </li>
            <li
              onClick={(menuClickEvent: React.MouseEvent) =>
                onMenuClick(router, checkBoxRef, MenuItem.CATEGORIES, menuClickEvent)
              }
              className={getUnitedClassnames([classes.nav__menuItem, classes.nav__menuItem_text])}
            >
              {intl(MenuItem.CATEGORIES)}
            </li>
            <li
              onClick={(menuClickEvent: React.MouseEvent) =>
                onMenuClick(router, checkBoxRef, MenuItem.ADD, menuClickEvent)
              }
              className={getUnitedClassnames([classes.nav__menuItem, classes.nav__menuItem_text])}
            >
              {intl(MenuItem.ADD)}
            </li>
          </menu>
        </div>
      )}
    </nav>
  );
}
