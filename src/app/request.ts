import { AbstractIntlMessages } from "next-intl";
import { defineRouting } from "next-intl/routing";
import { getRequestConfig } from "next-intl/server";
import { SelectOption } from "../FSD/shared/ui/input/Select/types";

export async function getMessages(locale: string): Promise<AbstractIntlMessages> {
  switch (locale) {
    case "en":
      return (await import("../messages/en.json")).default;
    case "ru":
      return (await import("../messages/ru.json")).default;
    default:
      return (await import("../messages/en.json")).default;
  }
}

export const routing = defineRouting({
  locales: ["en", "ru"],
  defaultLocale: "en"
});

export default getRequestConfig(async ({ requestLocale }) => {
  // const headersList = await headers();
  // const acceptLanguage = headersList.get("accept-language");
  // const browserLocale = acceptLanguage?.split(",")[0]?.split("-")[0];
  const browserLocale = await requestLocale;
  const locale = browserLocale || "en";

  return {
    locale,
    messages: await getMessages(locale)
  };
});

export type LocaleValue = (typeof routing.locales)[number];

export const LanguageOptions: SelectOption<LocaleValue>[] = [
  { value: "en", label: "english" },
  { value: "ru", label: "русский" }
];
