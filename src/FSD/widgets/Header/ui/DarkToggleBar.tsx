"use client";
import React from "react";
import classes from "./DarkToggle.module.scss";
import { DarkToggle } from "../../../shared/ui/checkBox/DarkToggle/DarkToggle";

export function DarkToggleBar(): JSX.Element {
  return (
    <div className={classes.darkToggleWrapper}>
      <DarkToggle />
    </div>
  );
}
