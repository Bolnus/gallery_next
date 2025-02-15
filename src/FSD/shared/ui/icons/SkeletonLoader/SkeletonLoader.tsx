import React from "react";
import classes from "./SkeletonLoader.module.scss";
import { getUnitedClassnames } from "../../../lib/common/commonUtils";

export interface SkeletonLoaderProps {
  isSharp?: boolean;
  isStatic?: boolean;
}

export function SkeletonLoader({ isSharp, isStatic }: SkeletonLoaderProps) {
  // return <div className={classes.skeletonBlock}/> viewBox="0 0 100 100" preserveAspectRatio="none"
  return (
    <svg className={classes.skeletonBlock} xmlns="http://www.w3.org/2000/svg">
      <rect
        className={getUnitedClassnames([
          classes.skeletonBlock__line,
          isStatic ? "" : classes.skeletonBlock__line_animated
        ])}
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx={isSharp ? undefined : "0.5em"}
      />
    </svg>
  );
}
