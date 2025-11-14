export interface SelectOption<T = string> {
  value: T;
  label: string;
}

export enum SelectType {
  FormSelect = "FormSelect"
}
