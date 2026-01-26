"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { MenuItem } from "./types";

export function goBack(router: AppRouterInstance, albumsArrayLoaded: boolean): void {
  if (albumsArrayLoaded) {
    router.back();
  } else {
    router.push("/search");
  }
}

export function onMenuClick(
  router: AppRouterInstance,
  checkBoxRef: React.RefObject<HTMLInputElement>,
  menuItemName: MenuItem,
  menuClickEvent: React.MouseEvent
): void {
  menuClickEvent.preventDefault();
  const checkBox = checkBoxRef.current as HTMLInputElement;
  checkBox.checked = false;
  switch (menuItemName) {
    case MenuItem.MAIN:
      router.push("/main/1");
      break;
    case MenuItem.CATEGORIES:
      router.push("/categories");
      break;
    case MenuItem.ADD:
      router.push("/album");
      break;
    default:
      break;
  }
}
