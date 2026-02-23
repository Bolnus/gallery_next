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
  isFetching?: boolean;
}

export function TextArea({
  value,
  onChange,
  disabled,
  containerClassName,
  inputClassName,
  rows,
  placeholder,
  isFetching
}: Readonly<TextInputProps>): JSX.Element {
  return (
    <div className={getUnitedClassnames([classes.textArea, containerClassName])}>
      <textarea
        value={isFetching ? "" : value}
        onChange={(localEv) => !isFetching && onChange?.(localEv.target.value || "")}
        disabled={disabled || isFetching}
        rows={rows}
        onKeyDown={(localEv) => localEv.stopPropagation()}
        placeholder={isFetching ? "" : placeholder}
        className={getUnitedClassnames([classes.textArea__input, "commonInput", inputClassName])}
      />
    </div>
  );
}
