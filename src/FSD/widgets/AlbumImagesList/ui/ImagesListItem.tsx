import React from "react";
import classes from "./ImagesListItem.module.scss";
import { ButtonIcon } from "../../../shared/ui/button/ButtonIcon/ButtonIcon";
import { IconName } from "../../../shared/ui/icons/ReactIcon/types";
import { UiSize } from "../../../shared/lib/common/commonTypes";
import { FileLoadState, GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { ImageSnap } from "../../../shared/ui/image/ImageSnap/ImageSnap";
import { ProgressBar } from "../../../shared/ui/ProgressBar/ProgressBar";
import { ButtonIconBackground } from "../../../shared/ui/button/ButtonIcon/types";
import { getUnitedClassnames } from "../../../shared/lib/common/commonUtils";
import { SpinnerProgressBar } from "../../../shared/ui/ProgressBar/SpinnerProgressBar";

interface Props {
  image: GalleryImage;
  deleteDisabled?: boolean;
  onDelete: (id: string, loadState: FileLoadState) => void;
  onCancel: (id: string) => void;
}

export function ImagesListItem({ image, onDelete, onCancel, deleteDisabled }: Props): JSX.Element {
  return (
    <div className={classes.imagesListItem}>
      <ButtonIcon
        onClick={() => console.log("dnd")}
        iconName={IconName.DragAndDrop}
        size={UiSize.MediumAdaptive}
        color="var(--fontColorFirm)"
        background={ButtonIconBackground.Transparent}
      />
      <div className={classes.imagesListItem__image}>
        <ImageSnap element={image} />
      </div>
      <div className={classes.imagesListItem__description}>
        <p className={classes.imagesListItem__descriptionText}>
          {image?.data?.size ? `${(image?.data?.size / 1024 / 1024).toFixed(2)} MB` : ""}
        </p>
      </div>
      <div className={classes.imagesListItem__progressBar}>
        <SpinnerProgressBar
          percent={image.loadState}
          isComplete={image.loadState === FileLoadState.uploaded}
          isFailed={image.loadState === FileLoadState.uploadFailed || image.loadState === FileLoadState.uploadCanceled}
          onCancel={() => onCancel(image.id)}
        />
      </div>
      {deleteDisabled ? null : (
        <ButtonIcon
          onClick={() => onDelete(image.id, image.loadState)}
          iconName={IconName.Delete}
          size={UiSize.MediumAdaptive}
          color="var(--fontColorFirm)"
        />
      )}
    </div>
  );
}
