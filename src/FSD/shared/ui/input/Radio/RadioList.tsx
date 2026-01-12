import React from "react";
import { SelectOption } from "../Select/types";
import styles from "./RadioList.module.scss";
import { getUnitedClassnames } from "../../../lib/common/commonUtils";

interface RadioButtonProps {
  selectedValue: string;
  onChange: (value: string) => void;
  name: string;
  option: SelectOption<string>;
}

function RadioButton({ selectedValue, onChange, name, option }: Readonly<RadioButtonProps>): JSX.Element {
  const isSelected = selectedValue === option.value;

  return (
    <li key={option.value} className={styles.radioItem}>
      <label className={styles.radioLabel}>
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={isSelected}
          onChange={() => onChange(option.value)}
          className={styles.radioInput}
        />
        <div className={`${styles.radioCustom} ${isSelected ? styles.radioCustomSelected : ""}`}>
          <div className={getUnitedClassnames([styles.radioDot, isSelected ? styles.radioDot_selected : ""])} />
        </div>
        <div className={styles.radioContent}>
          <div className={styles.radioMainLabel}>{option.label}</div>
        </div>
      </label>
    </li>
  );
}

interface RadioListProps {
  options: SelectOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  name: string;
}

export function RadioList({ options, selectedValue, onChange, name }: Readonly<RadioListProps>): JSX.Element {
  return (
    <ul className={styles.radioList}>
      {options.map((option) => (
        <RadioButton key={option.value} option={option} selectedValue={selectedValue} onChange={onChange} name={name} />
      ))}
    </ul>
  );
}
