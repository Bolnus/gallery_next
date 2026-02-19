"use client";
import React from "react";
import classes from "./AlbumsListItem.module.scss";
import { Album, GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { ImageSnap } from "../../../shared/ui/image/ImageSnap/ImageSnap";
import { Tag } from "../../../shared/ui/tags/Tag";
import { useCurrentAlbumId } from "../../../app/lib/context/useCurrentAlbumId";
import { useTranslations } from "next-intl";
import { Link } from "../../../../app/navigation";
import { getBriefDate } from "../../../shared/lib/common/translations";

interface AlbumListItemProps {
  album: Album;
  isCurrent: boolean;
}

function onAlbumClick(setCurrentAlbumId: (id: string) => void, albumId: string) {
  setCurrentAlbumId(albumId);
}

function AlbumListItemInternal({ album, isCurrent }: AlbumListItemProps, ref: React.ForwardedRef<HTMLDivElement>) {
  const [, setCurrentAlbumId] = useCurrentAlbumId();
  const intl = useTranslations("Months");

  return (
    <div className={classes.scrollBox_itemWrapper} onClick={() => onAlbumClick(setCurrentAlbumId, album.id)}>
      <Link href={`/album/${album.id}`} className={classes.navLink}>
        <div ref={ref} className={`${classes.albumBlock} ${isCurrent ? classes.albumBlock_current : ""}`}>
          <div className={classes.albumBlock__picturesSnap}>
            {album.snapImages.map((element: GalleryImage) => (
              <ImageSnap albumId={album.id} element={element} key={element.id} />
            ))}
          </div>
          <div className={classes.albumBlock__contents}>
            <div className={classes.albumBlock__header}>
              <span className={`${classes.albumBlock__name} ${isCurrent ? classes.albumBlock__name_current : ""}`}>
                {album.albumName}
              </span>
              <span className={classes.albumBlock__time}>{getBriefDate(album.changedDate, intl)}</span>
            </div>
            <div className={classes.albumBlock__tags}>
              {album.tags.map((tag) => (
                <Tag {...tag} key={tag.id} />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export const AlbumListItem = React.forwardRef(AlbumListItemInternal);
