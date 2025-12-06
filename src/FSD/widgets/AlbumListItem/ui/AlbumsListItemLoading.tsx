"use client";
import React from "react";
import classes from "./AlbumsListItemLoading.module.scss";
import { FileLoadState } from "../../../shared/lib/common/galleryTypes";
import { ImageSnap } from "../../../shared/ui/image/ImageSnap/ImageSnap";
import { getIndexesArray } from "../../../shared/lib/common/commonUtils";
import { SkeletonLoader } from "../../../shared/ui/icons/SkeletonLoader/SkeletonLoader";

function mapImages(pictureId: string): JSX.Element {
  return (
    <ImageSnap
      element={{
        id: pictureId,
        loadState: FileLoadState.downloading
      }}
      key={pictureId}
    />
  );
}

const PICTURE_LOADER_ARRAY = getIndexesArray(6);

export function AlbumListItemLoading(): JSX.Element {
  return (
    <div className={classes.scrollBox_itemWrapper}>
      <div className={classes.albumBlock}>
        <div className={classes.albumBlock__picturesSnap}>{PICTURE_LOADER_ARRAY.map(mapImages)}</div>
        <div className={classes.albumBlock__contents}>
          <div className={classes.albumBlock__header}>
            <span className={classes.albumBlock__name}>
              <SkeletonLoader />
            </span>
            <span className={classes.albumBlock__time}>
              <SkeletonLoader />
            </span>
          </div>
          <div className={classes.albumBlock__tags}>
            <span className={classes.albumBlock__time}>
              <SkeletonLoader />
            </span>
            <span className={classes.albumBlock__time}>
              <SkeletonLoader />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
