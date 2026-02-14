import { StylesConfig } from "react-select";
import { SelectOption } from "./types";
import { resetScrollOnBlur } from "../../../lib/common/commonUtils";

const fontColorFirm = "var(--fontColorFirm)";
const fontSizeSmall = "var(--fontSizeSmall)";
const inputBgColor = "var(--inputBgColor)";

export function getSelectStyles<M extends boolean, V = string>(
  isMulti: M,
  isInvalid?: boolean
): StylesConfig<SelectOption<V>, M> {
  const formSelectStyle: StylesConfig<SelectOption<V>, M> = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      background: isInvalid ? "#f6a89e" : inputBgColor,
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
      background: inputBgColor,
      color: fontColorFirm,
      pointerEvents: "all",
      zIndex: 4,
      boxShadow: "0 3px 3px var(--shadowColor)"
    }),
    menuList: (baseStyles) => ({
      ...baseStyles,
      overflowX: "hidden"
    }),
    option: (baseStyles, state) => {
      let background: string | undefined;
      if (state.isFocused) {
        background = "var(--bgColor)";
      } else if (state.isSelected) {
        background = "var(--mainColor)";
      }
      return {
        ...baseStyles,
        cursor: "pointer",
        fontWeight: "normal",
        color: state.isFocused ? fontColorFirm : "grey",
        background,
        fontSize: fontSizeSmall
      };
    },
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

  if (isMulti) {
    return {
      ...formSelectStyle,
      multiValue: (baseStyles, state) => ({
        ...baseStyles,
        background: "var(--mainColor)",
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
      })
    };
  }

  return {
    ...formSelectStyle,
    singleValue: (baseStyles) => ({
      ...baseStyles,
      color: "var(--fontColorFirm)",
      fontSize: fontSizeSmall,
      fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI",
      "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif`
    })
  };
}

export function onSelectBlur(onBlur?: () => void): void {
  resetScrollOnBlur();
  if (onBlur) {
    onBlur();
  }
}
