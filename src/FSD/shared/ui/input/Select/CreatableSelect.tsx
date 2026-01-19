"use client";
import React from "react";
import Select from "react-select/creatable";
import { MultiValue } from "react-select";
import { SelectOption } from "./types";
import { getSelectStyles, onSelectBlur } from "./utils";
import { ClearIndicator } from "./ClearIndicator";
import { LoadingText } from "./LoadingText";

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
}: Readonly<CreateableSelectProps>): JSX.Element {
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
      styles={getSelectStyles(true, isInvalid)}
      blurInputOnSelect
      loadingMessage={LoadingText}
      inputId="selectInputId"
      components={{ ClearIndicator }}
      instanceId={React.useId()}
    />
  );
}
