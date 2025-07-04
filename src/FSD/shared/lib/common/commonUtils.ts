import React, { FocusEvent } from "react";
import { SelectOption } from "../../ui/input/Select/types";
import { DefinedTag } from "./galleryTypes";

function resetScroll() {
  window.scroll({ top: 0, left: 0 });
}

export function resetScrollOnBlur() {
  // localEvent: FocusEvent<HTMLInputElement>
  // localEvent.preventDefault();
  resetScroll();
  // setTimeout(resetScroll, 100);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getUpcomingDate(): string {
  let date: Date = new Date();
  date = addDays(date, 1);
  return String(
    date.getFullYear() +
      String("00" + (date.getMonth() + 1)).slice(-2) +
      String("00" + date.getDate()).slice(-2) +
      "235959"
  );
}

export function toUnsigned(text: string): number {
  const digitArray: RegExpMatchArray | null = text.match(/^\d+$/);
  if (digitArray) {
    return +digitArray.join();
  }
  return 0;
}

export function toInteger(text: string): number {
  const digitArray: RegExpMatchArray | null = text.match(/^-?\d+$/);
  if (digitArray) {
    return +digitArray.join();
  }
  return 0;
}

export function toFloat(text: string): number {
  const digitArray: RegExpMatchArray | null = text.match(/^-?\d+(\.\d+)?$/);
  if (digitArray) {
    return +digitArray.join();
  }
  return 0;
}

// export function onSimpleDispatch(
//   dispatch: AppDispatch,
//   actionCreator: () => UnknownAction,
//   localEvent: React.FormEvent
// ) {
//   localEvent.preventDefault();
//   dispatch(actionCreator());
// }

export function onCallbackExec(callBack: () => void, localEvent: React.FormEvent) {
  localEvent.preventDefault();
  callBack();
}

export function setStateOnInputChange(callBack: (str: string) => void, localEvent: React.FormEvent) {
  localEvent.preventDefault();
  const inputElement = localEvent.target as HTMLInputElement;
  callBack(inputElement.value);
}

// export function valueDispatch<T>(dispatch: AppDispatch, actionCreator: ActionCreatorWithPayload<T>, value: T) {
//   dispatch(actionCreator(value));
// }

export function updateStateValue<T>(setState: (str: T) => void, value: T) {
  setState(value);
}

function inverFlag(flag: boolean) {
  return !flag;
}

export function invertTrigger(setValue: React.Dispatch<React.SetStateAction<boolean>>) {
  setValue(inverFlag);
}

export function mapOptionToLabel(option: SelectOption): string {
  return option.label;
}

export function mapValueToOption(value: string): SelectOption {
  return {
    value,
    label: value
  };
}

export function mapDefinedTagsToOptions(definedTag: DefinedTag): SelectOption {
  return {
    value: definedTag.id,
    label: definedTag.tagName
  };
}

export function mapOptionsToDefinedTags(option: SelectOption): DefinedTag {
  return {
    id: option.value,
    tagName: option.label,
    albumsCount: 0
  };
}

export function getUnitedClassnames(classNames: (string | undefined)[]): string {
  return classNames.filter((className) => className && typeof className === "string").join(" ");
}

export function onInputChange(onChange: (newStr: string) => void, localEvent: React.ChangeEvent<HTMLInputElement>) {
  onChange(localEvent.target.value);
}

export function onTagsFocus(setTagsFocused: (flag: boolean) => void) {
  setTagsFocused(true);
}

function mapIndexToString(el: unknown, index: number) {
  return String(index);
}

export function getIndexesArray(arrayLength: number) {
  return Array.from({ length: arrayLength }).map(mapIndexToString);
}

export function shiftArrayElement<T = unknown>(prev: T[]): T[] {
  const [first, ...rest] = prev;
  return rest;
}

export function pushElementToArray<T = unknown>(newElement: T, prev: T[]): T[] {
  return [...prev, newElement];
}

export function tagsChanged(tags1: readonly DefinedTag[], tags2: readonly DefinedTag[]): boolean {
  if (tags1.length !== tags2.length) {
    return true;
  }
  for (let i = 0; i < tags1.length; i++) {
    if (tags1[i].id !== tags2[i].id) {
      return true;
    }
  }
  return false;
}
