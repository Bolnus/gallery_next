import { UiSize } from "../../../lib/common/commonTypes";
import classes from "./ButtonIcon.module.scss";
import { ButtonIconBackground } from "./types";

export function getButtonSizeClass(size?: UiSize) {
  switch (size) {
    case UiSize.Small:
      return classes.buttonIcon_small;
    case UiSize.Large:
      return classes.buttonIcon_large;
    case UiSize.SmallAdaptive:
      return classes.buttonIcon_smallAdaptive;
    case UiSize.LargeAdaptive:
      return classes.buttonIcon_largeAdaptive;
    case UiSize.MediumAdaptive:
      return classes.buttonIcon_mediumAdaptive;
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
