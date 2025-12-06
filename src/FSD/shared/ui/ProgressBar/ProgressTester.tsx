import React from "react";
import { SpinnerProgressBar } from "./SpinnerProgressBar";
import {
  FileLoadStateUploadCanceled,
  FileLoadStateUploaded,
  FileLoadStateUploadFailed
} from "../../lib/common/galleryTypes";

export function ProgressTester(): JSX.Element {
  const [progress, setProgress] = React.useState(0);
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input
        type="number"
        step="1"
        value={progress}
        onChange={(e) => setProgress(e.target.valueAsNumber)}
        style={{ height: "20px" }}
      />
      <SpinnerProgressBar
        percent={progress}
        isComplete={progress === FileLoadStateUploaded}
        isFailed={progress === FileLoadStateUploadFailed || progress === FileLoadStateUploadCanceled}
        onCancel={() => setProgress(FileLoadStateUploadCanceled)}
      />
    </div>
  );
}
