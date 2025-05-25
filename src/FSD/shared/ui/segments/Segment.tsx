import React from "react";
import { getUnitedClassnames } from "../../lib/common/commonUtils";
import classes from "./Segment.module.scss";

interface SegmentProps {
  children: string;
  onClick: () => void;
  className?: string;
  isSelected?: boolean;
}

export function Segment({ children, className, isSelected, onClick }: SegmentProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={getUnitedClassnames([
        "pushButton",
        classes.segment,
        isSelected ? classes.segment_selected : "",
        className || ""
      ])}
    >
      {children}
    </button>
  );
}
