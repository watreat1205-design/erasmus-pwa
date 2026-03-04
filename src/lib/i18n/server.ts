import { cookies } from "next/headers";

import en from "@/locales/en/common.json";
import el from "@/locales/el/common.json";
import it from "@/locales/it/common.json";
import es from "@/locales/es/common.json";
import ro from "@/locales/ro/common.json";
import hr from "@/locales/hr/common.json";

const resources = {
  en,
  el,
  it,
  es,
  ro,
  hr,
} as const;

type Lang = keyof typeof resources;

async function getLangFromCookies(): Promise<Lang> {
  const cAny: any = await cookies();

  const getVal = (name: string) => {
    if (cAny && typeof cAny.get === "function") return cAny.get(name)?.value;
    return undefined;
  };

  const raw =
    getVal("i18nextLng") ||
    getVal("i18next") ||
    getVal("lng") ||
    getVal("NEXT_LOCALE") ||
    "en";

  const short = String(raw).split("-")[0] as Lang;
  return short in resources ? short : "en";
}

function getByPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, k) => (acc && acc[k] != null ? acc[k] : undefined), obj);
}

function interpolate(str: string, vars?: Record<string, any>) {
  if (!vars) return str;
  return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => String(vars[k] ?? ""));
}

export async function getServerTranslation() {
  const lang = await getLangFromCookies();

  const t = (key: string, opts?: { defaultValue?: string } & Record<string, any>) => {
    const vars = opts ? { ...opts } : undefined;
    if (vars) delete (vars as any).defaultValue;

    const val =
      getByPath(resources[lang], key) ??
      getByPath(resources.en, key) ??
      opts?.defaultValue ??
      key;

    return typeof val === "string" ? interpolate(val, vars) : String(val);
  };

  return { lang, t };
}
