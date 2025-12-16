"use client";
import NextImage from "next/image";
import React from "react";
import { SkeletonLoader } from "../../icons/SkeletonLoader/SkeletonLoader";
import { FileLoadState, GalleryImage } from "../../../lib/common/galleryTypes";
import classes from "./ImageSnap.module.scss";
import { getUnitedClassnames } from "../../../lib/common/commonUtils";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

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

function onLoad(setLocalLoadState: (state: FileLoadState) => void) {
  setLocalLoadState(FileLoadState.downloaded);
}

function initNewTry(
  retryCountRef: React.MutableRefObject<number>,
  setLocalLoadState: (state: FileLoadState) => void,
  setLocalSrc: (str: string) => void,
  newSrc: string
) {
  retryCountRef.current += 1;
  setLocalLoadState(FileLoadState.downloading);
  setLocalSrc(newSrc);
}

export function ImageSnap({ element, onClick }: Readonly<OwnProps>): JSX.Element {
  const [localLoadState, setLocalLoadState] = React.useState<FileLoadState>(element.loadState);
  const loading = localLoadState !== FileLoadState.uploaded && localLoadState !== FileLoadState.downloaded;
  const [localSrc, setLocalSrc] = React.useState(element.url);
  const retryCountRef = React.useRef(0);

  React.useEffect(() => {
    let timeOutId: ReturnType<typeof setTimeout>;
    if (localLoadState === FileLoadState.downloadFailed && retryCountRef.current < MAX_RETRIES) {
      timeOutId = setTimeout(
        () =>
          initNewTry(
            retryCountRef,
            setLocalLoadState,
            setLocalSrc,
            `${element.url}&retry=${retryCountRef.current + 1}`
          ),
        RETRY_DELAY_MS
      );
    }
    return () => timeOutId && clearTimeout(timeOutId);
  }, [localLoadState, element.url]);

  return (
    <div className={classes.imageWrapper} onClick={() => onImageClick(element.id, onClick)}>
      {loading ? (
        <div
          className={getUnitedClassnames([
            classes.loaderWrapper,
            loading ? classes.loaderWrapper_loading : classes.loaderWrapper_loaded
          ])}
        >
          <SkeletonLoader isSharp />
        </div>
      ) : null}
      {element.url ? (
        <NextImage
          className={getUnitedClassnames([classes.image])}
          alt={element.name || ""}
          onError={() => onError(setLocalLoadState)}
          onLoad={() => onLoad(setLocalLoadState)}
          src={localSrc || ""}
          loading="lazy"
          fill
          sizes="(min-width: 2300px) 42vw, (min-width: 1380px)
          calc(6.44vw + 811px), (min-width: 720px) calc(63.44vw + 37px), 90vw"
          quality="50"
          // layout="responsive" // Recommended for grids
          // objectFit="cover" // Adjust as needed
        />
      ) : (
        <div className={getUnitedClassnames([classes.image, classes.image_geometry])} />
      )}
    </div>
  );
}
