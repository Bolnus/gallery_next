import { UiSize } from "../../../lib/common/commonTypes";
import classes from "./ButtonIcon.module.scss";
import { ButtonIconBackground } from "./types";

export function getButtonIconClass(size?: UiSize) {
  switch (size) {
    case UiSize.Small:
      return classes.buttonIcon_small;
    case UiSize.Large:
      return classes.buttonIcon_large;
    default:
      return classes.buttonIcon_medium;
  }
}

export function getBackgroundClass(background?: ButtonIconBackground) {
  switch (background) {
    case ButtonIconBackground.Grey:
      return classes.buttonIcon_grey;
    default:
      return classes.buttonIcon_transparent;
  }
}
