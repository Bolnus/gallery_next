import { components, OptionProps, SingleValueProps, StylesConfig } from "react-select";
import Select from "react-select";
import { SelectOption } from "./types";
import { ReactIcon } from "../../icons/ReactIcon/ReactIcon";
import { IconName } from "../../icons/ReactIcon/types";
import styles from "./IconSelect.module.scss";
import { useId } from "react";

const FontColorFirm = "var(--fontColorFirm)";
const InputBgColor = "var(--inputBgColor)";

interface IconSelectProps {
  value: SelectOption<IconName>;
  onChange: (value: SelectOption<IconName>) => void;
  iconOptions: SelectOption<IconName>[];
}

// eslint-disable-next-line sonarjs/prefer-read-only-props
function Option(props: OptionProps<SelectOption<IconName>>): JSX.Element {
  return (
    <components.Option {...props}>
      {props.isSelected ? (
        <ReactIcon iconName={IconName.Dot} title={props.data.label} color={FontColorFirm} />
      ) : (
        <div className={styles.optionSpacer} />
      )}
      <ReactIcon iconName={props.data.value} title={props.data.label} color={FontColorFirm} />
      {/* <span className="singleLine">{props.children}</span> */}
    </components.Option>
  );
}

// eslint-disable-next-line sonarjs/prefer-read-only-props
function SingleValue(props: SingleValueProps<SelectOption<IconName>>): JSX.Element {
  return (
    <components.SingleValue {...props}>
      <ReactIcon iconName={props.data.value} title={props.data.label} color={FontColorFirm} />
    </components.SingleValue>
  );
}

function getOptionBg(state: OptionProps<SelectOption<IconName>, false>): string {
  if (state.isFocused) {
    return "var(--bgColor)";
  }
  // if (state.isSelected) {
  //   return "var(--inputBgColor)";
  // }
  return InputBgColor;
}

function customStyles(): StylesConfig<SelectOption<IconName>, false> {
  return {
    container: (baseStyles) => ({
      ...baseStyles,
      width: "70px"
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: InputBgColor,
      border: "none",
      outline: state.isFocused ? "none" : undefined,
      boxShadow: state.isFocused ? "none" : undefined,
      borderRadius: "4px",
      minHeight: "38px",
      minWidth: "70px",
      cursor: "pointer"
      // "&:hover": {
      //   borderColor: "#888"
      // }
    }),
    valueContainer: (baseStyles) => ({
      ...baseStyles,
      padding: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "24px"
    }),
    singleValue: (baseStyles) => ({
      ...baseStyles,
      margin: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "24px",
      paddingLeft: "5px"
    }),
    indicatorSeparator: () => ({
      display: "none"
    }),
    //   dropdownIndicator: (baseStyles) => ({
    //     ...baseStyles,
    //     padding: "4px",
    //     color: "#666",
    //     "&:hover": {
    //       color: "#333"
    //     }
    //   }),
    // clearIndicator: () => ({
    //   display: 'none',
    // }),
    menu: (baseStyles) => ({
      ...baseStyles,
      background: InputBgColor,
      color: FontColorFirm,
      zIndex: 4,
      boxShadow: "0 3px 3px var(--shadowColor)"
    }),
    menuList: (baseStyles) => ({
      ...baseStyles,
      padding: "4px 0",
      overflowX: "hidden"
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px 12px",
      cursor: "pointer",
      color: state.isFocused ? FontColorFirm : "grey",
      background: getOptionBg(state),
      fontSize: "var(--fontSizeMedium)",
      height: "40px",
      // maxHeight: "calc(2 * var(--fontSizeMedium))",
      boxSizing: "border-box"
    }),
    dropdownIndicator: (baseStyles) => ({
      ...baseStyles,
      color: FontColorFirm
    })
  };
}

export function IconSelect({ value, onChange, iconOptions }: Readonly<IconSelectProps>): JSX.Element {
  return (
    <Select
      className={styles.select}
      options={iconOptions}
      value={value}
      onChange={(option) => option && onChange(option)}
      styles={customStyles()}
      isSearchable={false}
      isClearable={false}
      components={{
        IndicatorSeparator: null,
        Option,
        SingleValue,
        Input: () => null
      }}
      instanceId={useId()}
    />
  );
}
