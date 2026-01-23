import ReactMarkdown from "react-markdown";
import NextImage from "next/image";
import classes from "./AlbumPage.module.scss";
import { AlbumHeader } from "../../../widgets/AlbumHeader/ui/AlbumHeader";
import { AlbumImagesGrid } from "../../../widgets/AlbumImagesGrid/ui/AlbumImagesGrid";
import { AlbumWithImages } from "../../../shared/api/album/types";
import { sanitizeImgSrc, sanitizeAHref } from "../../../shared/lib/sanitizer/sanitizeUrl";

interface AlbumPageProps extends AlbumWithImages {
  isFetching?: boolean;
}

export function AlbumPage({
  id,
  fullImages,
  albumName,
  snapImages,
  tags,
  isFetching,
  description
}: Readonly<AlbumPageProps>): JSX.Element {
  return (
    <div className={classes.galleryPage}>
      <div className={classes.scrollWrapper}>
        <AlbumHeader
          albumName={albumName}
          tags={tags}
          imageCover={fullImages?.[0]}
          isFetching={isFetching}
          albumId={id}
        />
        <div className={classes.galleryPage__description}>
          <ReactMarkdown
            skipHtml
            components={{
              img: (props) => (
                <NextImage
                  src={sanitizeImgSrc(props.src) || ""}
                  quality="50"
                  loading="lazy"
                  fill
                  sizes="(min-width: 2300px) 42vw, (min-width: 1380px)
                  calc(6.44vw + 811px), (min-width: 720px) calc(63.44vw + 37px), 90vw"
                  alt="incorrect image url"
                  className={classes.galleryPage__img}
                />
              ),
              a: (props) => (
                <a {...props} href={sanitizeAHref(props.href)?.url || ""}>
                  {props.children}
                </a>
              )
            }}
          >
            {description}
          </ReactMarkdown>
        </div>
        <AlbumImagesGrid
          snapImages={snapImages}
          isFetching={isFetching}
          fullImages={fullImages}
          albumName={albumName}
        />
      </div>
    </div>
  );
}
