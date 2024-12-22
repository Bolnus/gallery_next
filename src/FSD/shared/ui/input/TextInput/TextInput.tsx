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
}

function onInputChange(onChange: (str: string) => void, localEvent: React.FormEvent) {
  localEvent.preventDefault();
  const inputElement = localEvent.target as HTMLInputElement;
  onChange(inputElement.value);
}

function onClearInput(onChange: (str: string) => void) {
  onChange("");
}

export function TextInput({ value, onChange, isClearable, className, disabled }: TextInputProps) {
  return (
    <div className={`${className || ""} ${classes.textInput}`}>
      <input
        placeholder="Album name..."
        onBlur={resetScrollOnBlur}
        value={value}
        onChange={onChange && onInputChange.bind(null, onChange)}
        className={`${classes.textInput__input} commonInput`}
        disabled={disabled}
      />
      {isClearable ? (
        <div className={classes.textInput__indicatorContainer}>
          <span className={classes.textInput__spacer} />
          <div className={classes.textInput__indicatorClose}>
            <ButtonIcon
              onClick={onChange && onClearInput.bind(null, onChange)}
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
