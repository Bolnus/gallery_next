"use client";
import NextImage from "next/image";
import React from "react";
import classes from "./AlbumHeaderEdit.module.scss";
import { AlbumHeaders, DefinedTag, FileLoadState, GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { SkeletonLoader } from "../../../shared/ui/icons/SkeletonLoader/SkeletonLoader";
import { TextInput } from "../../../shared/ui/input/TextInput/TextInput";
import {
  getUnitedClassnames,
  invertTrigger,
  mapDefinedTagsToOptions,
  mapOptionsToDefinedTags,
  onTagsFocus,
  tagsChanged,
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
  saveAlbumHeadersMutation
} from "../../../shared/api/album/albumApi";
import { ApiMessage, ApiResponse } from "../../../shared/api/apiTypes";
import { AxiosError, AxiosResponse } from "axios";
import { PutAlbumHeadersArgs } from "../../../shared/api/album/types";
import defaultImage from "../../../shared/ui/image/greyRect.svg";
import { closeModal } from "../../../shared/lib/sharedComponentsUtils/modalUtils";
import { useRouter } from "next/navigation";
import { queryClient } from "../../../app/lib/reactQuery/ReactQueryProvider";

interface Props {
  albumId: string;
  imageCover?: GalleryImage;
  // albumName?: string;
  // tags?: DefinedTag[];
  isFetching?: boolean;
  onAddImages: () => void;
  newImages: GalleryImage[];
  setAlbumId: (str: string) => void;
}

const canEdit = true;

function mapDefinedTagToStr(tag: DefinedTag): string {
  return tag.tagName;
}

function onSaveChanges(
  putAlbumHeaders: () => void,
  unsavedChanges: ChangesSaveState
) {
  if (unsavedChanges !== ChangesSaveState.Saved) {
    putAlbumHeaders();
  }
  
}

function pushNewAlbumTag(newTag: DefinedTag, prevTags: readonly DefinedTag[]): readonly DefinedTag[] {
  for (const prevTag of prevTags) {
    if (prevTag.tagName === newTag.tagName) {
      return prevTags;
    }
  }
  return [...prevTags, newTag];
}

function onCreateOption(
  setLocalAlbumTags: React.Dispatch<React.SetStateAction<readonly DefinedTag[]>>,
  inputValue: string
) {
  setLocalAlbumTags((prevTags: readonly DefinedTag[]) =>
    pushNewAlbumTag({ tagName: inputValue, id: inputValue, albumsCount: 0 }, prevTags)
  );
}

function onPutAlbumHeadersError(setErrorMessage: (str: string) => void, localError: AxiosError<ApiMessage>) {
  setErrorMessage(`${localError?.response?.status}: ${localError?.response?.data?.message}`);
}

async function onPutAlbumHeadersSuccess(
  setAlbumId: (str: string) => void,
  setUnsavedChanges: (state: ChangesSaveState) => void,
  data: { id?: string }
) {
  if (data.id) {
    setAlbumId(data.id);
  }
  setUnsavedChanges(ChangesSaveState.Saving);
  await queryClient.invalidateQueries({ queryKey: ["get-tags"] });
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
  setIsOnEdit((prevIsOnEdit: boolean) => invertIsOnEdit(setUnsavedChanges, prevIsOnEdit));
}

function onGetAlbumHeader(setUnsavedChanges: (state: ChangesSaveState) => void) {
  // setUnsavedChanges(ChangesSaveState.Saved);
}

function resetHeaders(
  setLocalAlbumName: (str: string) => void,
  setLocalAlbumTags: (tags: DefinedTag[]) => void,
  albumName: string,
  tags?: DefinedTag[]
) {
  setLocalAlbumTags(tags || []);
  setLocalAlbumName(albumName || "");
}

export function AlbumHeaderEdit({
  imageCover,
  onAddImages,
  newImages,
  albumId,
  setAlbumId,
  isFetching = false
}: Props): JSX.Element {
  const router = useRouter();
  const [unsavedChanges, setUnsavedChanges] = React.useState<ChangesSaveState>(ChangesSaveState.Saved);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [localAlbumName, setLocalAlbumName] = React.useState("");
  const [localAlbumTags, setLocalAlbumTags] = React.useState<readonly DefinedTag[]>([]);
  const [tagsFocused, setTagsFocused] = React.useState(false);

  const { data: searchTags, isLoading: searchTagsLoading } = useQuery({
    queryKey: ["get-tags"],
    queryFn: getAllTagsQuery,
    onError: getAllTagsError,
    enabled: tagsFocused
  });

  const { mutate: putAlbumHeaders, isLoading: putAlbumHeadersLoading } = useMutation<
    AxiosResponse<{ id?: string }>,
    AxiosError<ApiMessage>
  >(
    () =>
      saveAlbumHeadersMutation({
        id: albumId,
        albumName: localAlbumName,
        tags: localAlbumTags.map(mapDefinedTagToStr)
      }),
    {
      onError: (localError: AxiosError<ApiMessage>) => onPutAlbumHeadersError(setErrorMessage, localError),
      onSuccess: (response: AxiosResponse<{ id?: string }>) =>
        onPutAlbumHeadersSuccess(setAlbumId, setUnsavedChanges, response.data)
    }
  );

  const { isLoading: headersLoading, data } = useQuery({
    queryKey: ["get-album-headers"],
    queryFn: () => getAlbumHeadersQuery(albumId),
    enabled: !!albumId && unsavedChanges === ChangesSaveState.Saving,
    onSuccess: () => onGetAlbumHeader(setUnsavedChanges)
  });

  const albumName = data?.albumName || "";
  const tags = data?.tags;

  React.useEffect(() => resetHeaders(setLocalAlbumName, setLocalAlbumTags, albumName, tags), [tags, albumName]);

  React.useEffect(() => {
    const changed = albumName !== localAlbumName || tagsChanged(tags || [], localAlbumTags);
    setUnsavedChanges(changed ? ChangesSaveState.Unsaved : ChangesSaveState.Saved);
  }, [albumName, localAlbumName, tags, localAlbumTags]);

  const headersFetching = isFetching || headersLoading || putAlbumHeadersLoading;
  const canSave = (
    unsavedChanges === ChangesSaveState.Saving
    || unsavedChanges === ChangesSaveState.Unsaved
    || newImages.length
  ) && localAlbumName;

  return (
    <div className={classes.galleryHeader}>
      <div className={classes.galleryHeader__backgroundImage}>
        <NextImage
          src={(!isFetching && imageCover?.url) || defaultImage}
          alt={imageCover?.name || ""}
          className={getUnitedClassnames([
            classes.galleryHeader__backgroundImage,
            classes.galleryHeader__backgroundImage_appearence
          ])}
          // onError={() => onImageError(dispatch, imageCover)}
          fill
          sizes="99vw"
        />
      </div>
      <div className={classes.galleryHeader__nameArea}>
        <div className={classes.galleryHeader__leftContent}>
          <TextInput value={localAlbumName} onChange={(newValue: string) => setLocalAlbumName(newValue)} isClearable />
        </div>
      </div>

      <div className={getUnitedClassnames([classes.toolBar, classes.galleryHeader__toolBarArea])}>
        {canSave ? (
          <ButtonIcon
            title="Save changes"
            iconName={IconName.Save}
            onClick={() => onSaveChanges(putAlbumHeaders, unsavedChanges)}
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
          onClick={() => onAddImages()}
          size={UiSize.MediumAdaptive}
          color="white"
          isFetching={headersFetching}
          background={ButtonIconBackground.Grey}
          className={classes.toolBar__button}
        />
        {canEdit && albumId ? (
          <ButtonIcon
            title="Reload"
            iconName={IconName.Reload}
            onClick={() => resetHeaders(setLocalAlbumName, setLocalAlbumTags, albumName, tags)}
            size={UiSize.MediumAdaptive}
            color="white"
            isFetching={headersFetching}
            background={ButtonIconBackground.Grey}
            className={classes.toolBar__button}
          />
        ) : null}
      </div>

      <div className={classes.galleryHeader__tagsArea}>
        <CreatableMultiSelect
          options={searchTags?.length ? searchTags.map(mapDefinedTagsToOptions) : []}
          value={localAlbumTags.map(mapDefinedTagsToOptions)}
          onChange={(newTags: readonly SelectOption[]) => setLocalAlbumTags(newTags.map(mapOptionsToDefinedTags))}
          onCreateOption={(inputValue: string) => onCreateOption(setLocalAlbumTags, inputValue)}
          onFocus={() => onTagsFocus(setTagsFocused)}
          isClearable
          placeholder="Tags..."
          isLoading={searchTagsLoading}
        />
      </div>
      {errorMessage ? (
        <Modal onClose={() => closeModal(setErrorMessage)} header={errorMessage} modalType={ModalType.Info} />
      ) : null}
    </div>
  );
}
