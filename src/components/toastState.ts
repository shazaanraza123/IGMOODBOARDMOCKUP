import { createContext, useContext } from "react";

export type ToastImage = {
  src: string;
  alt: string;
  tint: string;
};

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastMessage = {
  title: string;
  body?: string;
  image?: ToastImage;
  action?: ToastAction;
};

type ToastContextValue = {
  toast: (ToastMessage & { id: number }) | null;
  show: (message: ToastMessage) => void;
  dismiss: () => void;
  pause: () => void;
  resume: () => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) throw new Error("Toast is missing");
  return value;
}
