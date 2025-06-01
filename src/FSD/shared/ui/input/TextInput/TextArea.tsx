import React from "react";
import classes from "./TextArea.module.scss";
import { getUnitedClassnames } from "../../../lib/common/commonUtils";

interface TextInputProps {
  value: string;
  onChange?: (str: string) => void;
  disabled?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  rows?: number;
  placeholder?: string;
}

export function TextArea({
  value,
  onChange,
  disabled,
  containerClassName,
  inputClassName,
  rows,
  placeholder
}: TextInputProps): JSX.Element {
  return (
    <div className={getUnitedClassnames([classes.textArea, containerClassName])}>
      <textarea
        value={value}
        onChange={(localEv) => onChange?.(localEv.target.value || "")}
        disabled={disabled}
        rows={rows}
        onKeyDown={(localEv) => localEv.stopPropagation()}
        placeholder={placeholder}
        className={getUnitedClassnames([classes.textArea__input, "commonInput", inputClassName])}
      />
    </div>
  );
}
