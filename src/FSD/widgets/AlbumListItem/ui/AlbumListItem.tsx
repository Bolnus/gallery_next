"use client";
import React from "react";
import Link from "next/link";
import classes from "./AlbumsListItem.module.scss";
import { Album, GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { ImageSnap } from "../../../shared/ui/image/ImageSnap/ImageSnap";
import { mapTags } from "../../../shared/ui/tags/Tag";
import { useCurrentAlbumId } from "../../../app/lib/context/useCurrentAlbumId";

interface AlbumListItemProps {
  album: Album;
  isCurrent: boolean;
}

const monthDict = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sen", "oct", "nov", "dec"];

function getBriefDate(timeT: string): string {
  const currentDate = new Date();
  const pendingDate = new Date(timeT);
  let briefDate = "";
  if (currentDate.toLocaleDateString() === pendingDate.toLocaleDateString()) {
    briefDate = "today";
  } else {
    briefDate = `${pendingDate.getDate()} ${monthDict[pendingDate.getMonth()]}`;
  }
  if (currentDate.getFullYear() !== pendingDate.getFullYear()) {
    briefDate = `${briefDate} ${pendingDate.getFullYear()}`;
  }

  return briefDate;
}

function mapImages(albumId: string, element: GalleryImage): JSX.Element {
  return <ImageSnap albumId={albumId} element={element} key={element.id} />;
}

function onAlbumClick(setCurrentAlbumId: (id: string) => void, albumId: string) {
  setCurrentAlbumId(albumId);
}

function AlbumListItemInternal({ album, isCurrent }: AlbumListItemProps, ref: React.ForwardedRef<HTMLDivElement>) {
  const [, setCurrentAlbumId] = useCurrentAlbumId();

  return (
    <div className={classes.scrollBox_itemWrapper} onClick={onAlbumClick.bind(null, setCurrentAlbumId, album.id)}>
      <Link href={`/album/${album.id}`} className={classes.navLink}>
        <div ref={ref} className={`${classes.albumBlock} ${isCurrent ? classes.albumBlock_current : ""}`}>
          <div className={classes.albumBlock__picturesSnap}>{album.snapImages.map(mapImages.bind(null, album.id))}</div>
          <div className={classes.albumBlock__contents}>
            <div className={classes.albumBlock__header}>
              <span className={`${classes.albumBlock__name} ${isCurrent ? classes.albumBlock__name_current : ""}`}>
                {album.albumName}
              </span>
              <span className={classes.albumBlock__time}>{getBriefDate(album.changedDate)}</span>
            </div>
            <div className={classes.albumBlock__tags}>{album.tags.map(mapTags)}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export const AlbumListItem = React.forwardRef(AlbumListItemInternal);
