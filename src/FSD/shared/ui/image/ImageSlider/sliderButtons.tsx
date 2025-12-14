import { UiSize } from "../../../lib/common/commonTypes";
import { getUnitedClassnames } from "../../../lib/common/commonUtils";
import { ButtonIcon } from "../../button/ButtonIcon/ButtonIcon";
import { IconName } from "../../icons/ReactIcon/types";
import classes from "./sliderButtons.module.scss";

type CommonButtonProps = Readonly<{ onClick?: () => void }>;

export function PrevButton(props: CommonButtonProps): JSX.Element {
  const { onClick } = props;
  return (
    <div className={getUnitedClassnames([classes.sliderButton, classes.sliderButton_left])}>
      <ButtonIcon onClick={onClick} iconName={IconName.ChevronLeft} size={UiSize.LargeAdaptive} color="white" />
    </div>
  );
}

export function NextButton(props: CommonButtonProps): JSX.Element {
  const { onClick } = props;
  return (
    <div className={getUnitedClassnames([classes.sliderButton, classes.sliderButton_right])}>
      <ButtonIcon onClick={onClick} iconName={IconName.ChevronRight} size={UiSize.LargeAdaptive} color="white" />
    </div>
  );
}
