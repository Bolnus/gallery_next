import { useTranslations } from "next-intl";
import { SkeletonLoader } from "../../../shared/ui/icons/SkeletonLoader/SkeletonLoader";
import classes from "./PaginationV2.module.scss";
import { ButtonIcon } from "../../../shared/ui/button/ButtonIcon/ButtonIcon";
import { IconName } from "../../../shared/ui/icons/ReactIcon/types";
import { ButtonIconBackground } from "../../../shared/ui/button/ButtonIcon/types";
import { UiSize } from "../../../shared/lib/common/commonTypes";

interface PaginationProps {
  page: number;
  albumsCount: number;
  onPageSelect: (newPage: number) => void;
  loadedAlbumsNumber: number;
  pageSize?: number;
  isFetching?: boolean;
}

export function PaginationV2({
  page,
  albumsCount,
  onPageSelect,
  isFetching,
  loadedAlbumsNumber,
  pageSize = 50
}: Readonly<PaginationProps>): JSX.Element {
  const intl = useTranslations("Pagination");
  const pageRounded = Math.floor(page);
  const prevPagesAmount = (pageRounded - 1) * pageSize;
  return (
    <div className={classes.pagination}>
      <div className={classes.pagination__label}>
        {isFetching ? (
          <SkeletonLoader />
        ) : (
          <span className="singleLine">
            {`${prevPagesAmount + 1} - ${prevPagesAmount + loadedAlbumsNumber} ${intl("outOf")} ${albumsCount}`}
          </span>
        )}
      </div>
      <ButtonIcon
        iconName={IconName.ChevronDoubleLeft}
        background={ButtonIconBackground.Transparent}
        size={UiSize.SmallAdaptive}
        onClick={() => onPageSelect(1)}
      />
      <ButtonIcon
        iconName={IconName.ChevronLeft}
        background={ButtonIconBackground.Transparent}
        size={UiSize.SmallAdaptive}
        onClick={() => onPageSelect(pageRounded <= 2 ? 1 : pageRounded - 1)}
      />
      <ButtonIcon
        iconName={IconName.ChevronRight}
        background={ButtonIconBackground.Transparent}
        size={UiSize.SmallAdaptive}
        onClick={() =>
          onPageSelect(
            pageRounded > Math.floor(albumsCount / pageSize) ? Math.floor(albumsCount / pageSize) + 1 : pageRounded + 1
          )
        }
      />
      <ButtonIcon
        iconName={IconName.ChevronDoubleRight}
        background={ButtonIconBackground.Transparent}
        size={UiSize.SmallAdaptive}
        onClick={() => onPageSelect(Math.floor(albumsCount / pageSize) + 1)}
      />
    </div>
  );
}
