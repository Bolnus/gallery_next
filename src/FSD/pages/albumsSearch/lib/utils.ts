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

export function getSortingIconOptions(): SelectOption<IconName>[] {
  return [
    {
      label: "By date",
      value: IconName.Date
    },
    {
      label: "Random",
      value: IconName.Random
    }
  ];
}

export function mapSortingTypeToIconOption(sorting: AlbumsListSorting): SelectOption<IconName> {
  return sorting === AlbumsListSorting.sample
    ? {
        label: "Random",
        value: IconName.Random
      }
    : {
        label: "By date",
        value: IconName.Date
      };
}

export function mapIconOptionToSortingType(option: SelectOption<IconName>): AlbumsListSorting {
  return option.value === IconName.Date ? AlbumsListSorting.changedDate : AlbumsListSorting.sample;
}
