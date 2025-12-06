"use client";
import React from "react";
import classes from "./TextInput.module.scss";
import { resetScrollOnBlur } from "../../../lib/common/commonUtils";
import { ButtonIcon } from "../../button/ButtonIcon/ButtonIcon";
import { IconName } from "../../icons/ReactIcon/types";
import { UiSize } from "../../../lib/common/commonTypes";

interface TextInputProps {
  value: string;
  onChange?: (str: string) => void;
  isClearable?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

function onInputChange(localEvent: React.ChangeEvent<HTMLInputElement>, onChange?: (str: string) => void) {
  localEvent.preventDefault();
  if (onChange) {
    const inputElement = localEvent.target;
    onChange(inputElement.value);
  }
}

function onClearInput(onChange?: (str: string) => void) {
  if (onChange) {
    onChange("");
  }
}

export function TextInput({
  value,
  onChange,
  isClearable,
  className,
  disabled,
  placeholder
}: Readonly<TextInputProps>): JSX.Element {
  return (
    <div className={`${className || ""} ${classes.textInput}`}>
      <input
        placeholder={placeholder}
        onBlur={resetScrollOnBlur}
        value={value}
        onChange={(localEvent: React.ChangeEvent<HTMLInputElement>) => onInputChange(localEvent, onChange)}
        className={`${classes.textInput__input} commonInput`}
        disabled={disabled}
      />
      {isClearable && value ? (
        <div className={classes.textInput__indicatorContainer}>
          <span className={classes.textInput__spacer} />
          <div className={classes.textInput__indicatorClose}>
            <ButtonIcon
              onClick={() => onClearInput(onChange)}
              iconName={IconName.Close}
              size={UiSize.Small}
              color="var(--fontColorFirm)"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
