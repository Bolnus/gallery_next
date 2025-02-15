import React from "react";
import classes from "./ImagesListItem.module.scss";
import { ButtonIcon } from "../../../shared/ui/button/ButtonIcon/ButtonIcon";
import { IconName } from "../../../shared/ui/icons/ReactIcon/types";
import { UiSize } from "../../../shared/lib/common/commonTypes";
import { FileLoadState, GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { ImageSnap } from "../../../shared/ui/image/ImageSnap/ImageSnap";
import { ProgressBar } from "../../../shared/ui/ProgressBar/ProgressBar";
import { ButtonIconBackground } from "../../../shared/ui/button/ButtonIcon/types";

interface Props {
  image: GalleryImage;
  onDelete: (id: string, loadState: FileLoadState) => void;
}

export function ImagesListItem({ image, onDelete }: Props): JSX.Element {
  return (
    <div className={classes.imagesListItem}>
      <ButtonIcon
        onClick={() => console.log("dnd")}
        iconName={IconName.DragAndDrop}
        size={UiSize.MediumAdaptive}
        color="white"
        background={ButtonIconBackground.Transparent}
      />
      <div className={classes.imagesListItem__image}>
        <ImageSnap element={image} />
      </div>
      <div className={classes.imagesListItem__progressBar}>
        <ProgressBar percent={image.loadState} />
      </div>
      <ButtonIcon
        onClick={() => onDelete(image.id, image.loadState)}
        iconName={IconName.Close}
        size={UiSize.MediumAdaptive}
        color="white"
      />
    </div>
  );
}
