import { TextInput } from "../../../shared/ui/input/TextInput/TextInput";
import { ALBUM_ITEM_LOADER_ARRAY } from "../consts/consts";
import { mapLoaders } from "../lib/mappers";
import classes from "./AlbumsSearchPage.module.scss";

export function AlbumSearchPageLoading(): JSX.Element {
  return (
    <div className={`${classes.albumsListPage}`}>
      <div className={classes.scrollBox}>
        <div className={`${classes.searchBlock} ${classes.scrollBox_itemWrapper}`}>
          <div className={`${classes.inputWrapper}`}>
            <TextInput disabled value="" />
          </div>
          <div className={`${classes.inputWrapper}`}>
            <TextInput disabled value="" />
          </div>
        </div>
        {ALBUM_ITEM_LOADER_ARRAY.map(mapLoaders)}
      </div>
    </div>
  );
}
