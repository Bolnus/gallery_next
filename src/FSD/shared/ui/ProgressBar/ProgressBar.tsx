import React from "react";
import classes from "./ProgressBar.module.scss";

interface ProgressBarProps {
  percent: number;
}

export function ProgressBar({ percent }: Readonly<ProgressBarProps>): JSX.Element {
  const clampedPercent = Math.max(0, Math.min(100, percent));

  return (
    <div className={classes.progressBar}>
      <div className={classes.progressFill} style={{ width: `${clampedPercent}%` }} />
    </div>
  );
}
