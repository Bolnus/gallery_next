"use client";
import NextImage from "next/image";
import React from "react";
import classes from "./AlbumHeaderEdit.module.scss";
import { DefinedTag, GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { TextInput } from "../../../shared/ui/input/TextInput/TextInput";
import {
  getUnitedClassnames,
  mapDefinedTagsToOptions,
  mapOptionsToDefinedTags,
  onTagsFocus
} from "../../../shared/lib/common/commonUtils";
import { IconName } from "../../../shared/ui/icons/ReactIcon/types";
import { UiSize } from "../../../shared/lib/common/commonTypes";
import { ButtonIcon } from "../../../shared/ui/button/ButtonIcon/ButtonIcon";
import { ButtonIconBackground } from "../../../shared/ui/button/ButtonIcon/types";
import { CreatableMultiSelect } from "../../../shared/ui/input/Select/CreatableSelect";
import { SelectOption } from "../../../shared/ui/input/Select/types";
import { useQuery } from "react-query";
import { getAllTagsError, getAllTagsQuery } from "../../../shared/api/tags/tagsApi";
import defaultImage from "../../../shared/ui/image/greyRect.svg";
import { Modal, ModalType } from "../../../shared/ui/Modal/Modal";
import { ImagesSegment } from "../lib/types";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Segment } from "../../../shared/ui/segments/Segment";
import { TextArea } from "../../../shared/ui/input/TextInput/TextArea";
import { useTranslations } from "next-intl";

interface Props {
  albumId: string;
  localAlbumName: string;
  localAlbumDescription: string;
  localAlbumTags: readonly DefinedTag[];
  imageCover?: GalleryImage;
  isFetching?: boolean;
  canSave?: boolean;
  newImages: GalleryImage[];
  oldImages?: GalleryImage[];
  currentSegment: ImagesSegment;
  setCurrentSegment: (newSegment: ImagesSegment) => void;
  onAddImages: () => void;
  onSaveChanges: () => void;
  onReset: () => void;
  onDelete: () => void;
  setLocalAlbumName: (str: string) => void;
  setLocalAlbumTags: React.Dispatch<React.SetStateAction<readonly DefinedTag[]>>;
  setLocalAlbumDescription: (str: string) => void;
}

const canEdit = true;

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

export function AlbumHeaderEdit({
  imageCover,
  newImages,
  oldImages,
  albumId,
  localAlbumName,
  localAlbumTags,
  localAlbumDescription,
  canSave,
  isFetching,
  currentSegment,
  onSaveChanges,
  onAddImages,
  onReset,
  onDelete,
  setLocalAlbumTags,
  setLocalAlbumName,
  setCurrentSegment,
  setLocalAlbumDescription
}: Readonly<Props>): JSX.Element {
  const [tagsFocused, setTagsFocused] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const intl = useTranslations("AlbumHeaderEdit");

  const { data: searchTags, isLoading: searchTagsLoading } = useQuery({
    queryKey: ["get-tags"],
    queryFn: getAllTagsQuery,
    onError: getAllTagsError,
    enabled: tagsFocused
  });

  return (
    <>
      <div className={classes.galleryHeader}>
        <div className={classes.galleryHeader__backgroundImage}>
          <NextImage
            src={(!isFetching && imageCover?.url) || (defaultImage as StaticImport)}
            alt={imageCover?.name || ""}
            className={getUnitedClassnames([
              classes.galleryHeader__backgroundImage,
              classes.galleryHeader__backgroundImage_appearence
            ])}
            // onError={() => onImageError(dispatch, imageCover)}
            fill
            sizes="99vw"
            quality="100"
          />
        </div>
        <div className={classes.galleryHeader__nameArea}>
          <div className={classes.galleryHeader__leftContent}>
            <TextInput
              value={localAlbumName}
              onChange={(newValue: string) => setLocalAlbumName(newValue)}
              placeholder={intl("namePlaceholder")}
              isClearable
            />
          </div>
        </div>

        <div className={classes.galleryHeader__descriptionArea}>
          <TextArea
            value={localAlbumDescription}
            onChange={setLocalAlbumDescription}
            rows={5}
            containerClassName={classes.descriptionTextArea}
            placeholder={intl("descriptionPlaceholder")}
          />
        </div>

        <div className={classes.galleryHeader__tagsArea}>
          <CreatableMultiSelect
            options={searchTags?.length ? searchTags.map(mapDefinedTagsToOptions) : []}
            value={localAlbumTags.map(mapDefinedTagsToOptions)}
            onChange={(newTags: readonly SelectOption[]) => setLocalAlbumTags(newTags.map(mapOptionsToDefinedTags))}
            onCreateOption={(inputValue: string) => onCreateOption(setLocalAlbumTags, inputValue)}
            onFocus={() => onTagsFocus(setTagsFocused)}
            isClearable
            placeholder={intl("tagsPlaceholder")}
            isLoading={searchTagsLoading}
          />
        </div>

        <div className={getUnitedClassnames([classes.toolBar, classes.galleryHeader__toolBarArea])}>
          {canSave ? (
            <ButtonIcon
              title={intl("saveChangesButton")}
              iconName={IconName.Save}
              onClick={onSaveChanges}
              size={UiSize.MediumAdaptive}
              color="white"
              background={ButtonIconBackground.Grey}
              className={classes.toolBar__button}
              isFetching={isFetching}
            />
          ) : null}
          <ButtonIcon
            title={intl("editImagesButton")}
            iconName={IconName.Images}
            onClick={onAddImages}
            size={UiSize.MediumAdaptive}
            color="white"
            isFetching={isFetching}
            background={ButtonIconBackground.Grey}
            className={classes.toolBar__button}
          />
          {canEdit && albumId ? (
            <ButtonIcon
              title={intl("reloadButton")}
              iconName={IconName.Reload}
              onClick={onReset}
              size={UiSize.MediumAdaptive}
              color="white"
              isFetching={isFetching}
              background={ButtonIconBackground.Grey}
              className={classes.toolBar__button}
            />
          ) : null}
          {canEdit && albumId ? (
            <ButtonIcon
              title={intl("deleteButton")}
              iconName={IconName.Delete}
              onClick={() => setDeleteConfirmOpen(true)}
              size={UiSize.MediumAdaptive}
              color="white"
              isFetching={isFetching}
              background={ButtonIconBackground.Grey}
              className={classes.toolBar__button}
            />
          ) : null}
        </div>

        {deleteConfirmOpen ? (
          <Modal
            modalType={ModalType.DeleteDialog}
            header={intl("deleteConfirm")}
            onClose={() => setDeleteConfirmOpen(false)}
            onOk={onDelete}
          />
        ) : null}
      </div>
      {!!(oldImages?.length && newImages?.length) && (
        <div className={classes.galleryHeader__segments}>
          <Segment
            isSelected={currentSegment === ImagesSegment.OldImages}
            onClick={() => setCurrentSegment(ImagesSegment.OldImages)}
            counter={oldImages?.length ? oldImages.length : undefined}
            text={intl("segmentOld")}
          />
          <Segment
            isSelected={currentSegment === ImagesSegment.NewImages}
            onClick={() => setCurrentSegment(ImagesSegment.NewImages)}
            text={intl("segmentNew")}
            counter={newImages?.length ? newImages.length : undefined}
          />
        </div>
      )}
    </>
  );
}
