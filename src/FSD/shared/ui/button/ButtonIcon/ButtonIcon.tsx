"use client";
import React from "react";
import { ButtonIconBackground } from "./types";
import { UiSize } from "../../../lib/common/commonTypes";
import classes from "./ButtonIcon.module.scss";
import { getUnitedClassnames } from "../../../lib/common/commonUtils";
import { getBackgroundClass, getButtonSizeClass } from "./utils";
import { IconName } from "../../icons/ReactIcon/types";
import { ReactIcon } from "../../icons/ReactIcon/ReactIcon";

interface Props {
  iconName: IconName;
  onClick?: () => void;
  background?: ButtonIconBackground;
  size?: UiSize;
  disabled?: boolean;
  color?: string;
  className?: string;
  title?: string;
  isFetching?: boolean;
  stopPropagation?: boolean;
  preventDefault?: boolean;
}

function onClickLocal(
  localEvent: React.MouseEvent<HTMLButtonElement>,
  onClick?: () => void,
  stopPropagation?: boolean,
  preventDefault?: boolean
) {
  if (stopPropagation) {
    localEvent.stopPropagation();
  }
  if (preventDefault) {
    localEvent.preventDefault();
  }
  if (onClick) {
    onClick();
  }
}

export function ButtonIconInternal(
  {
    iconName,
    background,
    onClick,
    disabled,
    size,
    color,
    className,
    title,
    isFetching,
    stopPropagation,
    preventDefault
  }: Props,
  ref: React.ForwardedRef<HTMLButtonElement>
): JSX.Element {
  return (
    <button
      onClick={(localEvent) => onClickLocal(localEvent, onClick, stopPropagation, preventDefault)}
      disabled={disabled || isFetching}
      className={getUnitedClassnames([
        "pushButton",
        getButtonSizeClass(size),
        getBackgroundClass(background),
        classes.buttonIcon,
        className || ""
      ])}
      title={title}
      id={iconName}
      ref={ref}
      type="button"
    >
      {isFetching ? "•" : <ReactIcon iconName={iconName} color={color} />}
    </button>
  );
}

export const ButtonIcon = React.forwardRef(ButtonIconInternal);
