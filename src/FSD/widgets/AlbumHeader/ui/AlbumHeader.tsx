"use client";
import NextImage from "next/image";
import React from "react";
import classes from "./AlbumHeader.module.scss";
import { AlbumHeaders, DefinedTag, FileLoadState, GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { SkeletonLoader } from "../../../shared/ui/icons/SkeletonLoader/SkeletonLoader";
import { TextInput } from "../../../shared/ui/input/TextInput/TextInput";
import {
  getUnitedClassnames,
  invertTrigger,
  mapDefinedTagsToOptions,
  mapOptionsToDefinedTags,
  onTagsFocus,
  updateStateValue
} from "../../../shared/lib/common/commonUtils";
import { ChangesSaveState } from "../../../entities/album/model/albumTypes";
import { IconName } from "../../../shared/ui/icons/ReactIcon/types";
import { UiSize } from "../../../shared/lib/common/commonTypes";
import { ButtonIcon } from "../../../shared/ui/button/ButtonIcon/ButtonIcon";
import { ButtonIconBackground } from "../../../shared/ui/button/ButtonIcon/types";
import { Modal, ModalType } from "../../../shared/ui/Modal/Modal";
import { mapTags } from "../../../shared/ui/tags/Tag";
import { CreatableMultiSelect } from "../../../shared/ui/input/Select/CreatableSelect";
import { SelectOption } from "../../../shared/ui/input/Select/types";
import { useMutation, useQuery } from "react-query";
import { getAllTagsError, getAllTagsQuery } from "../../../shared/api/tags/tagsApi";
import {
  getAlbumHeadersQuery,
  putAlbumHeadersError,
  putAlbumHeadersMutation
} from "../../../shared/api/album/albumApi";
import { ApiMessage, ApiResponse } from "../../../shared/api/apiTypes";
import { AxiosError, AxiosResponse } from "axios";
import { PutAlbumHeadersArgs } from "../../../shared/api/album/types";

interface Props {
  albumId: string;
  imageCover: GalleryImage;
  albumName: string;
  tags: DefinedTag[];
  isFetching?: boolean;
}

const canEdit = true;

function mapDefinedTagToStr(tag: DefinedTag): string
{
  return tag.tagName;
}

function onSaveChanges(
  putAlbumHeaders: (args: PutAlbumHeadersArgs) => void,
  id: string,
  albumName: string,
  tags: DefinedTag[]
) {
  putAlbumHeaders({
    id,
    albumName,
    tags: tags.map(mapDefinedTagToStr)
  });
}

function onAddImages(setErrorMessage: (message: string | null) => void) {
  setErrorMessage("In development.");
}

function closeModal(setErrorMessage: (message: string | null) => void) {
  setErrorMessage(null);
}

function changeSelectedTags(
  setLocalAlbumTags: (tags: DefinedTag[]) => void,
  setUnsavedChanges: (saved: ChangesSaveState) => void,
  newTags: readonly SelectOption[]
) {
  setLocalAlbumTags(newTags.map(mapOptionsToDefinedTags));
  setUnsavedChanges(ChangesSaveState.Unsaved);
}

function pushNewAlbumTag(
  newTag: DefinedTag,
  setUnsavedChanges: (saved: ChangesSaveState) => void,
  prevTags: DefinedTag[]
): DefinedTag[] {
  for (const prevTag of prevTags) {
    if (prevTag.tagName === newTag.tagName) {
      return prevTags;
    }
  }
  setUnsavedChanges(ChangesSaveState.Unsaved);
  return [...prevTags, newTag];
}

function onCreateOption(
  setLocalAlbumTags: React.Dispatch<React.SetStateAction<DefinedTag[]>>,
  setUnsavedChanges: (saved: ChangesSaveState) => void,
  inputValue: string
) {
  setLocalAlbumTags(
    pushNewAlbumTag.bind(null, { tagName: inputValue, id: inputValue, albumsCount: 0 }, setUnsavedChanges)
  );
}

function onAlbumNameChange(
  setLocalAlbumName: (str: string) => void,
  setUnsavedChanges: (saved: ChangesSaveState) => void,
  newValue: string
) {
  setLocalAlbumName(newValue);
  setUnsavedChanges(ChangesSaveState.Unsaved);
}

function onPutAlbumHeadersError(setErrorMessage: (str: string) => void, localError: AxiosError<ApiMessage>) {
  setErrorMessage(`${localError?.response?.status}: ${localError?.response?.data?.message}`);
}

function onPutAlbumHeadersSuccess(setIsOnEdit: (flag: boolean) => void) {
  setIsOnEdit(false);
}

function invertIsOnEdit(setUnsavedChanges: (state: ChangesSaveState) => void, prevIsOnEdit: boolean): boolean {
  if (prevIsOnEdit) {
    setUnsavedChanges(ChangesSaveState.Loading);
    return prevIsOnEdit;
  }
  return !prevIsOnEdit;
}

function onEditClicked(
  setUnsavedChanges: (state: ChangesSaveState) => void,
  setIsOnEdit: React.Dispatch<React.SetStateAction<boolean>>
) {
  setIsOnEdit(invertIsOnEdit.bind(null, setUnsavedChanges));
}

function onGetAlbumHeader(
  setLocalAlbumTags: (tags: DefinedTag[]) => void,
  setLocalAlbumName: (str: string) => void,
  setUnsavedChanges: (state: ChangesSaveState) => void,
  setIsOnEdit: (falg: boolean) => void,
  newAlbumHeaders: AlbumHeaders
) {
  setLocalAlbumTags(newAlbumHeaders.tags);
  setLocalAlbumName(newAlbumHeaders.albumName);
  setUnsavedChanges(ChangesSaveState.Saved);
  setIsOnEdit(false);
}

export function AlbumHeader({ imageCover, albumName, tags, isFetching, albumId }: Props): JSX.Element {
  const [unsavedChanges, setUnsavedChanges] = React.useState<ChangesSaveState>(ChangesSaveState.Saved);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isOnEdit, setIsOnEdit] = React.useState(false);
  const [localAlbumName, setLocalAlbumName] = React.useState("");
  const [localAlbumTags, setLocalAlbumTags] = React.useState<DefinedTag[]>([]);
  const [tagsFocused, setTagsFocused] = React.useState(false);

  const { data: searchTags, isLoading: searchTagsLoading } = useQuery({
    queryKey: ["get-tags"],
    queryFn: getAllTagsQuery,
    onError: getAllTagsError,
    enabled: tagsFocused
  });

  const { mutate: putAlbumHeaders, isLoading: putAlbumHeadersLoading } = useMutation<
    AxiosResponse,
    AxiosError<ApiMessage>,
    {
      id: string;
      albumName: string;
      tags: string[];
    }
  >(putAlbumHeadersMutation, {
    onError: onPutAlbumHeadersError.bind(null, setErrorMessage),
    onSuccess: onPutAlbumHeadersSuccess.bind(null, setIsOnEdit)
  });

  const { isLoading: headersLoading } = useQuery({
    queryKey: ["get-album-headers"],
    queryFn: getAlbumHeadersQuery.bind(null, albumId),
    enabled: unsavedChanges === ChangesSaveState.Loading,
    onSuccess: onGetAlbumHeader.bind(null, setLocalAlbumTags, setLocalAlbumName, setUnsavedChanges, setIsOnEdit)
  });

  // React.useEffect(function() {
  //   if (putAlbumHeadersLoading) {
  //     setUnsavedChanges(ChangesSaveState.Saving);
  //   }
  // }, [putAlbumHeadersLoading])

  React.useEffect(function() {
    setLocalAlbumTags(tags);
    setLocalAlbumName(albumName);
    setUnsavedChanges(ChangesSaveState.Saved);
    setIsOnEdit(false);
  }, [tags, albumName]);

  const headersFetching = isFetching || headersLoading || putAlbumHeadersLoading;
  return (
    <div className={classes.galleryHeader}>
      <div className={classes.galleryHeader__backgroundImage}>
        {isFetching || !imageCover ? (
          <SkeletonLoader />
        ) : (
          <NextImage
            src={imageCover?.url || ""}
            alt={imageCover?.name || ""}
            className={getUnitedClassnames([
              classes.galleryHeader__backgroundImage,
              classes.galleryHeader__backgroundImage_appearence
            ])}
            // onError={onImageError.bind(null, dispatch, imageCover)}
            fill
            sizes="99vw"
          />
        )}
      </div>
      <div className={classes.galleryHeader__nameArea}>
        {isOnEdit ? (
          <div className={classes.galleryHeader__leftContent}>
            <TextInput
              value={localAlbumName}
              onChange={onAlbumNameChange.bind(null, setLocalAlbumName, setUnsavedChanges)}
              isClearable
            />
          </div>
        ) : (
          <h1 className={getUnitedClassnames([classes.galleryHeader__headerText, classes.galleryHeader__leftContent])}>
            {headersFetching ? "--" : localAlbumName}
          </h1>
        )}
      </div>

      <div className={getUnitedClassnames([classes.toolBar, classes.galleryHeader__toolBarArea])}>
        {isOnEdit ? (
          <>
            {unsavedChanges === ChangesSaveState.Saving || unsavedChanges === ChangesSaveState.Unsaved ? (
              <ButtonIcon
                title="Save changes"
                iconName={IconName.Save}
                onClick={onSaveChanges.bind(null, putAlbumHeaders, albumId, localAlbumName, localAlbumTags)}
                size={UiSize.MediumAdaptive}
                color="white"
                background={ButtonIconBackground.Grey}
                className={classes.toolBar__button}
                isFetching={headersFetching}
              />
            ) : null}
            <ButtonIcon
              title="Edit images"
              iconName={IconName.Images}
              onClick={onAddImages.bind(null, setErrorMessage)}
              size={UiSize.MediumAdaptive}
              color="white"
              isFetching={headersFetching}
              background={ButtonIconBackground.Grey}
              className={classes.toolBar__button}
            />
          </>
        ) : null}
        {canEdit ? (
          <ButtonIcon
            title={isOnEdit ? "Cancel" : "Edit"}
            iconName={isOnEdit ? IconName.Reload : IconName.Edit}
            onClick={onEditClicked.bind(null, setUnsavedChanges, setIsOnEdit)}
            size={UiSize.MediumAdaptive}
            color="white"
            isFetching={headersFetching}
            background={ButtonIconBackground.Grey}
            className={classes.toolBar__button}
          />
        ) : null}
      </div>

      <div className={classes.galleryHeader__tagsArea}>
        {isOnEdit ? (
          <CreatableMultiSelect
            options={searchTags?.length ? searchTags.map(mapDefinedTagsToOptions) : []}
            value={localAlbumTags.map(mapDefinedTagsToOptions)}
            onChange={changeSelectedTags.bind(null, setLocalAlbumTags, setUnsavedChanges)}
            onCreateOption={onCreateOption.bind(null, setLocalAlbumTags, setUnsavedChanges)}
            onFocus={onTagsFocus.bind(null, setTagsFocused)}
            isClearable
            placeholder="Tags..."
            isLoading={searchTagsLoading}
          />
        ) : (
          <div className={classes.galleryHeader__tagsWrapper}>{localAlbumTags.map(mapTags)}</div>
        )}
      </div>
      {errorMessage ? (
        <Modal onClose={closeModal.bind(null, setErrorMessage)} header={errorMessage} modalType={ModalType.Info} />
      ) : null}
    </div>
  );
}
