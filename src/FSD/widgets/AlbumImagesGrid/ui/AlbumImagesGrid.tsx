"use client";
import React from "react";
import { GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { useIntersectionObserver } from "../../../shared/lib/hooks/useIntersectionObserver";
import classes from "./AlbumImagesGrid.module.scss";
import { SkeletonLoader } from "../../../shared/ui/icons/SkeletonLoader/SkeletonLoader";
import { ImageSnap } from "../../../shared/ui/image/ImageSnap/ImageSnap";
import { ImageSlider } from "../../../shared/ui/image/ImageSlider/ui/ImageSlider";

function addLocalImages(snapImages: GalleryImage[], prevState: GalleryImage[]) {
  if (snapImages.length <= prevState.length) {
    return prevState;
  }
  const newLocalImages = [...prevState];
  for (let i = prevState.length; i < prevState.length + 35; i++) {
    if (snapImages?.[i]) {
      newLocalImages.push(snapImages?.[i]);
    } else {
      break;
    }
  }
  return newLocalImages;
}

function mapImages(setCurrentViewId: (id: string) => void, element: GalleryImage): JSX.Element {
  return <ImageSnap element={element} key={element.id} onClick={setCurrentViewId} />;
}

function onClose(setCurrentViewId: (id: string) => void) {
  setCurrentViewId("");
}

interface Props {
  snapImages: GalleryImage[];
  fullImages: GalleryImage[];
  albumName?: string;
  isFetching?: boolean;
}

export function AlbumImagesGrid({ snapImages, isFetching, fullImages, albumName }: Props) {
  const [localImages, setLocalImages] = React.useState<GalleryImage[]>([]);
  const [currentViewId, setCurrentViewId] = React.useState("");
  const imagesLoaderRef = React.useRef<HTMLDivElement>(null);
  const loaderIntersected = useIntersectionObserver(imagesLoaderRef, { root: global.document && document.body });

  React.useEffect(() => {
    if (loaderIntersected) {
      setLocalImages((prevState: GalleryImage[]) => addLocalImages(snapImages, prevState));
    }
  }, [snapImages, loaderIntersected]);

  return (
    <div className={classes.galleryContents}>
      {isFetching || snapImages.length ? (
        <div className={classes.galleryGrid}>
          {localImages.map((element: GalleryImage) => mapImages(setCurrentViewId, element))}
          {snapImages.length > localImages.length ? (
            <div key="last" className={classes.galleryGrid__imageWrapper} ref={imagesLoaderRef}>
              <div className={classes.galleryGrid__imageWrapper}>
                <div className={classes.galleryGrid__loaderWrapper}>
                  <SkeletonLoader isSharp />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="emptyComment">{albumName ? "No images" : "404 Not found"}</div>
      )}
      <ImageSlider
        header={albumName}
        currentViewId={currentViewId}
        onClose={() => onClose(setCurrentViewId)}
        images={fullImages}
      />
    </div>
  );
}
