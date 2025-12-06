"use client";
import React from "react";
import classes from "./NewAlbumPage.module.scss";
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
  updateLoadingPortion,
  sendImagesPortion,
  onSendImagesSuccess,
  onArrangePicturesSettled,
  initUploadingImages,
  clearImagesArray,
  onReset,
  imagesChanged
} from "../lib/albumEditUtils";
import { AlbumHeaderEdit } from "../../../widgets/AlbumHeader/ui/AlbumHeaderEdit";
import { ChangesSaveState } from "../../../entities/album/model/albumTypes";
import { useMutation, useQuery } from "react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ApiMessage } from "../../../shared/api/apiTypes";
import { deleteAlbumMutation, getAlbumQuery, saveAlbumHeadersMutation } from "../../../shared/api/album/albumApi";
import { useRouter } from "next/navigation";
import { ImagesSegment } from "../../../widgets/AlbumHeader/lib/types";
import { SendImagesPortionRes } from "../lib/types";
import { FILE_SIZE_LIMIT } from "../../../shared/lib/file/consts";
import { GalleryAlbumImagesList } from "./GalleryAlbumImagesList";

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
    let images = newImagesRef.current;
    if (postImageIndex >= images.length) {
      const savedIds: string[] = [];
      for (let i = 0; i < images.length; i++) {
        if (images[i].loadState === FileLoadState.uploaded) {
          savedIds.push(images[i].id);
        }
      }
      arrangeAlbumPictures(savedIds);
      setPostImageIndex(-1);
    } else if (postImageIndex !== -1) {
      if (postImageIndex === 0) {
        setNewImages(initUploadingImages);
        images = initUploadingImages(images);
      }
      const imagesPortion: GalleryImage[] = [];
      let portionSize = 0;
      for (let i = postImageIndex; i < images.length; i++) {
        if (images[i].loadState !== FileLoadState.uploaded && images[i].loadState !== FileLoadState.uploadCanceled) {
          portionSize = portionSize + (images[i].data as File)?.size;
          if (portionSize > FILE_SIZE_LIMIT || imagesPortion.length > 8) {
            break;
          }
          imagesPortion.push(images[i]);
        }
      }
      setNewImages((prev: GalleryImage[]) => updateLoadingPortion(imagesPortion, prev));
      if (imagesPortion.length) {
        postAlbumPictures(imagesPortion);
      } else {
        setTimeout(() => setPostImageIndex(images.length), 20);
      }
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
        description: localAlbumDescription
      }),
    {
      onError: (localError: AxiosError<ApiMessage>) => pushServerError(setErrorMessages, localError),
      onSuccess: (response: AxiosResponse<{ id?: string }>) =>
        onSaveAlbumHeadersSuccess(setAlbumId, setUnsavedChanges, setPostImageIndex, response.data)
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
      resetHeaders({ setLocalAlbumName, setLocalAlbumTags, setLocalAlbumDescription, albumName, description, tags }),
    [tags, albumName, description]
  );

  React.useEffect(() => {
    const changed =
      albumName !== localAlbumName || description !== localAlbumDescription || tagsChanged(tags || [], localAlbumTags);
    setUnsavedChanges(changed ? ChangesSaveState.Unsaved : ChangesSaveState.Saved);
  }, [albumName, localAlbumName, tags, localAlbumTags, description, localAlbumDescription]);

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
    <div className={classes.newAlbumPage}>
      <div className={classes.scrollWrapper}>
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
          onAddImages={() => void addImages(setNewImages, setErrorMessages, setCurrentSegment)}
          onReset={() => onReset(setNewImages, refetch)}
          isFetching={headersFetching}
          canSave={canSave}
          onDelete={deleteAlbum}
          currentSegment={currentSegment}
          setCurrentSegment={setCurrentSegment}
          localAlbumDescription={localAlbumDescription}
          setLocalAlbumDescription={setLocalAlbumDescription}
        />
        <GalleryAlbumImagesList
          images={currentSegment === ImagesSegment.OldImages ? oldImages : newImages}
          setImages={currentSegment === ImagesSegment.OldImages ? setOldImages : setNewImages}
          deleteDisabled={headersFetching}
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
