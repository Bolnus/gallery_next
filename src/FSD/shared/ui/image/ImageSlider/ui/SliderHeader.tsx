import React from "react";
import classes from "./SliderHeader.module.scss";
import { getUnitedClassnames } from "../../../../lib/common/commonUtils";

interface Props {
  title?: string;
  description?: string;
}

export function SliderHeader({ title, description }: Props): JSX.Element {
  return (
    <div className={classes.sliderHeader}>
      <p className={getUnitedClassnames([classes.sliderHeader__text_title, classes.sliderHeader__text])}>
        {title}
      </p>
      <p className={getUnitedClassnames([classes.sliderHeader__text_description, classes.sliderHeader__text])}>
        {description}
      </p>
    </div>
  );
}
