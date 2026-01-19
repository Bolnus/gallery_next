import React from "react";
import { SelectOption } from "../Select/types";
import styles from "./RadioList.module.scss";
import { getUnitedClassnames } from "../../../lib/common/commonUtils";

type OptionValue = string | number | readonly string[] | undefined;

interface RadioButtonProps<T extends OptionValue> {
  selectedValue: T;
  onChange: (value: T) => void;
  name: string;
  option: SelectOption<T>;
}

function RadioButton<T extends OptionValue>({
  selectedValue,
  onChange,
  name,
  option
}: Readonly<RadioButtonProps<T>>): JSX.Element {
  const isSelected = selectedValue === option.value;

  return (
    <li key={String(option.value)} className={styles.radioItem}>
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

interface RadioListProps<T> {
  options: SelectOption<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
  name: string;
}

export function RadioList<T extends OptionValue>({
  options,
  selectedValue,
  onChange,
  name
}: Readonly<RadioListProps<T>>): JSX.Element {
  return (
    <ul className={styles.radioList}>
      {options.map((option) => (
        <RadioButton
          key={String(option.value)}
          option={option}
          selectedValue={selectedValue}
          onChange={onChange}
          name={name}
        />
      ))}
    </ul>
  );
}
