"use client";
import { useRouter } from "../../../../app/navigation";
import { Album } from "../../../shared/lib/common/galleryTypes";
import { AlbumsList } from "../../../widgets/AlbumListItem/ui/AlbumsList";

interface Props {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  albums?: Album[];
  category?: string;
}

export function AlbumsListPage(props: Readonly<Props>): JSX.Element {
  const { category } = props;
  const router = useRouter();

  return (
    <AlbumsList
      {...props}
      onPageSelect={(newPage) => router.push(category ? `/categories/${category}/${newPage}` : `/main/${newPage}`)}
    />
  );
}
