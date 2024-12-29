"use client";
import NextImage from "next/image";
import React from "react";
import { SkeletonLoader } from "../../icons/SkeletonLoader/SkeletonLoader";
import { FileLoadState, GalleryImage } from "../../../lib/common/galleryTypes";
import classes from "./ImageSnap.module.scss";
import { getUnitedClassnames } from "../../../lib/common/commonUtils";

export interface OwnProps {
  element: GalleryImage;
  albumId?: string;
  // onError?: () => void;
  onClick?: (id: string) => void;
}

function onImageClick(id: string, onClick?: (id: string) => void) {
  if (onClick) {
    onClick(id);
  }
}

function onError(setLocalLoadState: (state: FileLoadState) => void) {
  setLocalLoadState(FileLoadState.downloadFailed);
}

function onLoad(setLocalLoadState: (state: FileLoadState) => void, localEvent: React.SyntheticEvent<HTMLImageElement>) {
  setLocalLoadState(FileLoadState.downloaded);
}

export function ImageSnap({ element, onClick }: OwnProps) {
  const [localLoadState, setLocalLoadState] = React.useState<FileLoadState>(element.loadState);
  const loading = localLoadState !== FileLoadState.uploaded && localLoadState !== FileLoadState.downloaded;

  return (
    <div className={classes.imageWrapper} onClick={() => onImageClick(element.id, onClick)}>
      <div
        className={getUnitedClassnames([
          classes.loaderWrapper,
          loading ? classes.loaderWrapper_loading : classes.loaderWrapper_loaded
        ])}
      >
        <SkeletonLoader isSharp />
      </div>
      {element.url ? (
        <NextImage
          className={getUnitedClassnames([classes.image, classes.image_geometry])}
          alt={element.name || ""}
          onError={() => onError(setLocalLoadState)}
          onLoad={(localEvent: React.SyntheticEvent<HTMLImageElement>) => onLoad(setLocalLoadState, localEvent)}
          src={element.url || ""}
          loading="lazy"
          fill
          sizes="99vw"
        />
      ) : (
        <div className={getUnitedClassnames([classes.image, classes.image_geometry])} />
      )}
    </div>
  );
}
