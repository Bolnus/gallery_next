"use client";
import React from "react";
import classes from "./AlbumsSearchPage.module.scss";
import { AlbumsListSorting } from "../../../shared/lib/common/galleryTypes";
import { useDebounce } from "../../../shared/lib/hooks/useDebounce";
import { MultiValue } from "react-select";
import { SelectOption } from "../../../shared/ui/input/Select/types";
import { MultiSelect } from "../../../shared/ui/input/Select/MultiSelect";
import {
  mapDefinedTagsToOptions,
  mapOptionToLabel,
  mapValueToOption,
  onTagsFocus
} from "../../../shared/lib/common/commonUtils";
import { TextInput } from "../../../shared/ui/input/TextInput/TextInput";
import { useRouterSearchParams } from "../../../shared/lib/hooks/useRouterSearchParams";
import { useSearchName } from "../../../app/lib/context/useSearchName";
import { DEFAULT_PAGE_SIZE, NAME_PARAM, PAGE_PARAM, SIZE_PARAM, SORT_PARAM, TAGS_PARAM } from "../consts/consts";
import { useQuery } from "react-query";
import { getAllTagsError, getAllTagsQuery } from "../../../shared/api/tags/tagsApi";
import { getAlbumsListError, getAlbumsListQuery } from "../../../shared/api/albumsList/albumsListApi";
import { AlbumsList } from "../../../widgets/AlbumListItem/ui/AlbumsList";
import {
  getSortingIconOptions,
  getSortingTypeFromString,
  mapIconOptionToSortingType,
  mapSortingTypeToIconOption
} from "../lib/utils";
import { IconSelect } from "../../../shared/ui/input/Select/IconSelect";

function changeSearchName(
  setSearchName: (str: string) => void,
  setPageNumber: (newPage: number) => void,
  newValue: string
) {
  setPageNumber(1);
  setSearchName(newValue);
}

/** Set page number */
function onPageSelect(setPageChanged: (flag: boolean) => void, newPage: number, prevPage: number): number {
  if (newPage !== prevPage) {
    setPageChanged(true);
  }
  return newPage;
}

export function AlbumsSearchPage(): JSX.Element {
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = React.useState<AlbumsListSorting>(AlbumsListSorting.none);
  const [selectedTags, setSelectedTags] = React.useState<readonly SelectOption[]>([]);
  const [globalSearchName, setGlobalSearchName] = useSearchName();
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
    queryFn: () => getAlbumsListQuery(debouncedSearchParams || undefined),
    onError: getAlbumsListError,
    refetchOnWindowFocus: false
  });
  const totalCount = albumsWithTotal?.totalCount || 0;
  const albums = albumsWithTotal?.albumsList;
  const isFetching = pageChanged || albumsListLoading;

  React.useEffect(() => {
    setPageChanged(false);
  }, [debouncedSearchParams]);

  React.useEffect(() => {
    setSearchName(globalSearchName);
    setSelectedTags([]);
    setPageNumber(1);
    // listBoxRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [globalSearchName]);

  React.useEffect(() => {
    return () => {
      setGlobalSearchName("");
    };
  }, [setGlobalSearchName]);

  /** Init state hooks with query params */
  React.useEffect(() => {
    const newPage = searchParams?.get(PAGE_PARAM);
    const newPageSize = searchParams?.get(SIZE_PARAM);
    const tagsStr = searchParams?.get(TAGS_PARAM);
    const nameStr = searchParams?.get(NAME_PARAM);
    const sorting = searchParams?.get(SORT_PARAM);
    if (newPage) {
      setPageNumber(Math.round(Number(newPage)));
    } else {
      setPageNumber(1);
    }
    if (newPageSize) {
      setPageSize(Math.round(Number(newPageSize)));
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
    setSortBy(getSortingTypeFromString(sorting));
  }, []);

  /** Update query params based on state variables */
  React.useEffect(() => {
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
    if (sortBy) {
      newSearchParams.set(SORT_PARAM, sortBy);
    } else {
      newSearchParams.delete(SORT_PARAM);
    }
    newSearchParams.set(PAGE_PARAM, String(pageNumber));
    newSearchParams.set(SIZE_PARAM, String(pageSize));

    setSearchParams(newSearchParams);
  }, [selectedTags, setSearchParams, pageNumber, pageSize, searchName, sortBy]);

  const onTagsSelectionChange = React.useCallback(
    (newValue: MultiValue<SelectOption>) => {
      setPageNumber(1);
      setSelectedTags(newValue);
    },
    [setPageNumber, setSelectedTags]
  );

  return (
    <AlbumsList
      isFetching={isFetching}
      onPageSelect={(newPage) => setPageNumber((prev) => onPageSelect(setPageChanged, newPage, prev))}
      albums={albums}
      totalCount={totalCount}
      pageNumber={pageNumber}
      pageSize={pageSize}
      key={globalSearchName}
    >
      <div className={`${classes.searchBlock} ${classes.scrollBox_itemWrapper}`}>
        <div className={`${classes.searchInputsWrapper}`}>
          <TextInput
            className={classes.searchInput}
            value={searchName}
            onChange={(newValue: string) => changeSearchName(setSearchName, setPageNumber, newValue)}
            isClearable
          />
          <div className={classes.listBoxSpacer} />
          <IconSelect
            iconOptions={getSortingIconOptions()}
            value={mapSortingTypeToIconOption(sortBy)}
            onChange={(option) => setSortBy(mapIconOptionToSortingType(option))}
          />
        </div>
        <div className={`${classes.inputWrapper}`}>
          <MultiSelect
            options={searchTags?.length ? searchTags.map(mapDefinedTagsToOptions) : []}
            value={selectedTags}
            onChange={onTagsSelectionChange}
            onFocus={() => onTagsFocus(setTagsFocused)}
            isClearable
            className="reactSelectTags"
            placeholder="Tags..."
            isLoading={searchTagsLoading}
          />
        </div>
      </div>
    </AlbumsList>
  );
}
