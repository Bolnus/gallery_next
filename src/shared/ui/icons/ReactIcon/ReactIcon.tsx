import { HiArrowCircleLeft, HiChevronRight } from "react-icons/hi";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { HiChevronLeft } from "react-icons/hi";
import { HiX } from "react-icons/hi";
import { HiSearch } from "react-icons/hi";
import { IconName } from "./types";
import { IconBaseProps } from "react-icons";
import classes from "./ReactIcon.module.scss";
import { getUnitedClassnames } from "../../../lib/common/commonUtils";

interface Props extends IconBaseProps {
  iconName: IconName;
}

export function ReactIcon({ iconName, className, ...props }: Props) {
  const unitedClassnames = getUnitedClassnames([classes.adaptiveIcon, className || ""]);
  switch (iconName) {
    case IconName.NavBack:
      // iconElement = <TriangleSVG />;
      return <HiArrowCircleLeft {...props} className={unitedClassnames} />;
    case IconName.ChevronLeft:
      return <HiChevronLeft {...props} className={unitedClassnames} />;
    case IconName.ChevronRight:
      return <HiChevronRight {...props} className={unitedClassnames} />;
    case IconName.Close:
      return <HiX {...props} className={unitedClassnames} />;
    case IconName.Search:
      return <HiSearch {...props} className={unitedClassnames} />;
    default:
      return <HiQuestionMarkCircle {...props} />;
  }
}
