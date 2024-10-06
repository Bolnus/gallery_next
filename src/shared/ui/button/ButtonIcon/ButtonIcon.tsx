"use client";
import React from "react";
import { HiArrowCircleLeft } from "react-icons/hi";
import { ButtonIconBackground } from "./types";
import { UiSize } from "../../../lib/common/commonTypes";
import { TriangleSVG } from "../../icons/Triangle/TriangleSVG";
import classes from "./ButtonIcon.module.scss";
import { getUnitedClassnames } from "../../../lib/common/commonUtils";
import { getBackgroundClass, getButtonIconClass } from "./utils";
import { IconName } from "../../icons/ReactIcon/types";
import { ReactIcon } from "../../icons/ReactIcon/ReactIcon";

interface Props {
  iconName: IconName;
  onClick: () => void;
  background?: ButtonIconBackground;
  size?: UiSize;
  disabled?: boolean;
  color?: string;
  className?: string;
}

export function ButtonIcon({ iconName, background, onClick, disabled, size, color, className }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getUnitedClassnames([
        "pushButton",
        getButtonIconClass(size),
        getBackgroundClass(background),
        classes.buttonIcon,
        className || ""
      ])}
    >
      <ReactIcon iconName={iconName} color={color} />
    </button>
  );
}
