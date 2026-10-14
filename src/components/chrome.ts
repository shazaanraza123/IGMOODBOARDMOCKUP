import { createContext, useContext } from "react";

export type ChromeValue = {
  portal: HTMLElement | null;
  setSheetOpen: (open: boolean) => void;
};

export const ChromeContext = createContext<ChromeValue | null>(null);

export function useChrome(): ChromeValue {
  const value = useContext(ChromeContext);
  if (!value) throw new Error("Chrome is missing");
  return value;
}
