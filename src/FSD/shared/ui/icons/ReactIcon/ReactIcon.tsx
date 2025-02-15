import { HiArrowCircleLeft, HiChevronRight } from "react-icons/hi";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { HiChevronLeft } from "react-icons/hi";
import { HiX } from "react-icons/hi";
import { HiSearch } from "react-icons/hi";
import { HiPhotograph } from "react-icons/hi";
import { IconName } from "./types";
import { IconBaseProps } from "react-icons";
import { HiRefresh } from "react-icons/hi";
import { HiPencil } from "react-icons/hi";
import { MdDragHandle } from "react-icons/md";
import { BiSolidSave } from "react-icons/bi";
import classes from "./ReactIcon.module.scss";
import { getUnitedClassnames } from "../../../lib/common/commonUtils";

interface Props extends IconBaseProps {
  iconName: IconName;
}

export function ReactIcon({ iconName, className, ...props }: Props) {
  const unitedClassnames = getUnitedClassnames([classes.adaptiveIcon, className || ""]);
  const propsWithClass = { ...props, className: unitedClassnames };
  switch (iconName) {
    case IconName.NavBack:
      // iconElement = <TriangleSVG />;
      return <HiArrowCircleLeft {...propsWithClass} />;
    case IconName.ChevronLeft:
      return <HiChevronLeft {...propsWithClass} />;
    case IconName.ChevronRight:
      return <HiChevronRight {...propsWithClass} />;
    case IconName.Close:
      return <HiX {...propsWithClass} />;
    case IconName.Search:
      return <HiSearch {...propsWithClass} />;
    case IconName.Images:
      return <HiPhotograph {...propsWithClass} />;
    case IconName.Reload:
      return <HiRefresh {...propsWithClass} />;
    case IconName.Edit:
      return <HiPencil {...propsWithClass} />;
    case IconName.Save:
      return <BiSolidSave {...propsWithClass} />;
    case IconName.DragAndDrop:
      return <MdDragHandle {...propsWithClass} />;
    default:
      return <HiQuestionMarkCircle {...props} />;
  }
}
