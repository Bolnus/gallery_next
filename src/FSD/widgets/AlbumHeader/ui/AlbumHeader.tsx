"use client";
import NextImage from "next/image";
import React from "react";
import classes from "./AlbumHeader.module.scss";
import { DefinedTag, GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { getUnitedClassnames } from "../../../shared/lib/common/commonUtils";
import { IconName } from "../../../shared/ui/icons/ReactIcon/types";
import { UiSize } from "../../../shared/lib/common/commonTypes";
import { ButtonIcon } from "../../../shared/ui/button/ButtonIcon/ButtonIcon";
import { ButtonIconBackground } from "../../../shared/ui/button/ButtonIcon/types";
import defaultImage from "../../../shared/ui/image/greyRect.svg";
import { Tag } from "../../../shared/ui/tags/Tag";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "../../../../app/navigation";

interface Props {
  albumId?: string;
  imageCover?: GalleryImage;
  albumName?: string;
  tags?: DefinedTag[];
  isFetching?: boolean;
}

interface OnEditProps {
  newImages: GalleryImage[];
  isOnEdit: true;
  onAddImages: () => void;
}

interface ReadOnlyProps {
  isOnEdit?: false;
  onAddImages?: undefined;
  newImages?: undefined;
}

const canEdit = true;

export function AlbumHeader({
  imageCover,
  tags,
  albumName = "",
  isFetching = false
}: Props & (OnEditProps | ReadOnlyProps)): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const intl = useTranslations("AlbumHeader");

  return (
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
        <h1 className={getUnitedClassnames([classes.galleryHeader__headerText, classes.galleryHeader__leftContent])}>
          {isFetching ? "--" : albumName}
        </h1>
      </div>

      <div className={getUnitedClassnames([classes.toolBar, classes.galleryHeader__toolBarArea])}>
        {canEdit ? (
          <ButtonIcon
            title={intl("editButton")}
            iconName={IconName.Edit}
            onClick={() => router.push(`${pathname}/edit`)}
            size={UiSize.MediumAdaptive}
            color="white"
            background={ButtonIconBackground.Grey}
            className={classes.toolBar__button}
          />
        ) : null}
      </div>

      <div className={classes.galleryHeader__tagsArea}>
        <div className={classes.galleryHeader__tagsWrapper}>
          {tags?.map((definedTag) => (
            <Tag {...definedTag} key={definedTag.id} href={`/search?tags=${definedTag.tagName}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
