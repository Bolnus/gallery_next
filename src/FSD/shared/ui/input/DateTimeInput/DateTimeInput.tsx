"use client";
import React from "react";
import classes from "./dateTimeInput.module.scss";
import { onInputChange, resetScrollOnBlur } from "../../../lib/common/commonUtils";
import { UiSize } from "../../../lib/common/commonTypes";

interface DateTimeInputProps {
  type: "date" | "datetime-local" | "time";
  size: UiSize;
  value: string;
  onChange: (newStr: string) => void;
  disabled?: boolean;
  className?: string;
}

function getContainerClass(size: UiSize): string {
  switch (size) {
    case UiSize.Small:
      return classes.dateTimeInput__container_small;
    case UiSize.Medium:
      return classes.dateTimeInput__container_medium;
    case UiSize.Large:
      return classes.dateTimeInput__container_big;
    default:
      return "";
  }
}

function getInputClass(size: UiSize): string {
  switch (size) {
    case UiSize.Small:
      return classes.dateTimeInput__input_small;
    case UiSize.Medium:
      return classes.dateTimeInput__input_medium;
    case UiSize.Large:
      return classes.dateTimeInput__input_big;
    default:
      return "";
  }
}

export function DateTimeInput({ type, size, value, onChange, disabled, className }: DateTimeInputProps) {
  return (
    <div className={`${className || ""} ${classes.dateTimeInput__container} ${getContainerClass(size)}`}>
      <input
        type={type}
        value={value}
        onChange={(localEvent: React.ChangeEvent<HTMLInputElement>) => onInputChange(onChange, localEvent)}
        onBlur={resetScrollOnBlur}
        disabled={disabled}
        className={`${classes.dateTimeInput__input} ${getInputClass(size)} commonInput`}
      />
    </div>
  );
}
