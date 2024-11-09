import React from "react";
import { ClearIndicatorProps, components, GroupBase } from "react-select";
import { SelectOption } from "./types";
import { IconName } from "../../icons/ReactIcon/types";
import { ReactIcon } from "../../icons/ReactIcon/ReactIcon";

export function ClearIndicator(props: ClearIndicatorProps<SelectOption, true, GroupBase<SelectOption>>) {
  return (
    <components.ClearIndicator {...props}>
      <ReactIcon iconName={IconName.Close} color="var(--fontColorFirm)" />
    </components.ClearIndicator>
  );
}
