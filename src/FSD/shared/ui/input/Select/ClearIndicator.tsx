import React from "react";
import { ClearIndicatorProps, components, GroupBase } from "react-select";
import { SelectOption } from "./types";
import { IconName } from "../../icons/ReactIcon/types";
import { ReactIcon } from "../../icons/ReactIcon/ReactIcon";

export function ClearIndicator<M extends boolean, V = string>(
  // eslint-disable-next-line sonarjs/prefer-read-only-props
  props: ClearIndicatorProps<SelectOption<V>, M, GroupBase<SelectOption<V>>>
): JSX.Element {
  return (
    <components.ClearIndicator {...props}>
      <ReactIcon iconName={IconName.Close} color="var(--fontColorFirm)" />
    </components.ClearIndicator>
  );
}
