"use client";
import React from "react";
import Select from "react-select/creatable";
import { MultiValue } from "react-select";
import { SelectOption, SelectType } from "./types";
import { getMultiSelectStyles, onSelectBlur } from "./utils";
import { ClearIndicator } from "./ClearIndicator";

interface CreateableSelectProps {
  options: SelectOption[];
  value: readonly SelectOption[];
  isDisabled?: boolean;
  className?: string;
  placeholder?: string;
  isClearable?: boolean;
  isInvalid?: boolean;
  isLoading?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  onChange: (newValue: MultiValue<SelectOption>) => void;
  onCreateOption(inputValue: string): void;
}

function LoadingMessage() {
  return <>Loading...</>;
}

export function CreatableMultiSelect({
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
  onFocus,
  onCreateOption
}: CreateableSelectProps) {
  return (
    <Select
      options={options}
      isMulti
      value={value}
      onChange={onChange}
      onCreateOption={onCreateOption}
      onBlur={() => onSelectBlur(onBlur)}
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
