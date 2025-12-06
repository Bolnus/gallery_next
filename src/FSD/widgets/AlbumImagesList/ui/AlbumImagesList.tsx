"use client";
import React from "react";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import classes from "./AlbumImagesList.module.scss";
import { FileLoadState, GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { ImagesListItem } from "./ImagesListItem";

interface Props {
  images: GalleryImage[];
  deleteDisabled?: boolean;
  onDelete: (id: string, loadState: FileLoadState) => void;
  onCancel: (id: string) => void;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
}

export function AlbumImagesList({
  images,
  onDelete,
  onCancel,
  deleteDisabled,
  moveImage
}: Readonly<Props>): JSX.Element {
  return (
    <DndProvider options={HTML5toTouch}>
      <div className={classes.galleryContents}>
        <div className={classes.imagesList}>
          {images.map((image, index) => (
            <ImagesListItem
              image={image}
              key={image.id}
              deleteDisabled={deleteDisabled}
              onDelete={onDelete}
              onCancel={onCancel}
              moveImage={moveImage}
              index={index}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
