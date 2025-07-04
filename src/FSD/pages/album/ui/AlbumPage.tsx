import ReactMarkdown from "react-markdown";
import classes from "./AlbumPage.module.scss";
import { AlbumHeader } from "../../../widgets/AlbumHeader/ui/AlbumHeader";
import { AlbumImagesGrid } from "../../../widgets/AlbumImagesGrid/ui/AlbumImagesGrid";
import { AlbumWithImages } from "../../../shared/api/album/types";

interface AlbumPageProps extends AlbumWithImages {
  isFetching?: boolean;
}

export function AlbumPage({
  id,
  fullImages,
  albumName,
  snapImages,
  albumSize,
  tags,
  isFetching,
  description
}: AlbumPageProps) {
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
          <ReactMarkdown>{description}</ReactMarkdown>
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
