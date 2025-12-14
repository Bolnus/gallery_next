"use client";
import React from "react";
import classes from "./DarkToggle.module.scss";
import { HalfMoonIComp } from "../icons/HalfMoon/halfMoonIComp";
import { getUnitedClassnames } from "../../lib/common/commonUtils";

interface Props {
  isDark: boolean;
  onChange: (flag: boolean) => void;
  className?: string;
}

export function DarkToggle({ isDark, onChange, className }: Readonly<Props>): JSX.Element {
  return (
    <div className={getUnitedClassnames([classes.darkToggle, className])}>
      <HalfMoonIComp isRotated={isDark} />
      <input
        type="checkbox"
        className={classes.darkToggle__checkBox}
        onChange={(localEvent: React.ChangeEvent<HTMLInputElement>) => onChange(localEvent.target.checked)}
        checked={isDark}
      />
    </div>
  );
}
