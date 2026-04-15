import type { BilingualText } from "./config";

let _isKo: boolean | null = null;

export function isKorean(): boolean {
  if (_isKo !== null) return _isKo;

  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);
  const langParam = params.get("lang");

  if (langParam) {
    _isKo = langParam === "ko";
  } else {
    _isKo =
      navigator.language.startsWith("ko") ||
      Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Seoul";
  }

  return _isKo;
}

export function t(text: BilingualText): string {
  return isKorean() ? text.ko : text.en;
}

export function tArray(arr: { en: string[]; ko: string[] }): string[] {
  return isKorean() ? arr.ko : arr.en;
}
