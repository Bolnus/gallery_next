import {
  HiArrowCircleLeft,
  HiQuestionMarkCircle,
  HiChevronDoubleRight,
  HiChevronRight,
  HiChevronLeft,
  HiChevronDoubleLeft,
  HiX,
  HiSearch,
  HiPhotograph,
  HiRefresh,
  HiPencil,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiTrash,
  HiUserCircle,
  HiLogout,
  HiOutlineUserCircle,
  HiEye,
  HiEyeOff,
  HiDocumentText,
  HiOutlinePaperClip
} from "react-icons/hi";
import { HiMiniPaintBrush } from "react-icons/hi2";
import { IconBaseProps } from "react-icons";
import { FaEraser, FaRandom, FaTools } from "react-icons/fa";
import { MdDragHandle, MdDateRange, MdWorkHistory, MdSort } from "react-icons/md";
import { BiSolidSave } from "react-icons/bi";
import { TbLoader2 } from "react-icons/tb";
import { GoDotFill } from "react-icons/go";
import { TbCopy } from "react-icons/tb";
import { IconName } from "./types";
import classes from "./ReactIcon.module.scss";
import { getUnitedClassnames } from "../../../lib/common/commonUtils";
import { RiMailSendFill } from "react-icons/ri";

interface Props extends IconBaseProps {
  iconName: IconName;
}

export function ReactIcon({ iconName, className, ...props }: Readonly<Props>): JSX.Element {
  const unitedClassnames = getUnitedClassnames([classes.adaptiveIcon, className || ""]);
  const propsWithClass = { ...props, className: unitedClassnames };

  switch (iconName) {
    case IconName.NavBack:
      return <HiArrowCircleLeft {...propsWithClass} />;
    case IconName.ChevronLeft:
      return <HiChevronLeft {...propsWithClass} />;
    case IconName.ChevronRight:
      return <HiChevronRight {...propsWithClass} />;
    case IconName.ChevronDoubleLeft:
      return <HiChevronDoubleLeft {...propsWithClass} />;
    case IconName.ChevronDoubleRight:
      return <HiChevronDoubleRight {...propsWithClass} />;
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
    case IconName.User:
      return <HiUserCircle {...propsWithClass} />;
    case IconName.Logout:
      return <HiLogout {...propsWithClass} />;
    case IconName.Login:
      return <HiOutlineUserCircle {...propsWithClass} />;
    case IconName.Show:
      return <HiEye {...propsWithClass} />;
    case IconName.Hide:
      return <HiEyeOff {...propsWithClass} />;
    case IconName.Copy:
      return <TbCopy {...propsWithClass} />;
    case IconName.Brush:
      return <HiMiniPaintBrush {...propsWithClass} />;
    case IconName.TextDoc:
      return <HiDocumentText {...propsWithClass} />;
    case IconName.Attachments:
      return <HiOutlinePaperClip {...propsWithClass} />;
    case IconName.Work:
      return <MdWorkHistory {...propsWithClass} />;
    case IconName.Tools:
      return <FaTools {...propsWithClass} />;
    case IconName.SendMail:
      return <RiMailSendFill {...propsWithClass} />;
    case IconName.Eraser:
      return <FaEraser {...propsWithClass} />;
    case IconName.SortingDesc:
      return <MdSort {...propsWithClass} />;
    default:
      return <HiQuestionMarkCircle {...props} />;
  }
}
