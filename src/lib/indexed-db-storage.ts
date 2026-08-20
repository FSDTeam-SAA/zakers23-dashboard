const STORE = "zakers-dashboard";

export const browserStorage = {
  get(key: string) { return typeof window === "undefined" ? null : window.localStorage.getItem(`${STORE}:${key}`); },
  set(key: string, value: string) { if (typeof window !== "undefined") window.localStorage.setItem(`${STORE}:${key}`, value); },
  remove(key: string) { if (typeof window !== "undefined") window.localStorage.removeItem(`${STORE}:${key}`); },
};
