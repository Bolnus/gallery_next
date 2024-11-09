"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { MenuItem } from "./types";

export function goBack(router: AppRouterInstance, albumsArrayLoaded: boolean) {
  if (albumsArrayLoaded) {
    router.back();
  } else {
    router.push("/search");
  }
}

export function onMenuClick(
  router: AppRouterInstance,
  checkBoxRef: React.RefObject<HTMLInputElement>,
  menuItemName: string,
  menuClickEvent: React.MouseEvent<HTMLElement>
): void {
  menuClickEvent.preventDefault();
  const checkBox = checkBoxRef.current as HTMLInputElement;
  checkBox.checked = false;
  // const listItem = event.target as HTMLUListElement;
  // const upcomingDate: string = getUpcomingDate();
  switch (menuItemName) {
    case MenuItem.MAIN:
      router.push("/");
      break;
    case MenuItem.CATEGORIES:
      break;
  }
}
