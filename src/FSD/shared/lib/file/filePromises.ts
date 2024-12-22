import { ImportedTextFile } from "./types";

const FILE_SIZE_LIMIT = 10 * 1024 * 1024;

/** Вызов колбека с результатом чтения файла */
const readTextFileOnLoad = (
  resolve: (value: ImportedTextFile) => void,
  file: File,
  localEvent: ProgressEvent<FileReader>
): void => {
  const fileReader = localEvent.target;
  const importedText = fileReader?.result?.toString() || "";
  const relativePath = file?.webkitRelativePath;
  resolve({ content: importedText, name: file.name, relativePath });
};

/** Создание промиса для чтения файла с обработкой ошибки чтения */
const createFileReaderLoadPromise = (
  reader: FileReader,
  file: File,
  resolve: (value: ImportedTextFile) => void,
  reject: (reason: unknown) => void
): void => {
  reader.onload = (localEvent: ProgressEvent<FileReader>) => readTextFileOnLoad(resolve, file, localEvent);
  reader.onerror = reject;
};

/** Асинхронное чтение файла */
const readTextFile = async (reader: FileReader, file: File): Promise<ImportedTextFile> => {
  const promise = new Promise<ImportedTextFile>((resolve, reject) =>
    createFileReaderLoadPromise(reader, file, resolve, reject)
  );
  reader.readAsText(file);
  return promise;
};

/** Рекурсивное последовательное чтение файла с вызовом колбека с финальным результатом */
const readPendingTextFile = (
  resolve: (value: ImportedTextFile[]) => void,
  reader: FileReader,
  validFiles: File[],
  resultFiles: ImportedTextFile[],
  currentFileIndex: number
): void => {
  readTextFile(reader, validFiles[currentFileIndex])
    .then((value: ImportedTextFile) => {
      resultFiles.push(value);
    })
    .catch((localError) => console.warn(localError))
    .finally(() => {
      if (currentFileIndex < validFiles.length) {
        readPendingTextFile(resolve, reader, validFiles, resultFiles, currentFileIndex + 1);
      } else {
        resolve(resultFiles);
      }
    });
};

/** Формирование списка прочитанных файлов, каждый из которых не больше FILE_SIZE_LIMIT  */
const onFileInputChange = (resolve: (value: ImportedTextFile[]) => void, localEvent: Event): void => {
  const reader = new FileReader();
  const { files } = localEvent.currentTarget as HTMLInputElement;
  const definedFiles: ImportedTextFile[] = [];
  if (!files || !files?.length) {
    resolve([]);
    return;
  }
  const validFiles: File[] = [];
  for (let i = 0; i < files.length; i++) {
    if (files[i].size < FILE_SIZE_LIMIT) {
      validFiles.push(files[i]);
    }
  }
  readPendingTextFile(resolve, reader, validFiles, definedFiles, 0);
};

/** Импорт одного файла или файлов из директории рекурсивно */
const importFilesFromFS = (resolve: (value: ImportedTextFile[]) => void, fromDirectory?: boolean): void => {
  const inputElement = document.createElement("input");
  inputElement.type = "file";
  if (fromDirectory) {
    inputElement.id = "ctrl";
    // @ts-ignore
    inputElement.webkitdirectory = true;
    // @ts-ignore
    inputElement.directory = true;
    inputElement.multiple = true;
  }
  inputElement.onchange = (localEvent: Event) => onFileInputChange(resolve, localEvent);
  document.body.appendChild(inputElement);
  inputElement.click();
  document.body.removeChild(inputElement);
};

/** Асинхронное формирование массива прочитанных из файловой системы файлов
 * @fromDirectory true: выбор нескольких файлов через директорию, false: выбор одного файла
 */
export const getTextFiles = async (fromDirectory?: boolean): Promise<ImportedTextFile[]> => {
  const promise = new Promise<ImportedTextFile[]>((resolve) => importFilesFromFS(resolve, fromDirectory));
  return promise;
};

/** Асинхронное формирование текста прочитанного из файловой системы файла */
export const getSingleTextFile = async (): Promise<string> => {
  const files = await getTextFiles();
  return files?.[0]?.content;
};
