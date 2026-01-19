"use client";
import React from "react";
import Select, { MultiValue } from "react-select";
import { SelectOption } from "./types";
import { getSelectStyles, onSelectBlur } from "./utils";
import { ClearIndicator } from "./ClearIndicator";
import { LoadingText } from "./LoadingText";

interface SingleSelectProps {
  options: SelectOption[];
  value: readonly SelectOption[];
  onChange: (newValue: MultiValue<SelectOption>) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  className?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  isInvalid?: boolean;
  isLoading?: boolean;
}

export function MultiSelect({
  value,
  options,
  onChange,
  className,
  placeholder,
  isDisabled,
  isClearable,
  isInvalid,
  isLoading,
  onBlur,
  onFocus
}: Readonly<SingleSelectProps>): JSX.Element {
  return (
    <Select
      options={options}
      isMulti
      value={value}
      onChange={onChange}
      onBlur={() => onSelectBlur(onBlur)}
      className={className}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isClearable={isClearable}
      onFocus={onFocus}
      isLoading={isLoading}
      styles={getSelectStyles(true, isInvalid)}
      blurInputOnSelect
      loadingMessage={LoadingText}
      inputId="selectInputId"
      components={{ ClearIndicator }}
      instanceId={React.useId()}
    />
  );
}
