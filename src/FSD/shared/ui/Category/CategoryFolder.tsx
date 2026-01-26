"use client";
import NextImage from "next/image";
import classes from "./CategoryFolder.module.scss";
import defaultImage from "../image/greyRect.svg";
import { AlbumsCategory, FileLoadState } from "../../lib/common/galleryTypes";
import { getUnitedClassnames } from "../../lib/common/commonUtils";
import { useImageSrc } from "../../lib/hooks/useImgSrc";
import { SkeletonLoader } from "../icons/SkeletonLoader/SkeletonLoader";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface Props {
  category: AlbumsCategory;
  isLoading?: boolean;
}

export function CategoryFolder({ category, isLoading }: Readonly<Props>): JSX.Element {
  const { tagName, coverSnap, albumsCount } = category;
  const { localSrc, setLocalLoadState } = useImageSrc({
    url: coverSnap.url,
    startLoadState: coverSnap.loadState
  });

  return (
    <div className={getUnitedClassnames([classes.categoryCard, isLoading ? classes.categoryCard_loading : ""])}>
      <NextImage
        className={getUnitedClassnames([classes.categoryCard__img])}
        alt={coverSnap.name || ""}
        onError={() => setLocalLoadState(FileLoadState.downloadFailed)}
        onLoad={() => setLocalLoadState(FileLoadState.downloaded)}
        src={isLoading ? (defaultImage as StaticImport) : localSrc}
        loading="lazy"
        fill
        sizes="(min-width: 2300px) 42vw, (min-width: 1380px)
          calc(6.44vw + 811px), (min-width: 720px) calc(63.44vw + 37px), 90vw"
        quality="50"
      />
      <div className={classes.cardContent}>
        <h3 className={isLoading ? classes.categoryName_loading : classes.categoryName}>
          {isLoading ? <SkeletonLoader /> : tagName}
        </h3>
        <p className={isLoading ? classes.itemsCount_loading : classes.itemsCount}>
          {isLoading ? <SkeletonLoader /> : albumsCount}
        </p>
      </div>
    </div>
  );
}
