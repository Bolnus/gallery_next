"use client";
import { IStorageItem } from "./types";

export default class LocalStorageItem<T extends string = string> implements IStorageItem<T> {
  private readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  set(value: T): void {
    localStorage.setItem(this.key, value);
  }

  get(): T | null {
    return localStorage.getItem(this.key) as T;
  }

  remove(): void {
    localStorage.removeItem(this.key);
  }
}
