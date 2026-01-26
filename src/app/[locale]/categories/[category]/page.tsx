import { AlbumsListParam } from "../../../../FSD/shared/lib/common/galleryTypes";
import { redirect } from "../../../navigation";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string; category: string }>;
}

// export async function generateStaticParams(): Promise<AlbumsListParam[]> {
//   const paths: AlbumsListParam[] = [];
//   for (const locale of routing.locales) {
//     const tags = await getCategoriesServerSide(locale);
//     if (!tags.data) {
//       return paths;
//     }
//     for (const tag of tags.data) {
//       for (let i = 1; i <= Math.ceil(tag.albumsCount / 30); i++) {
//         paths.push({ pageNumber: String(i), locale });
//       }
//     }
//   }
//   return paths;
// }

export default async function Category({ params }: Props): Promise<void> {
  const { locale, category } = await params;
  redirect({ href: category ? `/categories/${category}/1` : "/", locale });
}
