"use client";
import React from "react";
import classes from "./AlbumImagesList.module.scss";
import { FileLoadState, GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { ImagesListItem } from "./ImagesListItem";

interface Props {
  images: GalleryImage[];
  onDelete: (id: string, loadState: FileLoadState) => void;
}

export function AlbumImagesList({ images, onDelete }: Props): JSX.Element {
  return (
    <div className={classes.galleryContents}>
      <div className={classes.imagesList}>
        {images.map((image) => (
          <ImagesListItem image={image} onDelete={onDelete} key={image.id} />
        ))}
      </div>
    </div>
  );
}
