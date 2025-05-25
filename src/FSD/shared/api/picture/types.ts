// export interface UploadImageData {
//   id: string;
//   pictureNumber: number;
// }

export type UploadImageData = [string, number];

export interface PostPicturesResp {
  imageIds: [string, string][];
}
