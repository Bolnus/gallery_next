import React from "react";
import { SpinnerProgressBar } from "./SpinnerProgressBar";
import { FileLoadState } from "../../lib/common/galleryTypes";

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
        isComplete={progress === FileLoadState.uploaded}
        isFailed={progress === FileLoadState.uploadFailed || progress === FileLoadState.uploadCanceled}
        onCancel={() => setProgress(FileLoadState.uploadCanceled)}
      />
    </div>
  );
}
