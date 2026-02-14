"use client";
import React from "react";
import classes from "./AlbumsSearchPage.module.scss";
import { AlbumsListSorting } from "../../../shared/lib/common/galleryTypes";
import { useDebounce, useStateWithDebounced } from "../../../shared/lib/hooks/useDebounce";
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
import { ReadonlyURLSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { IconName } from "../../../shared/ui/icons/ReactIcon/types";

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

function initPageNumber(searchParams: ReadonlyURLSearchParams | null): number {
  const newPage = searchParams?.get(PAGE_PARAM);
  if (newPage) {
    const numPage = Number(newPage);
    return Number.isNaN(numPage) ? 1 : Math.round(numPage);
  }
  return 1;
}

function initPageSize(searchParams: ReadonlyURLSearchParams | null): number {
  const newPageSize = searchParams?.get(SIZE_PARAM);
  if (newPageSize) {
    const numPageSize = Number(newPageSize);
    return Number.isNaN(numPageSize) ? DEFAULT_PAGE_SIZE : Math.round(numPageSize);
  }
  return DEFAULT_PAGE_SIZE;
}

function initTags(searchParams: ReadonlyURLSearchParams | null): SelectOption<string>[] {
  const tagsStr = searchParams?.get(TAGS_PARAM);
  if (tagsStr) {
    const tagsArray = tagsStr.split(",");
    return tagsArray.map(mapValueToOption);
  }
  return [];
}

function initSearchName(searchParams: ReadonlyURLSearchParams | null): string {
  const nameStr = searchParams?.get(NAME_PARAM);
  if (nameStr) {
    return nameStr;
  }
  return "";
}

export function AlbumsSearchPage(): JSX.Element {
  const [searchParams, setSearchParams] = useRouterSearchParams(0);
  const [pageNumber, debouncedPageNumber, setPageNumber] = useStateWithDebounced(
    () => initPageNumber(searchParams),
    1000
  );
  const [pageSize] = React.useState(() => initPageSize(searchParams));
  const [sortBy, debouncedSortBy, setSortBy] = useStateWithDebounced<AlbumsListSorting>(
    () => getSortingTypeFromString(searchParams?.get(SORT_PARAM)),
    1000
  );
  const [selectedTags, debouncedSelectedTags, setSelectedTags] = useStateWithDebounced<readonly SelectOption[]>(
    () => initTags(searchParams),
    1000
  );
  const [globalSearchName, setGlobalSearchName] = useSearchName();
  const [searchName, debouncedSearchName, setSearchName] = useStateWithDebounced(
    () => initSearchName(searchParams),
    1000
  );
  // const searchParams = useDebounce<URLSearchParams | null>(searchParams, 1000);
  const [tagsFocused, setTagsFocused] = React.useState(false);
  const [pageChanged, setPageChanged] = React.useState(false);
  const intl = useTranslations("AlbumsSearchPage");
  const locale = useLocale();
  const debouncedLocale = useDebounce(locale, 500);

  const { data: searchTags, isLoading: searchTagsLoading } = useQuery({
    queryKey: "get-tags",
    queryFn: getAllTagsQuery,
    onError: getAllTagsError,
    enabled: tagsFocused
  });

  const { data: albumsWithTotal, isLoading: albumsListLoading } = useQuery({
    queryKey: ["get-albums-list-search", searchParams?.toString(), debouncedLocale],
    queryFn: () => getAlbumsListQuery(searchParams || undefined),
    onError: getAlbumsListError,
    refetchOnWindowFocus: false
  });
  const totalCount = albumsWithTotal?.totalCount || 0;
  const albums = albumsWithTotal?.albumsList;
  const isFetching = pageChanged || albumsListLoading;

  React.useEffect(() => {
    setPageChanged(false);
  }, [searchParams]);

  React.useEffect(() => {
    if (!globalSearchName) {
      return;
    }
    setSearchName(globalSearchName);
    setSelectedTags([]);
    setPageNumber(1);
    // listBoxRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [globalSearchName, setPageNumber, setSearchName, setSelectedTags]);

  React.useEffect(() => {
    return () => {
      setGlobalSearchName("");
    };
  }, [setGlobalSearchName]);

  /** Update query params based on state variables */
  React.useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (!debouncedSelectedTags.length) {
      newSearchParams.delete(TAGS_PARAM);
    } else {
      const tagsStr = debouncedSelectedTags.map(mapOptionToLabel).join(",");
      newSearchParams.set(TAGS_PARAM, tagsStr);
    }
    if (!debouncedSearchName) {
      newSearchParams.delete(NAME_PARAM);
    } else {
      newSearchParams.set(NAME_PARAM, debouncedSearchName);
    }
    if (debouncedSortBy) {
      newSearchParams.set(SORT_PARAM, debouncedSortBy);
    } else {
      newSearchParams.delete(SORT_PARAM);
    }
    newSearchParams.set(PAGE_PARAM, String(debouncedPageNumber));
    newSearchParams.set(SIZE_PARAM, String(pageSize));

    setSearchParams(newSearchParams as ReadonlyURLSearchParams);
  }, [debouncedSelectedTags, setSearchParams, debouncedPageNumber, pageSize, debouncedSearchName, debouncedSortBy]);

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
            placeholder={intl("searchNamePlaceholder")}
          />
          <div className={classes.listBoxSpacer} />
          <IconSelect
            iconOptions={getSortingIconOptions(intl)}
            value={mapSortingTypeToIconOption(sortBy, intl)}
            onChange={(option) => setSortBy(mapIconOptionToSortingType(option))}
            staticIconName={IconName.SortingDesc}
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
            placeholder={intl("tagsPlaceholder")}
            isLoading={searchTagsLoading}
          />
        </div>
      </div>
    </AlbumsList>
  );
}
