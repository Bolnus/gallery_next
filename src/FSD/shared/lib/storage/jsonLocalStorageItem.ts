"use client";
import LocalStorageItem from "./localStorageItem";
import { IJsonStorageItem } from "./types";

/** Единица информации из cookie в формате для JSON */
export class JsonLocalStorageItem<T> extends LocalStorageItem implements IJsonStorageItem<T> {
  getJson(): T | undefined {
    const valueAsString = super.get();
    if (!valueAsString) {
      return undefined;
    }

    try {
      return JSON.parse(valueAsString) as T;
    } catch (error) {
      console.warn("error during retrieving JSON cookies");
      console.warn(error);
      return undefined;
    }
  }

  setJson(valueAsJson: T): void {
    try {
      const valueAsString = JSON.stringify(valueAsJson);
      super.set(valueAsString);
    } catch (error) {
      console.warn("error during saving JSON cookies");
      console.warn(error);
    }
  }
}
