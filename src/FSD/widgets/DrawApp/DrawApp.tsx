import React from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import classes from "./DrawApp.module.scss";
import { ButtonIcon } from "../../shared/ui/button/ButtonIcon/ButtonIcon";
import { ButtonIconBackground } from "../../shared/ui/button/ButtonIcon/types";
import { IconName } from "../../shared/ui/icons/ReactIcon/types";
import { UiSize } from "../../shared/lib/common/commonTypes";

async function onExportLocal(
  canvas: ReactSketchCanvasRef | null,
  onExport: (imageSrc: string) => void,
  onClose: () => void
) {
  const data = (await canvas?.exportImage("jpeg")) || "";
  onExport(data);
  onClose();
}

interface Props {
  onClose: () => void;
  onExport: (imageSrc: string) => void;
}

export function DrawingApp({ onClose, onExport }: Readonly<Props>): JSX.Element {
  const canvasRef = React.useRef<ReactSketchCanvasRef>(null);
  const [isEraser, setIsEraser] = React.useState(false);
  const domNode = React.useRef<HTMLDivElement>(document.createElement("div"));
  const [color, setColor] = React.useState("#f6a89e");
  const [strokeWidth, setStrokeWidth] = React.useState(10);

  React.useEffect(() => {
    const element = domNode.current;
    document.body.appendChild(element);
    element.className = classes.portal;
    return () => {
      document.body.removeChild(element);
    };
  });

  React.useEffect(() => canvasRef.current?.eraseMode(isEraser), [canvasRef, isEraser]);

  return (
    <div className={classes.root}>
      <div className={classes.drawApp}>
        <div className={classes.drawApp__toolBar}>
          <div className={classes.drawApp__rangeInputContainer}>
            <input
              type="range"
              className={classes.drawApp__rangeInput}
              min="2"
              max="1000"
              value={strokeWidth}
              onChange={(localEvent) => setStrokeWidth(localEvent.target.valueAsNumber)}
            />
          </div>
          <ButtonIcon
            background={ButtonIconBackground.TransparentMainColor}
            onClick={() => canvasRef.current?.undo()}
            iconName={IconName.ChevronLeft}
            size={UiSize.MediumAdaptive}
            color="var(--fontColorFirm)"
          />
          <ButtonIcon
            background={ButtonIconBackground.TransparentMainColor}
            onClick={() => canvasRef.current?.redo()}
            iconName={IconName.ChevronRight}
            size={UiSize.MediumAdaptive}
            color="var(--fontColorFirm)"
          />
          <input
            type="color"
            className={classes.drawApp__colorInput}
            value={color}
            onChange={(localEvent) => setColor(localEvent.target.value)}
          />
          <ButtonIcon
            background={ButtonIconBackground.TransparentMainColor}
            onClick={() => setIsEraser((prev) => !prev)}
            iconName={isEraser ? IconName.Eraser : IconName.Edit}
            size={UiSize.MediumAdaptive}
            color="var(--fontColorFirm)"
          />
          <ButtonIcon
            background={ButtonIconBackground.TransparentMainColor}
            onClick={onClose}
            iconName={IconName.Close}
            size={UiSize.MediumAdaptive}
            color="var(--fontColorFirm)"
          />
        </div>
        <div className={classes.drawApp__canvasContainer}>
          <ReactSketchCanvas
            width="100%"
            height="100%"
            canvasColor="white"
            strokeColor={color}
            strokeWidth={strokeWidth}
            eraserWidth={strokeWidth + 20}
            ref={canvasRef}
          />
        </div>
        <div className={classes.drawApp__toolBar}>
          <ButtonIcon
            background={ButtonIconBackground.TransparentMainColor}
            onClick={() => onExportLocal(canvasRef.current, onExport, onClose)}
            iconName={IconName.Check}
            size={UiSize.MediumAdaptive}
            color="var(--fontColorFirm)"
          />
        </div>
      </div>
    </div>
  );
}
