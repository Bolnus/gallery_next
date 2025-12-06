import React from "react";
import classes from "./SpinnerProgressBar.module.scss";
import { getUnitedClassnames } from "../../lib/common/commonUtils";
import { ReactIcon } from "../icons/ReactIcon/ReactIcon";
import { IconName } from "../icons/ReactIcon/types";
import { FileLoadStateStartedUploading, FileLoadStateUploadPlanned } from "../../lib/common/galleryTypes";
import { UiSize } from "../../lib/common/commonTypes";
import { ButtonIcon } from "../button/ButtonIcon/ButtonIcon";

interface ProgressBarProps {
  percent: number;
  isComplete: boolean;
  isFailed?: boolean;
  onCancel?: () => void;
  showCancelButton?: boolean;
  className?: string;
  cancelTitle?: string;
}

function autoIncrementProgressBar(intervalId: React.MutableRefObject<NodeJS.Timeout | null>, prev: number): number {
  if (prev > 90) {
    intervalId.current = null;
    return prev;
  }
  return prev + 5;
}

export function SpinnerProgressBar({
  percent,
  isComplete,
  isFailed,
  onCancel,
  className,
  cancelTitle
}: Readonly<ProgressBarProps>): JSX.Element {
  const [showCheck, setShowCheck] = React.useState(false);
  const [showFailed, setShowFailed] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const intervalId = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    setProgress(Math.max(0, Math.min(100, percent)));
    intervalId.current = null;
    if (percent === FileLoadStateStartedUploading) {
      setInterval(() => setProgress((prev) => autoIncrementProgressBar(intervalId, prev)), 400);
    }
  }, [percent]);

  React.useEffect(() => {
    // When complete, trigger the animation
    if (isComplete && !isFailed) {
      setShowCheck(true);
    }

    // When failed, show the failed state
    if (isFailed) {
      setShowFailed(true);
    }
  }, [isComplete, isFailed]);

  return (
    <div className={getUnitedClassnames([classes.container, className])}>
      <div
        className={getUnitedClassnames([classes.progressBar, isFailed ? classes.progressBarFailed : ""])}
        style={{
          clipPath: `inset(0 ${100 - progress}% 0 0)`,
          opacity: isComplete || isFailed ? 0 : 1,
          background: progress > 0 && progress < 100 ? "rgba(227, 228, 221, 0.5)" : undefined
        }}
      />

      <div className={classes.contentContainer}>
        {!isComplete && !isFailed && progress > 0 && progress < 100 && (
          <ReactIcon iconName={IconName.Loader} className={classes.spinner} />
        )}

        {!isComplete && !isFailed && progress === FileLoadStateUploadPlanned && (
          <ButtonIcon
            onClick={onCancel}
            className={classes.cancelButton}
            iconName={IconName.Close}
            aria-label={cancelTitle}
            title={cancelTitle}
            size={UiSize.SmallAdaptive}
            color="var(--fontColorFirm)"
          />
        )}

        {(isComplete || isFailed) && (
          <div
            className={classes.checkContainer}
            style={
              {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "--transform": showCheck || showFailed ? "scale(1)" : "scale(0)",
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "--opacity": showCheck || showFailed ? "1" : "0"
              } as React.CSSProperties
            }
          >
            <div className={classes.checkIconContainer}>
              <ReactIcon
                iconName={isFailed ? IconName.LocalError : IconName.Check}
                color={isFailed ? "red" : "var(--fontColorGreenInverted)"}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
