"use client";
import React from "react";
import classes from "./AlbumsSearchPage.module.scss";
import { AlbumListItem } from "../../../widgets/AlbumListItem/ui/AlbumListItem";
import { Album } from "../../../shared/lib/common/galleryTypes";
import { StoreProvider } from "../../../appFSD/lib/redux/StoreProvider";
import { useAppDispatch, useTypedSelector } from "../../../appFSD/lib/redux/reduxStore";
import { useDebounce } from "../../../shared/lib/hooks/useDebounce";
import { MultiValue } from "react-select";
import { SelectOption } from "../../../shared/ui/input/Select/types";
import { MultiSelect } from "../../../shared/ui/input/Select/MultiSelect";
import { mapDefinedTagsToOptions, mapOptionToLabel, mapValueToOption } from "../../../shared/lib/common/commonUtils";
import { Pagination } from "../../../widgets/Pagination/ui/Pagination";
import { TextInput } from "../../../shared/ui/input/TextInput/TextInput";
import { getAlbumsListTC, getSearchTagsTC, setIsFetching } from "../../../entities/albumsList/model/albumsListSlice";
import { useRouterSearchParams } from "../../../shared/lib/hooks/useRouterSearchParams";
import { SkeletonLoader } from "../../../shared/ui/icons/SkeletonLoader/SkeletonLoader";
import { useSearchName } from "../../../shared/lib/hooks/useSearchName";

const halfClientPageSize = 2;
const PAGE_PARAM = "page";
const SIZE_PARAM = "size";
const TAGS_PARAM = "tags";
const NAME_PARAM = "name";
const DEFAULT_PAGE_SIZE = 30;

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

function AlbumsSearchPageInternal() {
  const dispatch = useAppDispatch();
  const albums = useTypedSelector((state) => state.albumsList.albums);
  const currentAlbumId = useTypedSelector((state) => state.album.currentAlbumId);
  const totalCount = useTypedSelector((state) => state.albumsList.totalCount);
  const searchTags = useTypedSelector((state) => state.albumsList.searchTags);
  const isFetching = useTypedSelector((state) => state.albumsList.isFetching);
  const scrollAlbumBlockRef = React.useRef<HTMLDivElement>(null);
  const listBoxRef = React.useRef<HTMLDivElement>(null);
  const [scrollBlockNumber, setScrollBlockNumber] = React.useState(-1);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [selectedTags, setSelectedTags] = React.useState<readonly SelectOption[]>([]);
  const [globalSearchName, setGlobalSearchName] = useSearchName();
  const [searchName, setSearchName] = React.useState("");
  const [searchParams, setSearchParams] = useRouterSearchParams();
  const debouncedSearchParams = useDebounce<URLSearchParams | null>(searchParams, 1000);

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
      if (listBox) {
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

  /** Fetch albums list on query params update */
  React.useEffect(
    function () {
      dispatch(getAlbumsListTC(debouncedSearchParams || undefined));
      // .then(function()
      // {
      //   scrollToDiv(scrollAlbumBlockRef.current, true);
      // });
    },
    [debouncedSearchParams, dispatch]
  );

  /** Init available tags list */
  React.useEffect(
    function () {
      dispatch(getSearchTagsTC());
    },
    [dispatch]
  );

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
        dispatch(setIsFetching(true));
      }
      listBoxRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setPageNumber, dispatch, listBoxRef, pageNumber]
  );

  const albumBlockComponents = albums.map(
    mapAlbumToBlock.bind(null, scrollAlbumBlockRef, currentAlbumId, scrollBlockNumber)
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
              options={searchTags.map(mapDefinedTagsToOptions)}
              value={selectedTags}
              onChange={onTagsSelectionChange}
              isClearable
              className="reactSelectTags"
              placeholder="Tags..."
            />
          </div>
        </div>
        {albums.length ? (
          <Pagination
            albumsCount={totalCount}
            page={pageNumber}
            pageSize={pageSize}
            onPageSelect={onPageSelect}
            loadedAlbumsNumber={albums.length}
            isFetching={isFetching}
          />
        ) : null}
        {albumBlockComponents}
        {albumBlockComponents?.length ? null : (
          <div
            className={`${classes.albumBlock} ${classes.scrollBox_itemWrapper}`}
            // ref={taskBlockLoaderRef}
            key="last"
          >
            {isFetching ? (
              <div>
                <SkeletonLoader />
              </div>
            ) : (
              <div className="emptyComment">Not found</div>
            )}
          </div>
        )}
        {albums.length ? (
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

export function AlbumsSearchPage(): JSX.Element {
  return (
    <StoreProvider>
      <AlbumsSearchPageInternal />
    </StoreProvider>
  );
}
