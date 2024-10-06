"use client";
import React from "react";
import Select, { ClearIndicatorProps, components, DropdownIndicatorProps, GroupBase, MultiValue, StylesConfig } from "react-select";
import { SelectOption } from "./types";
import { resetScrollOnBlur } from "../../../lib/common/commonUtils";
import { IconName } from "../../icons/ReactIcon/types";
import { ReactIcon } from "../../icons/ReactIcon/ReactIcon";

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

enum SingleSelectType {
  FormSelect = "FormSelect"
}

function ClearIndicator(props: ClearIndicatorProps<SelectOption, true, GroupBase<SelectOption>>) {
  return (
    <components.ClearIndicator {...props}>
      <ReactIcon iconName={IconName.Close} color="var(--fontColorFirm)" />
    </components.ClearIndicator>
  );
}

function onSelectBlur(onBlur?: () => void) {
  resetScrollOnBlur();
  if (onBlur) {
    onBlur();
  }
}

function getStyles(selectType: SingleSelectType, isInvalid?: boolean): StylesConfig<SelectOption, true> {
  const formSelectStyle: StylesConfig<SelectOption, true> = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      background: isInvalid ? "#f6a89e" : "var(--inputBgColor)",
      border: "none",
      outline: state.isFocused ? "none" : undefined,
      boxShadow: state.isFocused ? "none" : undefined,
      fontWeight: "normal",
      boxSizing: "border-box",
      minHeight: "38px"
    }),
    indicatorsContainer: (baseStyles) => ({
      ...baseStyles,
      cursor: "pointer"
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      background: "var(--inputBgColor)",
      color: "var(--fontColorFirm)",
      pointerEvents: "all",
      zIndex: 4
    }),
    menuList: (baseStyles) => ({
      ...baseStyles,
      overflowX: "hidden"
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      cursor: "pointer",
      fontWeight: "normal",
      color: state.isFocused ? "var(--fontColorFirm)" : "grey",
      background: state.isFocused ? "var(--bgColor)" : undefined,
      fontSize: "var(--fontSizeMedium)",
      // opacity: state.isFocused ? 0.5 : 1
    }),
    input: (baseStyles) => ({
      ...baseStyles,
      opacity: 1,
      fontSize: "var(--fontSizeSmall)",
      color: "var(--fontColorFirm)",
      fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
      "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;`,
      "& input": {
        font: "inherit"
      }
    }),
    multiValue: (baseStyles, state) => ({
      ...baseStyles,
      background: "var(--checkBoxColor)",
      fontSize: "var(--fontSizeSmall)",
      padding: state.isDisabled ? "0 0 0 8px" : "0 8px 0 8px",
      borderRadius: "var(--fontSizeSmall)",
      color: "white",
      pointerEvents: "all",
      cursor: "pointer"
    }),
    multiValueLabel: (baseStyles, state) => ({
      ...baseStyles,
      color: "white",
      textWrap: "nowrap",
      fontWeight: "bold"
    }),
    multiValueRemove: (baseStyles, state) => ({
      ...baseStyles,
      visibility: state?.isDisabled ? "hidden" : undefined,
      cursor: "pointer"
    }),
    indicatorSeparator: (baseStyles) => ({
      ...baseStyles,
      background: "var(--fontColorFirm)"
    }),
    dropdownIndicator: (baseStyles) => ({
      ...baseStyles,
      color: "var(--fontColorFirm)"
    }),
    placeholder: (baseStyles) => ({
      ...baseStyles,
      fontSize: "var(--fontSizeSmall)",
      color: "grey"
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
      styles={getStyles(SingleSelectType.FormSelect, isInvalid)}
      blurInputOnSelect
      loadingMessage={LoadingMessage}
      inputId="selectInputId"
      components={{ ClearIndicator }}
    />
  );
}
