export interface ImportedTextFile {
  name: string;
  relativePath: string;
  content: string;
}

export enum ImportType {
  Directory = "Directory",
  Multiple = "Multiple",
  Single = "Single"
}

export enum ImageLoadError {
  SIZE_LIMIT = "SIZE_LIMIT",
  PARSE = "PARSE"
}
