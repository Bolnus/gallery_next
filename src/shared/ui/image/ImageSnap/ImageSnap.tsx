"use client";
import NextImage from "next/image";
import React from "react";
import { SkeletonLoader } from "../../icons/SkeletonLoader/SkeletonLoader";
import { FileLoadState, GalleryImage } from "../../../lib/common/galleryTypes";
import classes from "./ImageSnap.module.scss";

export interface OwnProps {
  element: GalleryImage;
  albumId: string;
  onError?: () => void;
}

// function onSnapImageError(dispatch: AppDispatch, galleryImage: GalleryImage, albumId: string) {
//   dispatch(
//     updateAlbumSnapLoadState({
//       albumId,
//       image: {
//         ...galleryImage,
//         loadState: FileLoadState.parsingFailed
//       }
//     })
//   );
// }

export function ImageSnap({ element, albumId, onError }: OwnProps) {
  let imgContents: null | JSX.Element = null;

  if (element.loadState === FileLoadState.parsingFailed) {
    imgContents = (
      <div className={classes.imageWrapper}>
        <div className={classes.galleryGrid__loaderWrapper}>
          <SkeletonLoader isSharp />
        </div>
      </div>
    );
  } else {
    imgContents = (
      <>
      {/* <div className={classes.imageContainer}> */}
        {/* <LazyLoadImage
          className={`${classes.image} ${classes.image_geometry}`}
          wrapperClassName={classes.image_geometry}
          alt={element.name}
          onError={onSnapImageError.bind(null, dispatch, element)}
          src={imageUrl}
          onClick={(valueDispatch<string>).bind(null, dispatch, setCurrentViewId, element.id)}
          // placeholder={<SkeletonLoader isSharp />}
          // visibleByDefault
          // placeholderSrc={placeholderSrc}
          effect="blur"
        /> */}
        <NextImage
          className={`${classes.image} ${classes.image_geometry}`}
          alt={element.name || ""}
          onError={onError}
          src={element.url || ""}
          loading="lazy"
          fill
          sizes="99vw"
          // priority
        />
      {/* </div> */}
      </>
    );
  }

  return <div className={classes.imageWrapper}>{imgContents}</div>;
}
