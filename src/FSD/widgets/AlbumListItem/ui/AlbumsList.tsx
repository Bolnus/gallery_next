"use client";
import React, { PropsWithChildren } from "react";
import { useCurrentAlbumId } from "../../../app/lib/context/useCurrentAlbumId";
import { Album } from "../../../shared/lib/common/galleryTypes";
import classes from "./AlbumsList.module.scss";
import { ALBUM_ITEM_LOADER_ARRAY } from "../../../pages/albumsSearch/consts/consts";
import { mapLoaders } from "../../../pages/albumsSearch/lib/mappers";
import { AlbumListItem } from "./AlbumsListItem";
import { PaginationV2 } from "../../PaginationV2/ui/PaginationV2";

interface Props {
  albums?: Album[];
  isFetching?: boolean;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  onPageSelect: (newPage: number) => void;
}

const halfClientPageSize = 2;

function mapAlbumToBlock(
  scrollAlbumBlockRef: React.RefObject<HTMLDivElement>,
  currentAlbumId: string,
  scrollBlockNumber: number,
  album: Album,
  index: number
) {
  return (
    <AlbumListItem
      album={album}
      isCurrent={album.id === currentAlbumId}
      ref={scrollBlockNumber === index ? scrollAlbumBlockRef : null}
      key={album.id}
    />
  );
}

function scrollToDiv(divBlock: HTMLDivElement | null, smooth = false) {
  if (divBlock) {
    divBlock.scrollIntoView({ block: "nearest", behavior: smooth ? "smooth" : undefined });
    // divBlock = null;
  }
}

/** Set page number */
function selectPage(
  onPageSelect: (newPage: number) => void,
  listBoxRef: React.RefObject<HTMLDivElement>,
  newPage: number
): void {
  listBoxRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  onPageSelect(newPage);
}

export function AlbumsList({
  children,
  albums,
  onPageSelect,
  isFetching,
  totalCount,
  pageNumber,
  pageSize
}: PropsWithChildren<Props>): JSX.Element {
  const scrollAlbumBlockRef = React.useRef<HTMLDivElement>(null);
  const listBoxRef = React.useRef<HTMLDivElement>(null);
  const [scrollBlockNumber, setScrollBlockNumber] = React.useState(-1);
  const [currentAlbumId] = useCurrentAlbumId();

  /** Selected block number update */
  React.useEffect(() => {
    const listBox = listBoxRef.current as HTMLDivElement;
    if (listBox && albums?.length) {
      let nextScrollAlbumIndex = 0;
      let currentAlbumIndex = 0;
      for (let i = 0; i < albums.length; i++) {
        if (albums[i].id === currentAlbumId) {
          currentAlbumIndex = i;
          break;
        }
      }
      if (currentAlbumIndex) {
        if (currentAlbumIndex + halfClientPageSize > albums.length - 1) {
          nextScrollAlbumIndex = albums.length - 1;
        } else {
          nextScrollAlbumIndex = currentAlbumIndex + halfClientPageSize;
        }
      }
      setScrollBlockNumber(nextScrollAlbumIndex);
    }
  }, [listBoxRef, albums, currentAlbumId]);

  /** Scroll to selected block after page inited */
  React.useLayoutEffect(() => {
    if (listBoxRef.current) {
      scrollToDiv(scrollAlbumBlockRef.current);
    }
  }, [scrollAlbumBlockRef, listBoxRef]);

  return (
    <div className="main__scrollWrapper">
      <div className="main__page" ref={listBoxRef}>
        {children}
        {albums?.length ? (
          <PaginationV2
            albumsCount={totalCount}
            page={pageNumber}
            pageSize={pageSize}
            onPageSelect={(newPage) => selectPage(onPageSelect, listBoxRef, newPage)}
            loadedAlbumsNumber={albums.length}
            isFetching={isFetching}
          />
        ) : null}
        {albums?.length
          ? albums.map((album: Album, index: number) =>
              mapAlbumToBlock(scrollAlbumBlockRef, currentAlbumId, scrollBlockNumber, album, index)
            )
          : null}
        {!albums?.length && isFetching ? ALBUM_ITEM_LOADER_ARRAY.map(mapLoaders) : null}
        {!albums?.length && !isFetching ? (
          <div className={`${classes.albumBlock} ${classes.scrollBox_itemWrapper}`} key="last">
            <div className="emptyComment">Not found</div>
          </div>
        ) : null}
        {albums?.length ? (
          <PaginationV2
            albumsCount={totalCount}
            page={pageNumber}
            pageSize={pageSize}
            onPageSelect={(newPage) => selectPage(onPageSelect, listBoxRef, newPage)}
            loadedAlbumsNumber={albums.length}
            isFetching={isFetching}
          />
        ) : null}
      </div>
    </div>
  );
}
