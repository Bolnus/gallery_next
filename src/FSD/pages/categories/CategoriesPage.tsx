import { Link } from "../../../app/navigation";
import { getUnitedClassnames } from "../../shared/lib/common/commonUtils";
import { AlbumsCategory, FileLoadState } from "../../shared/lib/common/galleryTypes";
import { CategoryFolder } from "../../shared/ui/Category/CategoryFolder";
import classes from "./CategoriesPage.module.scss";

const DummyCategories = Array.from({ length: 30 }).map(
  (el, i): AlbumsCategory => ({
    tagName: "--",
    albumsCount: 99,
    id: String(i),
    coverSnap: { id: String(i), loadState: FileLoadState.downloading }
  })
);

interface PropsLoading {
  categories?: null;
  isFetching: true;
}

interface Props {
  categories: AlbumsCategory[];
  isFetching?: false;
}

export function CategoriesPage({ categories, isFetching }: Readonly<Props | PropsLoading>): JSX.Element {
  return (
    <div className="main__scrollWrapper">
      <div className={getUnitedClassnames(["main__page", classes.categoriesPage])}>
        {isFetching
          ? DummyCategories.map((category) => <CategoryFolder category={category} isLoading key={category.id} />)
          : categories.map((category) => (
              <Link href={`/categories/${category.tagName}`} className={classes.navLink} key={category.id}>
                <CategoryFolder category={category} />
              </Link>
            ))}
      </div>
    </div>
  );
}
