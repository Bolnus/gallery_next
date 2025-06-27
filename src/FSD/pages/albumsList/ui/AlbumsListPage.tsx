"use client";
import { useRouter } from "next/navigation";
import { Album } from "../../../shared/lib/common/galleryTypes";
import { AlbumsList } from "../../../widgets/AlbumListItem/ui/AlbumsList";

interface Props {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  albums?: Album[];
}

export function AlbumsListPage(props: Props) {
  const router = useRouter();

  return <AlbumsList {...props} onPageSelect={(newPage) => router.push(`/main/${newPage}`)} />;
}
