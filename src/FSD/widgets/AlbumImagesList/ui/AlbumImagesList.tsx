"use client";
import React from "react";
import classes from "./AlbumImagesList.module.scss";
import { FileLoadState, GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { ImagesListItem } from "./ImagesListItem";

interface Props {
  images: GalleryImage[];
  deleteDisabled?: boolean;
  onDelete: (id: string, loadState: FileLoadState) => void;
  onCancel: (id: string) => void;
}

export function AlbumImagesList({ images, onDelete, onCancel, deleteDisabled }: Props): JSX.Element {
  return (
    <div className={classes.galleryContents}>
      <div className={classes.imagesList}>
        {images.map((image) => (
          <ImagesListItem
            image={image}
            onDelete={onDelete}
            onCancel={onCancel}
            key={image.id}
            deleteDisabled={deleteDisabled}
          />
        ))}
      </div>
    </div>
  );
}
