import React from "react";
import { FileLoadState } from "../common/galleryTypes";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

function initNewTry(
  retryCountRef: React.MutableRefObject<number>,
  setLocalLoadState: (state: FileLoadState) => void,
  setLocalSrc: (str: string) => void,
  newSrc: string
) {
  retryCountRef.current += 1;
  setLocalLoadState(FileLoadState.downloading);
  setLocalSrc(newSrc);
}

interface ImageSrcConfig {
  url?: string;
  startLoadState?: FileLoadState;
}

interface ImageSrcResult {
  isLoading: boolean;
  localSrc: string;
  localLoadState?: FileLoadState;
  setLocalLoadState: React.Dispatch<React.SetStateAction<FileLoadState | undefined>>;
}

/** Regenerating image src with retries */
export function useImageSrc({ url, startLoadState }: ImageSrcConfig): ImageSrcResult {
  const [localLoadState, setLocalLoadState] = React.useState<FileLoadState | undefined>(startLoadState);
  const isLoading = localLoadState !== FileLoadState.uploaded && localLoadState !== FileLoadState.downloaded;
  const [localSrc, setLocalSrc] = React.useState(url || "");
  const retryCountRef = React.useRef(0);

  React.useEffect(() => {
    let timeOutId: ReturnType<typeof setTimeout>;
    if (localLoadState === FileLoadState.downloadFailed && retryCountRef.current < MAX_RETRIES) {
      timeOutId = setTimeout(
        () => initNewTry(retryCountRef, setLocalLoadState, setLocalSrc, `${url}&retry=${retryCountRef.current + 1}`),
        RETRY_DELAY_MS
      );
    }
    return () => timeOutId && clearTimeout(timeOutId);
  }, [localLoadState, url, setLocalLoadState]);

  return {
    localSrc,
    isLoading,
    localLoadState,
    setLocalLoadState
  };
}
