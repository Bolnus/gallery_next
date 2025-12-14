"use client";
import React from "react";
import classes from "./SausageButton.module.scss";
import { IconName } from "../../icons/ReactIcon/types";
import { ReactIcon } from "../../icons/ReactIcon/ReactIcon";
import { getUnitedClassnames } from "../../../lib/common/commonUtils";
import { UiSize } from "../../../lib/common/commonTypes";
import { SkeletonLoader } from "../../icons/SkeletonLoader/SkeletonLoader";

interface Props {
  iconName: IconName;
  text: string;
  onClick?: () => void;
  size?: UiSize;
  disabled?: boolean;
  // color?: string;
  className?: string;
  title?: string;
  isFetching?: boolean;
}

function onClickLocal(localEvent: React.SyntheticEvent<HTMLButtonElement>, onClick?: () => void) {
  localEvent.preventDefault();
  onClick?.();
}

export function getTextSizeClass(size?: UiSize): string {
  switch (size) {
    case UiSize.Small:
    case UiSize.SmallAdaptive:
      return classes.sausageButton__text_small;
    case UiSize.Large:
    case UiSize.LargeAdaptive:
      return classes.sausageButton__text_large;
    case UiSize.MediumAdaptive:
      return classes.sausageButton__text_medium;
    default:
      return classes.sausageButton__text_medium;
  }
}

export function getIconSizeClass(size?: UiSize): string {
  switch (size) {
    case UiSize.Small:
    case UiSize.SmallAdaptive:
      return classes.sausageButton__iconWrapper_small;
    case UiSize.Large:
    case UiSize.LargeAdaptive:
      return classes.sausageButton__iconWrapper_large;
    case UiSize.MediumAdaptive:
      return classes.sausageButton__iconWrapper_medium;
    default:
      return classes.sausageButton__iconWrapper_medium;
  }
}

export function SausageButtonInternal(
  { iconName, onClick, disabled, className, title, isFetching, text, size }: Props,
  ref: React.ForwardedRef<HTMLButtonElement>
): JSX.Element {
  return (
    <button
      onClick={(localEvent) => onClickLocal(localEvent, onClick)}
      disabled={disabled || isFetching}
      className={getUnitedClassnames(["pushButton", classes.sausageButton, className || ""])}
      title={title}
      id={iconName}
      ref={ref}
    >
      {isFetching ? null : (
        <div className={getUnitedClassnames([classes.sausageButton__iconWrapper, getIconSizeClass(size)])}>
          <ReactIcon iconName={iconName} color="white" />
        </div>
      )}
      <div className={classes.sausageButton__textWrapper}>
        {isFetching ? (
          <div className={classes.sausageButton__loader}>
            <SkeletonLoader />
          </div>
        ) : null}
        <span
          className={getUnitedClassnames([
            isFetching ? classes.sausageButton__text_invisible : "",
            getTextSizeClass(size)
          ])}
        >
          {text}
        </span>
      </div>
    </button>
  );
}

export const SausageButton = React.forwardRef(SausageButtonInternal);
