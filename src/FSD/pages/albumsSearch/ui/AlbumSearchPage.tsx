"use client";
import React from "react";
import classes from "./AlbumsSearchPage.module.scss";
import { AlbumListItem } from "../../../widgets/AlbumListItem/ui/AlbumListItem";
import { Album } from "../../../shared/lib/common/galleryTypes";
import { useDebounce } from "../../../shared/lib/hooks/useDebounce";
import { MultiValue } from "react-select";
import { SelectOption } from "../../../shared/ui/input/Select/types";
import { MultiSelect } from "../../../shared/ui/input/Select/MultiSelect";
import {
  getIndexesArray,
  mapDefinedTagsToOptions,
  mapOptionToLabel,
  mapValueToOption,
  onTagsFocus
} from "../../../shared/lib/common/commonUtils";
import { Pagination } from "../../../widgets/Pagination/ui/Pagination";
import { TextInput } from "../../../shared/ui/input/TextInput/TextInput";
import { useRouterSearchParams } from "../../../shared/lib/hooks/useRouterSearchParams";
import { useSearchName } from "../../../app/lib/context/useSearchName";
import {
  ALBUM_ITEM_LOADER_ARRAY,
  DEFAULT_PAGE_SIZE,
  NAME_PARAM,
  PAGE_PARAM,
  SIZE_PARAM,
  TAGS_PARAM
} from "../consts/consts";
import { useQuery } from "react-query";
import { getAllTagsError, getAllTagsQuery } from "../../../shared/api/tags/tagsApi";
import { getAlbumsListError, getAlbumsListQuery } from "../../../shared/api/albumsList/albumsListApi";
import { useCurrentAlbumId } from "../../../app/lib/context/useCurrentAlbumId";
import { AlbumListItemLoading } from "../../../widgets/AlbumListItem/ui/AlbumListItemLoading";
import { mapLoaders } from "../lib/mappers";

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

function changeSearchName(
  setSearchName: (str: string) => void,
  setPageNumber: (newPage: number) => void,
  newValue: string
) {
  setPageNumber(1);
  setSearchName(newValue);
}

export function AlbumsSearchPage() {
  const scrollAlbumBlockRef = React.useRef<HTMLDivElement>(null);
  const listBoxRef = React.useRef<HTMLDivElement>(null);
  const [scrollBlockNumber, setScrollBlockNumber] = React.useState(-1);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [selectedTags, setSelectedTags] = React.useState<readonly SelectOption[]>([]);
  const [globalSearchName, setGlobalSearchName] = useSearchName();
  const [currentAlbumId] = useCurrentAlbumId();
  const [searchName, setSearchName] = React.useState("");
  const [searchParams, setSearchParams] = useRouterSearchParams();
  const debouncedSearchParams = useDebounce<URLSearchParams | null>(searchParams, 1000);
  const [tagsFocused, setTagsFocused] = React.useState(false);
  const [pageChanged, setPageChanged] = React.useState(false);

  const { data: searchTags, isLoading: searchTagsLoading } = useQuery({
    queryKey: "get-tags",
    queryFn: getAllTagsQuery,
    onError: getAllTagsError,
    enabled: tagsFocused
  });

  const { data: albumsWithTotal, isLoading: albumsListLoading } = useQuery({
    queryKey: ["get-albums-list-search", debouncedSearchParams?.toString()],
    queryFn: getAlbumsListQuery.bind(null, debouncedSearchParams || undefined),
    onError: getAlbumsListError
  });
  const totalCount = albumsWithTotal?.totalCount || 0;
  const albums = albumsWithTotal?.albumsList;
  const isFetching = pageChanged || albumsListLoading;

  React.useEffect(function() {
    setPageChanged(false);
  }, [debouncedSearchParams]);

  React.useEffect(
    function () {
      setSearchName(globalSearchName);
      setSelectedTags([]);
      setPageNumber(1);
      listBoxRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    },
    [globalSearchName]
  );

  React.useEffect(
    function () {
      return function () {
        setGlobalSearchName("");
      };
    },
    [setGlobalSearchName]
  );

  /** Selected block number update */
  React.useEffect(
    function () {
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
    },
    [listBoxRef, albums, currentAlbumId]
  );

  /** Scroll to selected block after page inited */
  React.useLayoutEffect(
    function () {
      if (listBoxRef.current) {
        scrollToDiv(scrollAlbumBlockRef.current);
      }
    },
    [scrollAlbumBlockRef.current, listBoxRef.current]
  );

  /** Init state hooks with query params */
  React.useEffect(function () {
    const newPage = searchParams?.get(PAGE_PARAM);
    const newPageSize = searchParams?.get(SIZE_PARAM);
    const tagsStr = searchParams?.get(TAGS_PARAM);
    const nameStr = searchParams?.get(NAME_PARAM);
    if (newPage) {
      setPageNumber(Number(newPage));
    } else {
      setPageNumber(1);
    }
    if (newPageSize) {
      setPageSize(Number(newPageSize));
    } else {
      setPageSize(DEFAULT_PAGE_SIZE);
    }
    if (tagsStr) {
      const tagsArray = tagsStr.split(",");
      setSelectedTags(tagsArray.map(mapValueToOption));
    } else {
      setSelectedTags([]);
    }
    if (nameStr) {
      setSearchName(nameStr);
    } else {
      setSearchName("");
    }
  }, []);

  /** Update query params based on state variables */
  React.useEffect(
    function () {
      const newSearchParams = new URLSearchParams();
      if (!selectedTags.length) {
        newSearchParams.delete(TAGS_PARAM);
      } else {
        const tagsStr = selectedTags.map(mapOptionToLabel).join(",");
        newSearchParams.set(TAGS_PARAM, tagsStr);
      }
      if (!searchName) {
        newSearchParams.delete(NAME_PARAM);
      } else {
        newSearchParams.set(NAME_PARAM, searchName);
      }
      newSearchParams.set(PAGE_PARAM, String(pageNumber));
      newSearchParams.set(SIZE_PARAM, String(pageSize));

      setSearchParams(newSearchParams);
    },
    [selectedTags, setSearchParams, pageNumber, pageSize, searchName]
  );

  /** Set page number */
  const onPageSelect = React.useCallback(
    function (newPage: number) {
      setPageNumber(newPage);
      if (newPage !== pageNumber) {
        setPageChanged(true);
      }
      listBoxRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setPageNumber, listBoxRef, pageNumber]
  );

  const onTagsSelectionChange = React.useCallback(
    function (newValue: MultiValue<SelectOption>) {
      setPageNumber(1);
      setSelectedTags(newValue);
    },
    [setPageNumber, setSelectedTags]
  );

  return (
    <div className={`${classes.albumsListPage}`}>
      <div className={classes.scrollBox} ref={listBoxRef}>
        <div className={`${classes.searchBlock} ${classes.scrollBox_itemWrapper}`}>
          <div className={`${classes.inputWrapper}`}>
            <TextInput
              value={searchName}
              onChange={changeSearchName.bind(null, setSearchName, setPageNumber)}
              isClearable
            />
          </div>
          <div className={`${classes.inputWrapper}`}>
            <MultiSelect
              options={searchTags?.length ? searchTags.map(mapDefinedTagsToOptions) : []}
              value={selectedTags}
              onChange={onTagsSelectionChange}
              onFocus={onTagsFocus.bind(null, setTagsFocused)}
              isClearable
              className="reactSelectTags"
              placeholder="Tags..."
              isLoading={searchTagsLoading}
            />
          </div>
        </div>
        {albums?.length ? (
          <Pagination
            albumsCount={totalCount}
            page={pageNumber}
            pageSize={pageSize}
            onPageSelect={onPageSelect}
            loadedAlbumsNumber={albums.length}
            isFetching={isFetching}
          />
        ) : null}
        {albums?.length
          ? albums.map(mapAlbumToBlock.bind(null, scrollAlbumBlockRef, currentAlbumId, scrollBlockNumber))
          : null}
        {!albums?.length && isFetching ? ALBUM_ITEM_LOADER_ARRAY.map(mapLoaders) : null}
        {!albums?.length && !isFetching ? (
          <div className={`${classes.albumBlock} ${classes.scrollBox_itemWrapper}`} key="last">
            <div className="emptyComment">Not found</div>
          </div>
        ) : null}
        {albums?.length ? (
          <Pagination
            albumsCount={totalCount}
            page={pageNumber}
            pageSize={pageSize}
            onPageSelect={onPageSelect}
            loadedAlbumsNumber={albums.length}
            isFetching={isFetching}
          />
        ) : null}
      </div>
    </div>
  );
}
