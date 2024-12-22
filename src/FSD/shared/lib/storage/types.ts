"use client";

export interface IStorageItem<T extends string = string> {
  set: (value: T) => void;
  get: () => T | null;
  remove: () => void;
}

export interface IJsonStorageItem<T> extends IStorageItem {
  getJson: () => T | undefined;
  setJson: (s: T) => void;
}
