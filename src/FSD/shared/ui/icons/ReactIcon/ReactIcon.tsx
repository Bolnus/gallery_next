import {
  HiArrowCircleLeft,
  HiChevronRight,
  HiQuestionMarkCircle,
  HiChevronLeft,
  HiX,
  HiSearch,
  HiPhotograph,
  HiRefresh,
  HiPencil,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiTrash
} from "react-icons/hi";
import { IconBaseProps } from "react-icons";
import { FaRandom } from "react-icons/fa";
import { MdDragHandle, MdDateRange } from "react-icons/md";
import { BiSolidSave } from "react-icons/bi";
import { TbLoader2 } from "react-icons/tb";
import { GoDotFill } from "react-icons/go";
import { IconName } from "./types";
import classes from "./ReactIcon.module.scss";
import { getUnitedClassnames } from "../../../lib/common/commonUtils";

interface Props extends IconBaseProps {
  iconName: IconName;
}

export function ReactIcon({ iconName, className, ...props }: Readonly<Props>): JSX.Element {
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
    case IconName.Delete:
      return <HiTrash {...propsWithClass} />;
    case IconName.Loader:
      return <TbLoader2 {...propsWithClass} />;
    case IconName.Check:
      return <HiOutlineCheckCircle {...propsWithClass} />;
    case IconName.LocalError:
      return <HiOutlineExclamationCircle {...propsWithClass} />;
    case IconName.Random:
      return <FaRandom {...propsWithClass} />;
    case IconName.Calendar:
      return <MdDateRange {...propsWithClass} />;
    case IconName.Dot:
      return <GoDotFill {...propsWithClass} />;
    default:
      return <HiQuestionMarkCircle {...props} />;
  }
}
