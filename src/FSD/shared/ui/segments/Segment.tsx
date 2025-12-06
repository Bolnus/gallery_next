import React from "react";
import { getUnitedClassnames } from "../../lib/common/commonUtils";
import classes from "./Segment.module.scss";
import { IconName } from "../icons/ReactIcon/types";
import { ReactIcon } from "../icons/ReactIcon/ReactIcon";

interface SegmentProps {
  text: string;
  onClick: () => void;
  className?: string;
  isSelected?: boolean;
  iconName?: IconName;
  isFetching?: boolean;
  title?: string;
  counter?: number;
}

export function Segment({
  text,
  className,
  isSelected,
  iconName,
  title,
  counter,
  onClick
}: Readonly<SegmentProps>): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={getUnitedClassnames([
        "pushButton",
        classes.segment,
        isSelected ? classes.segment_selected : "",
        className || ""
      ])}
      title={title}
    >
      {!!iconName && (
        <div className={classes.segment__icon}>
          <ReactIcon iconName={iconName} />
        </div>
      )}
      <span className={classes.segment__text}>{text}</span>
      {counter ? <div className={classes.segment__counter}>{counter}</div> : null}
    </button>
  );
}
