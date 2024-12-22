"use client";
import React from "react";
import classes from "./DarkToggle.module.scss";
import { darkToggleStorageItem } from "../../../lib/storage/localStorageInterface";

function updateStyle(toggleState: boolean): void {
  if (toggleState) {
    document.documentElement.style.setProperty("--mainColor", "#112734");
    document.documentElement.style.setProperty("--bgColor", "#021e2a");
    document.documentElement.style.setProperty("--fontColorFirm", "white");
    document.documentElement.style.setProperty("--fontColorFirmGreen", "white");
    document.documentElement.style.setProperty("--fontColorGreenInverted", "#004422");
    document.documentElement.style.setProperty("--fontColorLight", "#c4ccce");
    document.documentElement.style.setProperty("--mainColorDark", "#112734");
    document.documentElement.style.setProperty("--inputBgColor", "#112734");
  } else {
    document.documentElement.style.setProperty("--mainColor", "#80eeb0");
    document.documentElement.style.setProperty("--bgColor", "#f5f6fa");
    document.documentElement.style.setProperty("--fontColorFirm", "black");
    document.documentElement.style.setProperty("--fontColorFirmGreen", "#004422");
    document.documentElement.style.setProperty("--fontColorGreenInverted", "grey");
    document.documentElement.style.setProperty("--fontColorLight", "grey");
    document.documentElement.style.setProperty("--mainColorDark", "#004422");
    document.documentElement.style.setProperty("--inputBgColor", "#c4ccce");
  }
}

function onCheckBoxClicked(setChecked: (flag: boolean) => void, toggleEvent: React.ChangeEvent<HTMLInputElement>) {
  const inputElement = toggleEvent.target as HTMLInputElement;
  const { checked } = inputElement;
  setChecked(checked);
  updateStyle(checked);
  darkToggleStorageItem.set(String(checked));
}

export function DarkToggle() {
  const [checked, setChecked] = React.useState(false);
  React.useEffect(function () {
    const isDark = darkToggleStorageItem.get() === "true";
    updateStyle(isDark);
    setChecked(isDark);
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, []);

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onCheckBoxClicked.bind(null, setChecked)}
      className={classes.darkToggle}
    />
  );
}
