import React from "react";
import { createPortal } from "react-dom";
import NextImage from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import classes from "./ImageSlider.module.scss";
import { FileLoadState, GalleryImage } from "../../../lib/common/galleryTypes";
import { getUnitedClassnames } from "../../../lib/common/commonUtils";
import { ButtonIcon } from "../../button/ButtonIcon/ButtonIcon";
import { UiSize } from "../../../lib/common/commonTypes";
import { IconName } from "../../icons/ReactIcon/types";
import { NextButton, PrevButton } from "./sliderButtons";
import { SliderHeader } from "./SliderHeader";
import { useImageSrc } from "../../../lib/hooks/useImgSrc";

interface ImageSliderProps {
  images: GalleryImage[];
  currentViewId: string;
  header?: string;
  onClose: () => void;
}

interface FullImageProps {
  setToolBarActive: React.Dispatch<React.SetStateAction<boolean>>;
  element: GalleryImage;
}

function FullImage({ setToolBarActive, element }: Readonly<FullImageProps>) {
  const { localSrc, setLocalLoadState } = useImageSrc({
    url: element.url,
    startLoadState: element.loadState
  });

  return (
    <div className={classes.imageWrapper}>
      <NextImage
        alt={element.name || "not found"}
        src={localSrc}
        width={0}
        height={0}
        fill
        sizes="100vw"
        quality="100"
        onClick={() => setToolBarActive((prev) => !prev)}
        className={classes.image}
        onError={() => setLocalLoadState(FileLoadState.downloadFailed)}
      />
    </div>
  );
}

export function ImageSlider({
  images,
  currentViewId,
  header,
  onClose
}: Readonly<ImageSliderProps>): JSX.Element | null {
  const [imageIndex, setImageIndex] = React.useState(-1);
  const [toolBarActive, setToolBarActive] = React.useState(true);
  const domNode = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const element = document.createElement("div");
    domNode.current = element;
    document.body.appendChild(element);
    element.className = classes.portal;
    return () => {
      document.body.removeChild(element);
    };
  }, []);

  React.useEffect(() => {
    if (currentViewId) {
      for (let i = 0; i < images.length; i++) {
        if (images[i].id === currentViewId) {
          setImageIndex(i);
        }
      }
    } else {
      setImageIndex(-1);
    }
  }, [currentViewId, images]);

  if (!currentViewId || imageIndex === -1) {
    return null;
  }
  const prevVisible = imageIndex > 0 && toolBarActive;
  const nextVisible = imageIndex !== images.length - 1 && toolBarActive;

  return (
    domNode.current &&
    createPortal(
      <div className={classes.photoViewBlock}>
        {toolBarActive ? (
          <>
            <header className={getUnitedClassnames([classes.photoViewToolBar, classes.photoViewToolBar_header])}>
              <div className={classes.photoViewToolBar__button} />
              <SliderHeader title={header} description={`${imageIndex + 1} / ${images.length}`} />
              <ButtonIcon onClick={onClose} iconName={IconName.Close} size={UiSize.MediumAdaptive} color="white" />
              <div className={classes.photoViewToolBar__background} />
            </header>
            {/* <footer className={getUnitedClassnames([classes.photoViewToolBar, classes.photoViewToolBar_footer])}>
              <button
              onClick={() => invertTrigger(modalVisible, setModalVisible)}
              className={`${classes.photoViewToolBar__button} emojiFont`}
            >
              🗑️
            </button>
              <div className={classes.photoViewToolBar__background} />
            </footer> */}
          </>
        ) : null}
        <Slider
          vertical={false}
          arrows
          initialSlide={imageIndex}
          infinite={false}
          afterChange={(currentSlide: number) => setImageIndex(currentSlide)}
          lazyLoad="anticipated"
          touchThreshold={10}
          slidesToShow={1}
          slidesToScroll={1}
          prevArrow={prevVisible ? <PrevButton /> : undefined}
          nextArrow={nextVisible ? <NextButton /> : undefined}
        >
          {images.map((element: GalleryImage) => (
            <FullImage setToolBarActive={setToolBarActive} element={element} key={element.id} />
          ))}
        </Slider>
        {/* {modalVisible ? (
        <Modal
          onClose={() => invertTrigger(setModalVisible)}
          header="Удалить?"
          modalType={ModalType.DeleteDialog}
          onOk={() => deleteCurrentImage(props.images[imageIndex]?.id, props.deleteImage)}
        />
      ) : null} */}
      </div>,
      domNode.current
    )
  );
}
