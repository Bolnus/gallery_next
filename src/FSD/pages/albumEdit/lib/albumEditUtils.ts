import { v4 as uuidV4 } from "uuid";
import { pushElementToArray } from "../../../shared/lib/common/commonUtils";
import { FileLoadState, GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { getImageUrlFromFile, getReadableFileRefs } from "../../../shared/lib/file/filePromises";
import { ImageLoadError, ImportType } from "../../../shared/lib/file/types";

export async function addImages(
  setNewImages: React.Dispatch<React.SetStateAction<GalleryImage[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string[]>>
) {
  const fileRefs = await getReadableFileRefs(ImportType.Multiple);
  if (!fileRefs.length) {
    return;
  }
  if (fileRefs.length > 50) {
    setErrorMessage((prev: string[]) => pushElementToArray("Error. More than 50 files selected.", prev));
    return;
  }
  for (const file of fileRefs) {
    try {
      const pendingURL = await getImageUrlFromFile(file);
      setNewImages((prev: GalleryImage[]) =>
        pushElementToArray(
          {
            id: uuidV4(),
            url: pendingURL,
            loadState: FileLoadState.parsed
          },
          prev
        )
      );
    } catch (localError) {
      if (localError === ImageLoadError.PARSE) {
        setErrorMessage((prev: string[]) => pushElementToArray(`Error. Could not parse ${file.name} as image.`, prev));
      } else if (localError === ImageLoadError.SIZE_LIMIT) {
        setErrorMessage((prev: string[]) => pushElementToArray(`Error. File ${file.name} exceeds 10MB limit.`, prev));
      } else if (typeof localError === "string") {
        setErrorMessage((prev: string[]) => pushElementToArray(localError, prev));
      } else {
        console.warn(localError);
      }
    }
  }
}

function filterImages(filterId: string, prev: GalleryImage[]): GalleryImage[] {
  return prev.filter((image) => image.id !== filterId);
}

export function deleteImageById(
  id: string,
  loadState: FileLoadState,
  images: GalleryImage[],
  setNewImages?: React.Dispatch<React.SetStateAction<GalleryImage[]>>
) {
  if ((loadState === FileLoadState.parsed || loadState === FileLoadState.parsingFailed) && setNewImages) {
    setNewImages((prev: GalleryImage[]) => filterImages(id, prev));
  }
}
