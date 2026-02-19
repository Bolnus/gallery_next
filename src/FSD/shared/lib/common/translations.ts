import { useTranslations } from "next-intl";

export function getBriefDate(timeT: string, intl: ReturnType<typeof useTranslations>): string {
  const currentDate = new Date();
  const pendingDate = new Date(timeT);
  let briefDate = "";
  if (currentDate.toLocaleDateString() === pendingDate.toLocaleDateString()) {
    briefDate = intl("today");
  } else {
    briefDate = `${pendingDate.getDate()} ${intl(String(pendingDate.getMonth()))}`;
  }
  if (currentDate.getFullYear() !== pendingDate.getFullYear()) {
    briefDate = `${briefDate} ${pendingDate.getFullYear()}`;
  }

  return briefDate;
}
