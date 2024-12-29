import React from "react";
import { createPortal } from "react-dom";
import classes from "./Modal.module.scss";
import { onCallbackExec } from "../../lib/common/commonUtils";

export enum ModalType {
  DeleteDialog = 0,
  Info = 1
}

export interface ModalProps {
  onClose: () => void;
  modalType: ModalType;
  header: string;
  onOk?: () => void;
}

function onBackGroundClicked(onClose: () => void, localEvent: React.FormEvent) {
  if (localEvent.currentTarget !== localEvent.target) {
    return;
  }
  onClose();
}

function onOkClicked(onClose: () => void, onOk?: () => void) {
  if (onOk) {
    onOk();
  }
  onClose();
}

export function Modal({ modalType, header, onClose, onOk }: ModalProps) {
  const domNode = React.useRef<HTMLDivElement>(document.createElement("div"));

  React.useEffect(function () {
    const element = domNode.current;
    document.body.appendChild(element);
    element.className = classes.portal;
    return function () {
      document.body.removeChild(element);
    };
  }, []);

  let modalContent = null;
  switch (modalType) {
    case ModalType.DeleteDialog:
      modalContent = (
        <>
          <button
            className={`pushButton ${classes.modal__pb} ${classes.modal__pb_left} ${classes.modal__pb_normal}`}
            onClick={(localEvent: React.MouseEvent) => onCallbackExec(onClose, localEvent)}
          >
            Cancel
          </button>
          <button
            className={`pushButton ${classes.modal__pb} ${classes.modal__pb_right} ${classes.modal__pb_alert}`}
            onClick={() => onOkClicked(onClose, onOk)}
          >
            Yes
          </button>
        </>
      );
      break;
    case ModalType.Info:
      modalContent = (
        <>
          <button
            className={`pushButton ${classes.modal__pb} ${classes.modal__pb_wide} ${classes.modal__pb_normal}`}
            onClick={(localEvent: React.MouseEvent) => onCallbackExec(onClose, localEvent)}
          >
            Ok
          </button>
        </>
      );
      break;
  }

  return createPortal(
    <div onClick={(localEvent: React.MouseEvent) => onBackGroundClicked(onClose, localEvent)} className={classes.root}>
      <div className={classes.modal}>
        <h4>{header}</h4>
        {modalContent}
      </div>
    </div>,
    domNode.current
  );
}
