import React, { MouseEventHandler } from "react";
import classes from "./RingProgress.module.scss";

export interface RingProgressProps {
  percent?: number;
  onClick?: MouseEventHandler<SVGSVGElement>;
}

function updateLocalDeg(setPreviousValue: (val: number) => void, prev: number, percent?: number): number {
  if (typeof percent !== "number") {
    return prev;
  }
  const newLocalValue = 251.2 - (251.2 * percent) / 100;
  setPreviousValue(prev);
  return newLocalValue;
}

export function RingProgressSVG({ percent, onClick }: Readonly<RingProgressProps>): JSX.Element {
  const [localValue, setLocalValue] = React.useState(251.2);
  const [previousValue, setPreviousValue] = React.useState(251.2);

  React.useEffect(() => setLocalValue((prev) => updateLocalDeg(setPreviousValue, prev, percent)), [percent]);

  return (
    <svg className={classes.ringBlock} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
      <circle className={classes.bgRing} cx="50" cy="50" r="40" fill="none" strokeWidth="8" />
      <circle
        className={classes.progressRing}
        transform="rotate(-90 50 50)"
        cx="50"
        cy="50"
        r="40"
        fill="none"
        strokeWidth="8"
        strokeDasharray="251.2"
        strokeDashoffset={String(localValue)}
      >
        <animate attributeName="stroke-dashoffset" from={String(previousValue)} to={String(localValue)} dur="1s" />
      </circle>
    </svg>
  );
}
