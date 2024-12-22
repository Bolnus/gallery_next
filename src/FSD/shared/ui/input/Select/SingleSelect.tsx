import React from "react";
import Select, { InputActionMeta, InputProps, StylesConfig, components } from "react-select";
import { SelectOption } from "./types";
import { resetScrollOnBlur } from "../../../lib/common/commonUtils";

interface SingleSelectProps {
  options: SelectOption[];
  value: SelectOption;
  onChange: (newValue: SelectOption | null) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  className?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  isInvalid?: boolean;
  isLoading?: boolean;
}

enum SingleSelectType {
  FormSelect = "FormSelect"
}

function onSelectBlur(onBlur?: () => void) {
  resetScrollOnBlur();
  if (onBlur) {
    onBlur();
  }
}

function getStyles(selectType: SingleSelectType, isInvalid?: boolean): StylesConfig<SelectOption, false> {
  const formSelectStyle: StylesConfig<SelectOption, false> = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      background: isInvalid ? "#f6a89e" : "#e3e4dd",
      border: "none",
      outline: state.isFocused ? "none" : undefined,
      boxShadow: state.isFocused ? "none" : undefined,
      fontWeight: "normal",
      height: "100%",
      boxSizing: "border-box",
      minHeight: "34px"
    }),
    indicatorsContainer: (baseStyles) => ({
      ...baseStyles,
      cursor: "pointer"
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      background: "#e3e4dd",
      zIndex: 4
    }),
    menuList: (baseStyles) => ({
      ...baseStyles,
      overflowX: "hidden"
    }),
    option: (baseStyles) => ({
      ...baseStyles,
      cursor: "pointer",
      fontWeight: "normal",
      color: "black",
      fontSize: "var(--fontSizeMedium)"
    }),
    input: (baseStyles) => ({
      ...baseStyles,
      opacity: 1,
      fontSize: "var(--fontSizeMedium)"
    })
  };
  // switch (selectType)
  // {
  //     case SingleSelectType.FormSelect:
  // }

  return formSelectStyle;
}

function LoadingMessage() {
  return <>Loading...</>;
}

function onInputChange(
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  selectedValue: string,
  value: string
) {
  setInputValue(value);
}

function onInputFocus(setInputValue: (newString: string) => void, localPlaceHolder: string, onFocus?: () => void) {
  setInputValue(localPlaceHolder);
  if (onFocus) {
    onFocus();
  }
}

function onSelectChange(
  onChange: (newVal: SelectOption | null) => void,
  setInputValue: (newString: string) => void,
  newValue: SelectOption | null
) {
  onChange(newValue);
  setInputValue(newValue?.label || "");
}

export function SingleSelect({
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
  const [styles, setStyles] = React.useState<StylesConfig<SelectOption, false>>();
  const [inputValue, setInputValue] = React.useState(value.label);

  React.useEffect(
    function () {
      setStyles(getStyles(SingleSelectType.FormSelect, isInvalid));
    },
    [isInvalid]
  );

  return (
    <Select
      options={options}
      value={value}
      onChange={onSelectChange.bind(null, onChange, setInputValue)}
      onBlur={onSelectBlur.bind(null, onBlur)}
      className={className}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isClearable={isClearable}
      onFocus={onInputFocus.bind(null, setInputValue, value.label, onFocus)}
      isLoading={isLoading}
      styles={styles}
      inputValue={inputValue}
      onInputChange={onInputChange.bind(null, setInputValue, value.label)}
      blurInputOnSelect
      loadingMessage={LoadingMessage}
      inputId="selectInputId"
    />
  );
}
