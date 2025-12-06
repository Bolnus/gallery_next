import { pushElementToArray } from "../../../shared/lib/common/commonUtils";
import { DefinedTag, FileLoadState, GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { getCompressedImageURL, getImageUrlFromFile, getReadableFileRefs } from "../../../shared/lib/file/filePromises";
import { ImageLoadError, ImportType } from "../../../shared/lib/file/types";
import { ChangesSaveState } from "../../../entities/album/model/albumTypes";
import { queryClient } from "../../../app/lib/reactQuery/ReactQueryProvider";
import { AxiosError, AxiosResponse } from "axios";
import { ApiMessage } from "../../../shared/api/apiTypes";
import { postAlbumPicturesMutation, putAlbumPicturesMutation } from "../../../shared/api/picture/pictureApi";
import { isApiError } from "../../../shared/api/galleryApi";
import { ImagesSegment } from "../../../widgets/AlbumHeader/lib/types";
import { SendImagesPortionRes } from "./types";
import { getHumanReadableFileSize } from "../../../widgets/AlbumImagesList/lib/utils";
import { FILE_SIZE_LIMIT } from "../../../shared/lib/file/consts";
import { QueryObserverResult } from "react-query";
import { AlbumWithImages } from "../../../shared/api/album/types";

export async function addImages(
  setNewImages: React.Dispatch<React.SetStateAction<GalleryImage[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string[]>>,
  setCurrentSegment: (newSegment: ImagesSegment) => void
): Promise<void> {
  let fileRefs: File[] = [];
  try {
    fileRefs = await getReadableFileRefs(ImportType.Multiple);
  } catch (localError) {
    setErrorMessage((prev: string[]) => pushElementToArray("Error reading files from input.", prev));
    console.warn(localError);
    return;
  }
  if (!fileRefs.length) {
    return;
  }
  if (fileRefs.length > 50) {
    setErrorMessage((prev: string[]) => pushElementToArray("Error. More than 50 files selected.", prev));
    return;
  }
  for (let i = 0; i < fileRefs.length; i++) {
    const file = fileRefs[i];
    try {
      let pendingURL: string;
      if (file.size < 500 * 1024) {
        pendingURL = await getImageUrlFromFile(file);
      } else {
        pendingURL = await getCompressedImageURL(file);
      }
      setNewImages((prev: GalleryImage[]) =>
        pushElementToArray(
          {
            id: file.name,
            url: pendingURL,
            data: file,
            pictureNumber: i + 1,
            loadState: FileLoadState.added
          },
          prev
        )
      );
    } catch (localError) {
      if (localError === ImageLoadError.PARSE) {
        setErrorMessage((prev: string[]) => pushElementToArray(`Error. Could not parse ${file.name} as image.`, prev));
      } else if (localError === ImageLoadError.SIZE_LIMIT) {
        setErrorMessage((prev: string[]) =>
          pushElementToArray(
            `Error. File ${file.name} exceeds ${getHumanReadableFileSize(FILE_SIZE_LIMIT)} limit.`,
            prev
          )
        );
      } else if (typeof localError === "string") {
        setErrorMessage((prev: string[]) => pushElementToArray(localError, prev));
      } else {
        console.warn(localError);
      }
    }
  }
  setCurrentSegment(ImagesSegment.NewImages);
}

export function filterImagesWithId(filterId: string, prev: GalleryImage[]): GalleryImage[] {
  return prev.filter((image) => image.id !== filterId);
}

export function deleteImageById(
  id: string,
  loadState: FileLoadState,
  setImages: React.Dispatch<React.SetStateAction<GalleryImage[]>>
): void {
  setImages((prev: GalleryImage[]) => filterImagesWithId(id, prev));
}

export function setImageCanceled(id: string, prev: GalleryImage[]): GalleryImage[] {
  const newImages = [...prev];
  for (let i = 0; i < newImages.length; i++) {
    if (newImages[i].id === id) {
      newImages[i] = {
        ...newImages[i],
        loadState: FileLoadState.uploadCanceled
      };
      break;
    }
  }
  return newImages;
}

export function mapDefinedTagToStr(tag: DefinedTag): string {
  return tag.tagName;
}

export function onSaveChanges(
  putAlbumHeaders: () => void,
  setPostImageIndex: (index: number) => void,
  unsavedHeaders: ChangesSaveState
): void {
  if (unsavedHeaders !== ChangesSaveState.Saved) {
    putAlbumHeaders();
  } else {
    setPostImageIndex(0);
  }
}

export function pushServerError(
  setErrorMessage: React.Dispatch<React.SetStateAction<string[]>>,
  localError: AxiosError<ApiMessage | null>
): void {
  const errorMessage = isApiError(localError) ? localError?.response?.data.message : localError?.response?.statusText;
  setErrorMessage((prev: string[]) => pushElementToArray(`${localError?.response?.status}: ${errorMessage}`, prev));
}

export async function onSaveAlbumHeadersSuccess(
  setAlbumId: (str: string) => void,
  setUnsavedChanges: (state: ChangesSaveState) => void,
  setPostImageIndex: (index: number) => void,
  data: { id?: string }
): Promise<void> {
  if (data.id) {
    setAlbumId(data.id);
  }
  setUnsavedChanges(ChangesSaveState.Saving);
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["get-tags"] }),
    queryClient.invalidateQueries({ queryKey: ["get-album"] })
  ]);
  setPostImageIndex(0);
}

export function resetHeaders({
  setLocalAlbumName,
  setLocalAlbumDescription,
  setLocalAlbumTags,
  albumName,
  tags,
  description
}: {
  setLocalAlbumName: (str: string) => void;
  setLocalAlbumTags: (tags: DefinedTag[]) => void;
  setLocalAlbumDescription: (str: string) => void;
  albumName: string;
  description?: string;
  tags?: DefinedTag[];
}): void {
  setLocalAlbumTags(tags || []);
  setLocalAlbumName(albumName || "");
  setLocalAlbumDescription(description || "");
}

function updateImageIds(imageIdsMap: Map<string, string>, prev: GalleryImage[]): GalleryImage[] {
  const newImages = [...prev];
  for (let i = 0; i < newImages.length; i++) {
    const image = newImages[i];
    if (imageIdsMap.has(image.id || "")) {
      const newId = imageIdsMap.get(String(image.data?.name));
      newImages[i] = {
        ...image,
        id: newId || image.id,
        loadState: newId ? FileLoadState.uploaded : FileLoadState.uploadFailed
      };
    }
  }
  return newImages;
}

export function updateLoadingPortion(imagesPortion: GalleryImage[], prev: GalleryImage[]): GalleryImage[] {
  const newImages = [...prev];
  for (let i = 0; i < newImages.length; i++) {
    const imageToUpdate = imagesPortion.find((image) => image.id === newImages[i].id);
    if (imageToUpdate) {
      newImages[i] = {
        ...imageToUpdate,
        loadState: FileLoadState.startedUploading
      };
    }
  }
  return newImages;
}

function setFailedImages(prev: GalleryImage[]): GalleryImage[] {
  const newImages = [...prev];
  for (let i = 0; i < newImages.length; i++) {
    if (newImages[i].loadState !== FileLoadState.uploaded && newImages[i].loadState !== FileLoadState.uploadCanceled) {
      newImages[i] = {
        ...newImages[i],
        loadState: FileLoadState.uploadFailed
      };
    }
  }
  return newImages;
}

export function initUploadingImages(prev: GalleryImage[]): GalleryImage[] {
  const newImages = [...prev];
  for (let i = 0; i < newImages.length; i++) {
    if (newImages[i].loadState !== FileLoadState.uploaded) {
      newImages[i] = {
        ...newImages[i],
        loadState: FileLoadState.uploadPlanned
      };
    }
  }
  return newImages;
}

export function onSendImagesError(
  localError: AxiosError<ApiMessage>,
  setImages: React.Dispatch<React.SetStateAction<GalleryImage[]>>,
  setErrorMessages: React.Dispatch<React.SetStateAction<string[]>>,
  setPostImageIndex: (newIndex: number) => void
): void {
  pushServerError(setErrorMessages, localError);
  setImages(setFailedImages);
  setPostImageIndex(-1);
}

export function onSendImagesSuccess(
  setNewImages: React.Dispatch<React.SetStateAction<GalleryImage[]>>,
  setPostImageIndex: React.Dispatch<React.SetStateAction<number>>,
  res: SendImagesPortionRes
): void {
  const { idsMap, imagesPortion } = res;
  for (const processedImage of imagesPortion) {
    const originalFileName = String(processedImage.data?.name);
    if (!idsMap.has(originalFileName)) {
      idsMap.set(originalFileName, "");
    }
  }
  setNewImages((prev: GalleryImage[]) => updateImageIds(idsMap, prev));
  setTimeout(() => setPostImageIndex((prev) => (prev === -1 ? -1 : prev + imagesPortion.length)), 20);
}

export async function sendImagesPortion(albumId: string, imagesPortion: GalleryImage[]): Promise<SendImagesPortionRes> {
  const { data } = await postAlbumPicturesMutation(albumId, imagesPortion);
  const idsMap = new Map(data.imageIds);
  return { imagesPortion, idsMap };
}

export async function putAlbumPicturesIds(
  oldImages: GalleryImage[],
  newImageIds: string[],
  albumId: string
): Promise<AxiosResponse<null>> {
  const oldImageIds = oldImages.map((image) => image.id);
  return putAlbumPicturesMutation(albumId, oldImageIds.concat(newImageIds));
}

export function clearImagesArray(prev: GalleryImage[]): GalleryImage[] {
  for (const image of prev) {
    if (image.url) {
      URL.revokeObjectURL(image.url);
    }
  }
  return prev.length ? [] : prev;
}

export async function onArrangePicturesSettled(
  unsavedImages: GalleryImage[],
  setNewImages: React.Dispatch<React.SetStateAction<GalleryImage[]>>,
  setCurrentSegment: React.Dispatch<React.SetStateAction<ImagesSegment>>,
  albumId?: string,
  revalidateAlbum?: (id: string) => void
): Promise<void> {
  if (unsavedImages.length) {
    return undefined;
  }
  setNewImages(clearImagesArray);
  setCurrentSegment(ImagesSegment.OldImages);
  if (albumId && revalidateAlbum) {
    revalidateAlbum(albumId);
  }
  return queryClient.invalidateQueries({ queryKey: ["get-album"] });
}

export async function onReset(
  setNewImages: (images: GalleryImage[]) => void,
  refetch: () => Promise<QueryObserverResult<AlbumWithImages, unknown>>
): Promise<void> {
  setNewImages([]);
  await refetch();
}

export function moveImage(dragIndex: number, hoverIndex: number, prevImages: GalleryImage[]): GalleryImage[] {
  const draggedItem = prevImages[dragIndex];
  const newItems = [...prevImages];
  newItems.splice(dragIndex, 1);
  newItems.splice(hoverIndex, 0, draggedItem);
  return newItems;
}

export function imagesChanged(localImages: GalleryImage[], serverImages?: GalleryImage[]): boolean {
  if (serverImages?.length !== localImages?.length) {
    return true;
  }
  return localImages.some((image, index) => image.id !== serverImages[index].id);
}
