import { useTranslations } from "next-intl";
import { AlbumsListSorting } from "../../../shared/lib/common/galleryTypes";
import { IconName } from "../../../shared/ui/icons/ReactIcon/types";
import { SelectOption } from "../../../shared/ui/input/Select/types";

export function getSortingTypeFromString(str: string | undefined | null): AlbumsListSorting {
  if (str) {
    const entries = Object.entries(AlbumsListSorting);
    const foundSorting = entries.find(([, key]) => key === (str as AlbumsListSorting));
    if (foundSorting) {
      return foundSorting[1];
    }
    return AlbumsListSorting.none;
  }
  return AlbumsListSorting.none;
}

export function getSortingIconOptions(intl: ReturnType<typeof useTranslations>): SelectOption<IconName>[] {
  return [
    {
      label: intl("sortByDate"),
      value: IconName.Calendar
    },
    {
      label: intl("sortRandom"),
      value: IconName.Random
    }
  ];
}

export function mapSortingTypeToIconOption(
  sorting: AlbumsListSorting,
  intl: ReturnType<typeof useTranslations>
): SelectOption<IconName> {
  return sorting === AlbumsListSorting.sample
    ? {
        label: intl("sortRandom"),
        value: IconName.Random
      }
    : {
        label: intl("sortByDate"),
        value: IconName.Calendar
      };
}

export function mapIconOptionToSortingType(option: SelectOption<IconName>): AlbumsListSorting {
  return option.value === IconName.Calendar ? AlbumsListSorting.changedDate : AlbumsListSorting.sample;
}
