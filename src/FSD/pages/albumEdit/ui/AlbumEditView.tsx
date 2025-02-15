"use client";
import React from "react";
import { AlbumHeader } from "../../../widgets/AlbumHeader/ui/AlbumHeader";
import classes from "./NewAlbumPage.module.scss";
import { Modal, ModalType } from "../../../shared/ui/Modal/Modal";
import { closeModal } from "../../../shared/lib/sharedComponentsUtils/modalUtils";
import { GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { shiftArrayElement } from "../../../shared/lib/common/commonUtils";
import { addImages, deleteImageById } from "../lib/albumEditUtils";
import { AlbumImagesList } from "../../../widgets/AlbumImagesList/ui/AlbumImagesList";
import { AlbumHeaderEdit } from "../../../widgets/AlbumHeader/ui/AlbumHeaderEdit";

interface Props {
  onEditAlbumId?: string;
}

export function AlbumEditView({ onEditAlbumId = "" }: Props): JSX.Element {
  const [newImages, setNewImages] = React.useState<GalleryImage[]>([]);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
  const [albumId, setAlbumId] = React.useState(onEditAlbumId);
  console.log(albumId)

  return (
    <div className={classes.newAlbumPage}>
      <div className={classes.scrollWrapper}>
        <AlbumHeaderEdit
          onAddImages={() => addImages(setNewImages, setErrorMessages)}
          imageCover={newImages?.[0]}
          newImages={newImages}
          albumId={albumId}
          setAlbumId={setAlbumId}
        />
        <AlbumImagesList
          images={newImages}
          onDelete={(id, loadState) => deleteImageById(id, loadState, newImages, setNewImages)}
        />
      </div>
      {errorMessages?.length ? (
        <Modal
          onClose={() => setErrorMessages(shiftArrayElement)}
          header={errorMessages[0]}
          modalType={ModalType.Info}
        />
      ) : null}
    </div>
  );
}
