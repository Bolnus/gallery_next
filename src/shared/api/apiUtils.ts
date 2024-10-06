import { Album, DefinedTag, FileLoadState, GalleryImage } from "../lib/common/galleryTypes";
import { ApiAlbum, ApiTag } from "./apiTypes";
import { baseURL } from "./galleryApi";

export function mapTags(tagApi: ApiTag): DefinedTag {
  return {
    tagName: tagApi.tagName,
    id: tagApi._id
  };
}

function mapPictureIdToSnapRef(pictureId: string): GalleryImage {
  return {
    id: pictureId,
    name: pictureId,
    url: `${baseURL}/albums_list/album/picture?id=${pictureId}&sizing=snap`,
    loadState: FileLoadState.downloaded
  };
}

export function mapPictureIdToFullRef(pictureId: string): GalleryImage {
  return {
    id: pictureId,
    name: pictureId,
    url: `${baseURL}/albums_list/album/picture?id=${pictureId}`,
    loadState: FileLoadState.downloaded
  };
}

export function mapAlbums(albumApi: ApiAlbum): Album {
  const album: Album = {
    id: albumApi._id,
    albumName: albumApi.albumName,
    changedDate: albumApi.changedDate,
    picturesSnap: [],
    albumSize: albumApi.albumSize,
    tags: albumApi.tags.map(mapTags)
  };
  if (albumApi.pictureIds.length) {
    album.picturesSnap = albumApi.pictureIds.map(mapPictureIdToSnapRef);
  }
  return album;
}

export function getProxyProtocol(): string {
  if (global.window) {
    return window.location.protocol;
  }
  return "http";
}

export function getProxyHostname(): string {
  if (global.window) {
    return window.location.hostname;
  }
  return "localhost";
}
