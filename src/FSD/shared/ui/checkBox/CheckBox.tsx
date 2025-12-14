"use client";
import React from "react";
import classes from "./CheckBox.module.scss";

interface Props {
  checked: boolean;
  onChange: (flag: boolean) => void;
}

export function CheckBox({ checked, onChange }: Readonly<Props>): JSX.Element {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(toggleEvent: React.ChangeEvent<HTMLInputElement>) => onChange(toggleEvent.target.checked)}
      className={classes.checkbox}
    />
  );
}
