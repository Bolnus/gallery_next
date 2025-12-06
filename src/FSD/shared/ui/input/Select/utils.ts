import { StylesConfig } from "react-select";
import { SelectOption, SelectType } from "./types";
import { resetScrollOnBlur } from "../../../lib/common/commonUtils";

const fontColorFirm = "var(--fontColorFirm)";
const fontSizeSmall = "var(--fontSizeSmall)";

export function getMultiSelectStyles(selectType?: SelectType, isInvalid?: boolean): StylesConfig<SelectOption, true> {
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
      color: fontColorFirm,
      pointerEvents: "all",
      zIndex: 4,
      boxShadow: "0 3px 3px var(--shadowColor)"
    }),
    menuList: (baseStyles) => ({
      ...baseStyles,
      overflowX: "hidden"
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      cursor: "pointer",
      fontWeight: "normal",
      color: state.isFocused ? fontColorFirm : "grey",
      background: state.isFocused ? "var(--bgColor)" : undefined,
      fontSize: "var(--fontSizeMedium)"
      // opacity: state.isFocused ? 0.5 : 1
    }),
    input: (baseStyles) => ({
      ...baseStyles,
      opacity: 1,
      fontSize: fontSizeSmall,
      color: fontColorFirm,
      fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
        "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;`,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "& input": {
        font: "inherit"
      }
    }),
    multiValue: (baseStyles, state) => ({
      ...baseStyles,
      background: "var(--checkBoxColor)",
      fontSize: fontSizeSmall,
      padding: state.isDisabled ? "0 0 0 8px" : "0 8px 0 8px",
      borderRadius: fontSizeSmall,
      color: "white",
      pointerEvents: "all",
      cursor: "pointer"
    }),
    multiValueLabel: (baseStyles) => ({
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
      background: fontColorFirm
    }),
    dropdownIndicator: (baseStyles) => ({
      ...baseStyles,
      color: fontColorFirm
    }),
    placeholder: (baseStyles) => ({
      ...baseStyles,
      fontSize: fontSizeSmall,
      color: "grey",
      fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI",
      "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif`
    })
  };

  return formSelectStyle;
}

export function onSelectBlur(onBlur?: () => void): void {
  resetScrollOnBlur();
  if (onBlur) {
    onBlur();
  }
}
