import {
  Album,
  AlbumHeaders,
  AlbumsCategory,
  DefinedTag,
  FileLoadState,
  GalleryImage
} from "../lib/common/galleryTypes";
import { ApiAlbum, ApiTag } from "./apiTypes";

export function mapTags(tagApi: ApiTag): DefinedTag {
  return {
    tagName: tagApi.tagName,
    id: tagApi._id,
    albumsCount: tagApi.albumsCount
  };
}

function mapPictureIdToSnapRef(pictureId: string): GalleryImage {
  return {
    id: pictureId,
    name: pictureId,
    url: `${getClientProxyUrl()}/albums_list/album/picture/${pictureId}?sizing=snap`,
    loadState: FileLoadState.downloading
  };
}

export function mapPictureIdToFullRef(pictureId: string): GalleryImage {
  return {
    id: pictureId,
    name: pictureId,
    url: `${getClientProxyUrl()}/albums_list/album/picture/${pictureId}`,
    loadState: FileLoadState.downloading
  };
}

export function mapApiTagToCategory(tagApi: ApiTag): AlbumsCategory {
  return {
    ...mapTags(tagApi),
    coverSnap: mapPictureIdToSnapRef(tagApi.coverId || "")
  };
}

export function mapAlbums(albumApi: ApiAlbum): Album {
  const album: Album = {
    id: albumApi._id,
    albumName: albumApi.albumName,
    changedDate: albumApi.changedDate,
    snapImages: [],
    albumSize: albumApi.albumSize,
    tags: albumApi.tags.map(mapTags),
    description: albumApi.description || "",
    locale: albumApi.locale
  };
  if (albumApi.pictureIds?.length) {
    album.snapImages = albumApi.pictureIds.map(mapPictureIdToSnapRef);
  }
  return album;
}

export function mapAlbumHeaders(albumApi: ApiAlbum): AlbumHeaders {
  const album: AlbumHeaders = {
    id: albumApi._id,
    albumName: albumApi.albumName,
    changedDate: albumApi.changedDate,
    albumSize: albumApi.albumSize,
    tags: albumApi.tags.map(mapTags),
    description: albumApi.description || ""
  };
  return album;
}

export function getProxyProtocol(): string {
  if (global.window) {
    return window.location.protocol;
  }
  return "http:";
}

export function getProxyHostname(): string {
  if (global.window) {
    return window.location.hostname;
  }
  return "localhost";
}

export function getClientProxyUrl(): string {
  const proxyPort = process.env.NEXT_PUBLIC_PROXY_PORT ? `:${process.env.NEXT_PUBLIC_PROXY_PORT}` : "";
  const baseEndpoint = process.env.NEXT_PUBLIC_ENDPOINT || "";
  if (global.window) {
    return `${getProxyProtocol()}//${getProxyHostname()}${proxyPort}${baseEndpoint}`;
  }
  const proxyUrl = process.env.NEXT_PUBLIC_PROXY_URL || "http://localhost";
  return `${proxyUrl}${proxyPort}${baseEndpoint}`;
}
