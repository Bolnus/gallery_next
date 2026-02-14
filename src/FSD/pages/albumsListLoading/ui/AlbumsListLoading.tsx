import { TextInput } from "../../../shared/ui/input/TextInput/TextInput";
import { CategoryHeader } from "../../../shared/ui/text/CategoryHeader/CategoryHeader";
import { ALBUM_ITEM_LOADER_ARRAY } from "../../albumsSearch/consts/consts";
import { mapLoaders } from "../../albumsSearch/lib/mappers";
import classes from "./AlbumsListLoading.module.scss";

interface Props {
  hasSearch?: boolean;
  category?: string;
}

export function AlbumsListLoading({ hasSearch, category }: Readonly<Props>): JSX.Element {
  return (
    <div className="main__scrollWrapper">
      <div className="main__page">
        {hasSearch && (
          <div className={`${classes.searchBlock} ${classes.scrollBox_itemWrapper}`}>
            <div className={`${classes.inputWrapper}`}>
              <TextInput disabled value="" />
            </div>
            <div className={`${classes.inputWrapper}`}>
              <TextInput disabled value="" />
            </div>
          </div>
        )}
        {!!category && <CategoryHeader category={category} />}
        {ALBUM_ITEM_LOADER_ARRAY.map(mapLoaders)}
      </div>
    </div>
  );
}
