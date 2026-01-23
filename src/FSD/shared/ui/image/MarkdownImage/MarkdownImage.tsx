"use client";
import React from "react";
import NextImage from "next/image";
import { sanitizeImgSrc } from "../../../lib/sanitizer/sanitizeUrl";
import classes from "./MarkdownImage.module.scss";
import { useImageSrc } from "../../../lib/hooks/useImgSrc";
import { FileLoadState } from "../../../lib/common/galleryTypes";

interface Props {
  url?: string;
}

export function MarkdownImage({ url }: Readonly<Props>): JSX.Element {
  const { localSrc, setLocalLoadState } = useImageSrc({
    url,
    startLoadState: FileLoadState.downloading
  });

  return (
    <NextImage
      src={sanitizeImgSrc(localSrc) || ""}
      quality="50"
      loading="lazy"
      fill
      sizes="(min-width: 2300px) 42vw, (min-width: 1380px)
                  calc(6.44vw + 811px), (min-width: 720px) calc(63.44vw + 37px), 90vw"
      alt="incorrect image url"
      className={classes.markdownImage}
      onError={() => setLocalLoadState(FileLoadState.downloadFailed)}
    />
  );
}
