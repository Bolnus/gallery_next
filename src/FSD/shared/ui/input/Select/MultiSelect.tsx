"use client";
import React from "react";
import Select, { MultiValue } from "react-select";
import { SelectOption, SelectType } from "./types";
import { getMultiSelectStyles, onSelectBlur } from "./utils";
import { ClearIndicator } from "./ClearIndicator";

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

function LoadingMessage(): JSX.Element {
  return <>Loading...</>;
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
}: SingleSelectProps) {
  return (
    <Select
      options={options}
      isMulti
      value={value}
      onChange={onChange}
      onBlur={onSelectBlur.bind(null, onBlur)}
      className={className}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isClearable={isClearable}
      onFocus={onFocus}
      isLoading={isLoading}
      styles={getMultiSelectStyles(SelectType.FormSelect, isInvalid)}
      blurInputOnSelect
      loadingMessage={LoadingMessage}
      inputId="selectInputId"
      components={{ ClearIndicator }}
      instanceId={React.useId()}
    />
  );
}
