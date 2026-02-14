import React from "react";
import Select from "react-select";
import { SelectOption } from "./types";
import { LoadingText } from "./LoadingText";
import { getSelectStyles, onSelectBlur } from "./utils";
import { ClearIndicator } from "./ClearIndicator";

interface SingleSelectProps<T = string> {
  options: SelectOption<T>[];
  value?: SelectOption<T>;
  onChange: (newValue: SelectOption<T> | null) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  className?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  isInvalid?: boolean;
  isLoading?: boolean;
}

function onInputFocus(setInputValue: (newString: string) => void, localPlaceHolder: string, onFocus?: () => void) {
  if (onFocus) {
    onFocus();
  }
}

function onSelectChange<T>(
  onChange: (newVal: SelectOption<T> | null) => void,
  setInputValue: (newString: string) => void,
  newValue: SelectOption<T> | null
) {
  onChange(newValue);
  setInputValue(newValue?.label || "");
}

export function SingleSelect<T>({
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
}: Readonly<SingleSelectProps<T>>): JSX.Element {
  const [inputValue, setInputValue] = React.useState(value?.label || "");

  return (
    <Select
      options={options}
      value={value}
      onChange={(newValue: SelectOption<T> | null) => onSelectChange(onChange, setInputValue, newValue)}
      onBlur={() => onSelectBlur(onBlur)}
      className={className}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isClearable={isClearable}
      onFocus={() => onInputFocus(setInputValue, value?.label || "", onFocus)}
      isLoading={isLoading}
      styles={getSelectStyles<false, T>(false, isInvalid)}
      inputValue={inputValue}
      onInputChange={setInputValue}
      blurInputOnSelect
      loadingMessage={LoadingText}
      inputId="selectInputId"
      components={{ ClearIndicator }}
    />
  );
}
