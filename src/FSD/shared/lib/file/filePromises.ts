import { FILE_SIZE_LIMIT } from "./consts";
import { ImageLoadError, ImportedTextFile, ImportType } from "./types";

function readTextFileOnLoad(
  resolve: (value: ImportedTextFile) => void,
  file: File,
  localEvent: ProgressEvent<FileReader>
): void {
  const fileReader = localEvent.target;
  if (!fileReader || !fileReader?.result) {
    throw new Error("Error readTextFileOnLoad");
  }
  const importedText = (fileReader.result as string).toString();
  const relativePath = file?.webkitRelativePath;
  resolve({ content: importedText, name: file.name, relativePath });
}

function createFileReaderLoadPromise(
  reader: FileReader,
  file: File,
  resolve: (value: ImportedTextFile) => void,
  reject: (reason: unknown) => void
): void {
  reader.onload = (localEvent: ProgressEvent<FileReader>) => readTextFileOnLoad(resolve, file, localEvent);
  reader.onerror = reject;
}

export async function readTextFile(reader: FileReader, file: File): Promise<ImportedTextFile> {
  const promise = new Promise<ImportedTextFile>((resolve, reject) =>
    createFileReaderLoadPromise(reader, file, resolve, reject)
  );
  reader.readAsText(file);
  return promise;
}

function createImageLoadPromise(
  file: File,
  resolve: (value: string) => void,
  reject: (reason: ImageLoadError) => void
): void {
  if (file.size > FILE_SIZE_LIMIT) {
    reject(ImageLoadError.SIZE_LIMIT);
  }
  const image = new Image();
  const url = window.URL || window.webkitURL;
  image.src = url.createObjectURL(file);
  image.onload = () => resolve(image.src);
  image.onerror = () => reject(ImageLoadError.PARSE);
}

export async function getImageUrlFromFile(file: File): Promise<string> {
  const promise = new Promise<string>((resolve, reject) => createImageLoadPromise(file, resolve, reject));
  return promise;
}

function calculateScale(fileSize: number): number {
  if (fileSize > 5 * 1024 * 1024) {
    return 0.1;
  }
  if (fileSize > 2 * 1024 * 1024) {
    return 0.25;
  }
  if (fileSize > 1 * 1024 * 1024) {
    return 0.3;
  }
  if (fileSize > 500 * 1024) {
    return 0.6;
  }
  return 1;
}

function getDataURLFromBlob(
  blob: Blob | null,
  canvas: HTMLCanvasElement,
  resolve: (value: string) => void,
  reject: (reason: ImageLoadError) => void
) {
  const url = window.URL || window.webkitURL;
  if (!blob) {
    console.warn("Empty blob after compression");
    reject(ImageLoadError.PARSE);
    return;
  }
  resolve(url.createObjectURL(blob));
  canvas.remove();
}

function compressLoadedImage(
  image: HTMLImageElement,
  scale: number,
  resolve: (value: string) => void,
  reject: (reason: ImageLoadError) => void
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.warn("Error canvas.getContext");
    reject(ImageLoadError.PARSE);
    return;
  }
  const width = image.width * scale;
  const height = image.height * scale;
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
  canvas.toBlob((blob) => getDataURLFromBlob(blob, canvas, resolve, reject), "image/webp", scale);
}

function createImageCompressPromise(
  file: File,
  resolve: (value: string) => void,
  reject: (reason: ImageLoadError) => void
): void {
  if (file.size > FILE_SIZE_LIMIT) {
    reject(ImageLoadError.SIZE_LIMIT);
  }
  const scale = calculateScale(file.size);
  const image = new Image();
  const url = window.URL || window.webkitURL;
  image.src = url.createObjectURL(file);
  image.onload = (ev: Event) => compressLoadedImage(ev.target as HTMLImageElement, scale, resolve, reject);
  image.onerror = () => reject(ImageLoadError.PARSE);
}

export async function getCompressedImageURL(file: File): Promise<string> {
  const promise = new Promise<string>((resolve, reject) => createImageCompressPromise(file, resolve, reject));
  return promise;
}

function readPendingTextFile(
  resolve: (value: ImportedTextFile[]) => void,
  reader: FileReader,
  validFiles: File[],
  resultFiles: ImportedTextFile[],
  currentFileIndex: number
): void {
  readTextFile(reader, validFiles[currentFileIndex])
    .then((value: ImportedTextFile) => {
      resultFiles.push(value);
    })
    .catch((localError) => console.warn(localError))
    .finally(() => {
      if (currentFileIndex < validFiles.length - 1) {
        readPendingTextFile(resolve, reader, validFiles, resultFiles, currentFileIndex + 1);
      } else {
        resolve(resultFiles);
      }
    });
}

function getFileRefsOnFileInputChange(resolve: (value: File[]) => void, localEvent: Event): void {
  const { files } = localEvent.currentTarget as HTMLInputElement;
  if (!files || !files?.length) {
    resolve([]);
    return;
  }
  const validFiles: File[] = [];
  for (let i = 0; i < files.length; i++) {
    validFiles.push(files[i]);
  }
  resolve(validFiles);
}

function importFilesFromFS(
  resolve: (value: File[]) => void,
  reject: (err: unknown) => void,
  importType = ImportType.Single
): void {
  const inputElement = document.createElement("input");
  inputElement.type = "file";
  if (importType !== ImportType.Single) {
    inputElement.id = "ctrl";
    inputElement.multiple = true;
    inputElement.max = "50";
    if (importType === ImportType.Directory) {
      inputElement.webkitdirectory = true;
      // @ts-ignore
      inputElement.directory = true;
    }
  }
  inputElement.onchange = (localEvent: Event) => getFileRefsOnFileInputChange(resolve, localEvent);
  inputElement.onerror = reject;
  document.body.appendChild(inputElement);
  inputElement.click();
  document.body.removeChild(inputElement);
}

export async function getReadableFileRefs(importType?: ImportType): Promise<File[]> {
  const promise = new Promise<File[]>((resolve, reject) => importFilesFromFS(resolve, reject, importType));
  return promise;
}

export async function getTextFiles(importType?: ImportType): Promise<ImportedTextFile[]> {
  const fileRefs = await getReadableFileRefs(importType);
  const reader = new FileReader();
  const definedFiles: ImportedTextFile[] = [];
  const promise = new Promise<ImportedTextFile[]>((resolve) =>
    readPendingTextFile(resolve, reader, fileRefs, definedFiles, 0)
  );
  return promise;
}

export async function getSingleTextFile(): Promise<string> {
  const files = await getTextFiles();
  return files?.[0]?.content;
}

export async function base64ToFileFetch(base64String: string, fileName: string): Promise<File> {
  const response = await fetch(
    base64String.startsWith("data:") ? base64String : `data:application/octet-stream;base64,${base64String}`
  );

  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
}
