import { AbstractIntlMessages } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

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

export default getRequestConfig(async () => {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");
  const browserLocale = acceptLanguage?.split(",")[0]?.split("-")[0];
  const locale = browserLocale || "en";

  return {
    locale,
    messages: getMessages(locale)
  };
});
