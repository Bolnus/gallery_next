import React from "react";
import { AlbumImagesList } from "../../../widgets/AlbumImagesList/ui/AlbumImagesList";
import { GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { filterImagesWithId, moveImage, setImageCanceled } from "../lib/albumEditUtils";

interface Props {
  setImages: React.Dispatch<React.SetStateAction<GalleryImage[]>>;
  images: GalleryImage[];
  deleteDisabled?: boolean;
}

export function GalleryAlbumImagesList({ images, setImages, deleteDisabled }: Readonly<Props>): JSX.Element {
  return (
    <AlbumImagesList
      images={images}
      onDelete={(id) => setImages((prev) => filterImagesWithId(id, prev))}
      onCancel={(id) => setImages((prev) => setImageCanceled(id, prev))}
      deleteDisabled={deleteDisabled}
      moveImage={(dragIndex, hoverIndex) => setImages((prev) => moveImage(dragIndex, hoverIndex, prev))}
    />
  );
}
