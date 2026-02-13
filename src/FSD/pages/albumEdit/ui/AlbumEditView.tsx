"use client";
import React from "react";
import { Modal, ModalType } from "../../../shared/ui/Modal/Modal";
import { DefinedTag, FileLoadState, GalleryImage } from "../../../shared/lib/common/galleryTypes";
import { shiftArrayElement, tagsChanged } from "../../../shared/lib/common/commonUtils";
import {
  addImages,
  mapDefinedTagToStr,
  pushServerError,
  onSaveAlbumHeadersSuccess,
  onSaveChanges,
  resetHeaders,
  putAlbumPicturesIds,
  onSendImagesError,
  sendImagesPortion,
  onSendImagesSuccess,
  onArrangePicturesSettled,
  clearImagesArray,
  onReset,
  imagesChanged,
  onSendImagesFinished,
  sendPendingImagesPortion,
  addDrawImage
} from "../lib/albumEditUtils";
import { AlbumHeaderEdit } from "../../../widgets/AlbumHeader/ui/AlbumHeaderEdit";
import { ChangesSaveState } from "../../../entities/album/model/albumTypes";
import { useMutation, useQuery } from "react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ApiMessage } from "../../../shared/api/apiTypes";
import { deleteAlbumMutation, getAlbumQuery, saveAlbumHeadersMutation } from "../../../shared/api/album/albumApi";
import { ImagesSegment } from "../../../widgets/AlbumHeader/lib/types";
import { SendImagesPortionRes } from "../lib/types";
import { GalleryAlbumImagesList } from "./GalleryAlbumImagesList";
import { useRouter } from "../../../../app/navigation";
import { LocaleValue } from "../../../../app/request";

interface Props {
  onEditAlbumId?: string;
  revalidateAlbum?: (id: string) => void;
}

export function AlbumEditView({ onEditAlbumId = "", revalidateAlbum }: Readonly<Props>): JSX.Element {
  const [unsavedChanges, setUnsavedChanges] = React.useState<ChangesSaveState>(ChangesSaveState.Saved);
  const [oldImages, setOldImages] = React.useState<GalleryImage[]>([]);
  const [newImages, setNewImages] = React.useState<GalleryImage[]>([]);
  const [unsavedImages, setUnsavedImages] = React.useState<GalleryImage[]>([]);
  const newImagesRef = React.useRef<GalleryImage[]>([]);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
  const [localAlbumName, setLocalAlbumName] = React.useState("");
  const [localAlbumTags, setLocalAlbumTags] = React.useState<readonly DefinedTag[]>([]);
  const [albumId, setAlbumId] = React.useState(onEditAlbumId);
  const [currentSegment, setCurrentSegment] = React.useState<ImagesSegment>(
    onEditAlbumId ? ImagesSegment.OldImages : ImagesSegment.NewImages
  );
  const [postImageIndex, setPostImageIndex] = React.useState(-1);
  const [localAlbumDescription, setLocalAlbumDescription] = React.useState("");
  const [localLocale, setLocalLocale] = React.useState<LocaleValue | undefined>();
  const router = useRouter();

  const {
    isLoading: headersLoading,
    data,
    refetch
  } = useQuery({
    queryKey: ["get-album", albumId],
    queryFn: () => getAlbumQuery(albumId),
    enabled: !!albumId,
    refetchOnWindowFocus: false
  });

  const albumName = data?.albumName || "";
  const tags = data?.tags;
  const description = data?.description;
  const locale = data?.locale;

  React.useEffect(() => {
    if (data?.snapImages) {
      setOldImages(data?.snapImages);
    }
  }, [data?.snapImages]);

  React.useEffect(() => {
    const newUnsavedImages = newImages.filter((image) => image.loadState !== FileLoadState.uploaded);
    setUnsavedImages(newUnsavedImages);
    newImagesRef.current = newImages;
  }, [newImages]);

  const { mutate: arrangeAlbumPictures, isLoading: arrangeAlbumPicturesLoading } = useMutation<
    AxiosResponse<null>,
    AxiosError<ApiMessage>,
    string[]
  >((savedIds: string[]) => putAlbumPicturesIds(oldImages || [], savedIds, albumId), {
    onError: (localError: AxiosError<ApiMessage>) => pushServerError(setErrorMessages, localError),
    onSettled: () =>
      onArrangePicturesSettled(unsavedImages, setNewImages, setCurrentSegment, onEditAlbumId, revalidateAlbum)
  });

  const { mutate: postAlbumPictures, isLoading: postAlbumPicturesLoading } = useMutation<
    SendImagesPortionRes,
    AxiosError<ApiMessage>,
    GalleryImage[]
  >((imagesPortion: GalleryImage[]) => sendImagesPortion(albumId, imagesPortion), {
    onError: (localError: AxiosError<ApiMessage>) =>
      onSendImagesError(localError, setNewImages, setErrorMessages, setPostImageIndex),
    onSuccess: (res: SendImagesPortionRes) => onSendImagesSuccess(setNewImages, setPostImageIndex, res)
  });

  React.useEffect(() => {
    const images = newImagesRef.current;
    if (postImageIndex >= images.length) {
      onSendImagesFinished(images, arrangeAlbumPictures, setPostImageIndex);
    } else if (postImageIndex !== -1) {
      sendPendingImagesPortion(postImageIndex, images, setNewImages, setPostImageIndex, postAlbumPictures);
    }
  }, [postImageIndex, newImagesRef, postAlbumPictures, arrangeAlbumPictures]);

  const { mutate: saveAlbumHeaders, isLoading: saveAlbumHeadersLoading } = useMutation<
    AxiosResponse<{ id?: string }>,
    AxiosError<ApiMessage>
  >(
    () =>
      saveAlbumHeadersMutation({
        id: albumId,
        albumName: localAlbumName,
        tags: localAlbumTags.map(mapDefinedTagToStr),
        description: localAlbumDescription,
        locale: localLocale
      }),
    {
      onError: (localError: AxiosError<ApiMessage>) => pushServerError(setErrorMessages, localError),
      onSuccess: (response: AxiosResponse<{ id?: string }>) =>
        onSaveAlbumHeadersSuccess(setAlbumId, setUnsavedChanges, setPostImageIndex, response.data),
      retry: false
    }
  );

  const { mutate: deleteAlbum, isLoading: deleteAlbumLoading } = useMutation<AxiosResponse, AxiosError<ApiMessage>>(
    () => deleteAlbumMutation(albumId),
    {
      onError: (localError: AxiosError<ApiMessage>) => pushServerError(setErrorMessages, localError),
      onSuccess: () => router.back()
    }
  );

  React.useEffect(
    () =>
      resetHeaders({
        setLocalAlbumName,
        setLocalAlbumTags,
        setLocalAlbumDescription,
        setLocalLocale,
        locale,
        albumName,
        description,
        tags
      }),
    [tags, albumName, description, locale]
  );

  React.useEffect(() => {
    const changed =
      albumName !== localAlbumName ||
      description !== localAlbumDescription ||
      locale !== localLocale ||
      tagsChanged(tags || [], localAlbumTags);
    setUnsavedChanges(changed ? ChangesSaveState.Unsaved : ChangesSaveState.Saved);
  }, [albumName, localAlbumName, tags, localAlbumTags, description, localAlbumDescription, locale, localLocale]);

  React.useEffect(
    () => () => {
      clearImagesArray(newImagesRef.current);
    },
    [newImagesRef]
  );

  const headersFetching =
    headersLoading ||
    saveAlbumHeadersLoading ||
    deleteAlbumLoading ||
    postAlbumPicturesLoading ||
    arrangeAlbumPicturesLoading ||
    postImageIndex !== -1;

  const canSave = !!(
    (unsavedChanges === ChangesSaveState.Saving ||
      unsavedChanges === ChangesSaveState.Unsaved ||
      newImages.length ||
      imagesChanged(oldImages, data?.snapImages)) &&
    localAlbumName
  );

  return (
    <div className="main__scrollWrapper">
      <div className="main__page">
        <AlbumHeaderEdit
          imageCover={data?.fullImages?.length ? data?.fullImages?.[0] : newImages?.[0]}
          newImages={newImages}
          oldImages={oldImages}
          albumId={albumId}
          localAlbumName={localAlbumName}
          localAlbumTags={localAlbumTags}
          setLocalAlbumName={setLocalAlbumName}
          setLocalAlbumTags={setLocalAlbumTags}
          onSaveChanges={() => onSaveChanges(saveAlbumHeaders, setPostImageIndex, unsavedChanges)}
          onAddImages={() => addImages(setNewImages, setErrorMessages, setCurrentSegment)}
          onReset={() => onReset(setNewImages, refetch)}
          isFetching={headersFetching}
          canSave={canSave}
          onDelete={deleteAlbum}
          currentSegment={currentSegment}
          setCurrentSegment={setCurrentSegment}
          localAlbumDescription={localAlbumDescription}
          setLocalAlbumDescription={setLocalAlbumDescription}
          localLocale={localLocale}
          setLocalLocale={setLocalLocale}
          onAddDrawing={(fileData) => addDrawImage(fileData, setNewImages, setErrorMessages, setCurrentSegment)}
        />
        <GalleryAlbumImagesList
          images={currentSegment === ImagesSegment.OldImages ? oldImages : newImages}
          setImages={currentSegment === ImagesSegment.OldImages ? setOldImages : setNewImages}
          deleteDisabled={headersFetching}
          isCopyUrlEnabled={currentSegment === ImagesSegment.OldImages}
        />
      </div>
      {errorMessages?.length ? (
        <Modal
          onClose={() => setErrorMessages(shiftArrayElement)}
          header={errorMessages[0]}
          modalType={ModalType.Info}
        />
      ) : null}
    </div>
  );
}
