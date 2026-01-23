import React from "react";
import type { Identifier } from "dnd-core";
import { useDrag, useDrop } from "react-dnd";
import classes from "./ImagesListItem.module.scss";
import { ButtonIcon } from "../../../shared/ui/button/ButtonIcon/ButtonIcon";
import { IconName } from "../../../shared/ui/icons/ReactIcon/types";
import { UiSize } from "../../../shared/lib/common/commonTypes";
import { FileLoadState, GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { ImageSnap } from "../../../shared/ui/image/ImageSnap/ImageSnap";
import { ButtonIconBackground } from "../../../shared/ui/button/ButtonIcon/types";
import { getUnitedClassnames } from "../../../shared/lib/common/commonUtils";
import { SpinnerProgressBar } from "../../../shared/ui/ProgressBar/SpinnerProgressBar";
import { getHumanReadableFileSize } from "../lib/utils";
import { DragItem } from "../lib/types";
import { useTranslations } from "next-intl";

const DRAGGABLE_TYPE = "DRAGGABLE_TYPE" as const;

interface Props {
  image: GalleryImage;
  index: number;
  deleteDisabled?: boolean;
  isCopyUrlEnabled?: boolean;
  onDelete: (id: string, loadState: FileLoadState) => void;
  onCancel: (id: string) => void;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
}

export function ImagesListItem({
  image,
  onDelete,
  onCancel,
  deleteDisabled,
  moveImage,
  index,
  isCopyUrlEnabled
}: Readonly<Props>): JSX.Element {
  const listItemRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const intl = useTranslations("ImagesListItem");

  const [{ isDragging }, drag] = useDrag<DragItem, DragItem, { isDragging: boolean }>({
    type: DRAGGABLE_TYPE,
    item: () => ({ index, id: image.id, type: DRAGGABLE_TYPE }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: DRAGGABLE_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },
    // drop: () => ({ index, id: image.id }),
    hover(item: DragItem, monitor) {
      if (!listItemRef.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = listItemRef.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveImage(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });

  drag(buttonRef);
  drop(listItemRef);

  return (
    <div
      className={getUnitedClassnames([classes.imagesListItem, isDragging ? classes.imagesListItem_dragging : ""])}
      ref={listItemRef}
      data-handler-id={handlerId}
    >
      <ButtonIcon
        // onClick={() => console.log("dnd")}
        iconName={IconName.DragAndDrop}
        size={UiSize.MediumAdaptive}
        color="var(--fontColorFirm)"
        background={ButtonIconBackground.Transparent}
        ref={buttonRef}
      />
      <div className={classes.imagesListItem__image}>
        <ImageSnap element={image} />
      </div>
      <div className={classes.imagesListItem__description}>
        <p className={classes.imagesListItem__descriptionText}>
          {image?.data?.size ? getHumanReadableFileSize(image?.data?.size) : ""}
        </p>
      </div>
      <div className={classes.imagesListItem__progressBar}>
        <SpinnerProgressBar
          percent={image.loadState}
          isComplete={image.loadState === FileLoadState.uploaded}
          isFailed={image.loadState === FileLoadState.uploadFailed || image.loadState === FileLoadState.uploadCanceled}
          onCancel={() => onCancel(image.id)}
          cancelTitle={intl("cancelUploadButton")}
        />
      </div>
      {isCopyUrlEnabled && (
        <ButtonIcon
          onClick={() => navigator.clipboard?.writeText(`![image_${index}](${image.url})`)}
          iconName={IconName.Copy}
          size={UiSize.MediumAdaptive}
          color="var(--fontColorFirm)"
          title={intl("copyButton")}
        />
      )}
      {deleteDisabled ? null : (
        <ButtonIcon
          onClick={() => onDelete(image.id, image.loadState)}
          iconName={IconName.Delete}
          size={UiSize.MediumAdaptive}
          color="var(--fontColorFirm)"
          title={intl("deleteButton")}
        />
      )}
    </div>
  );
}
