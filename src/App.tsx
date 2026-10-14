import { useMemo, useState } from "react";
import { ChromeContext } from "./components/chrome";
import { DeviceFrame } from "./components/DeviceFrame";
import { TabBar } from "./components/TabBar";
import { ToastProvider, ToastViewport } from "./components/Toast";
import { ScreenTransition } from "./components/ScreenTransition";
import { useToast } from "./components/toastState";
import styles from "./App.module.css";

const UNAVAILABLE = "Not part of this concept";

export function App() {
  return (
    <ToastProvider>
      <AppShell />
    </ToastProvider>
  );
}

function AppShell() {
  const { show } = useToast();
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const chrome = useMemo(() => ({ portal, setSheetOpen }), [portal]);

  return (
    <ChromeContext.Provider value={chrome}>
      <DeviceFrame>
        <div className={styles.shell}>
          <div className={styles.status} aria-hidden="true" />
          <main className={styles.main}>
            <ScreenTransition />
          </main>
          {sheetOpen ? null : (
            <TabBar onUnavailable={() => show({ title: UNAVAILABLE })} />
          )}
          <ToastViewport />
          <div ref={setPortal} />
        </div>
      </DeviceFrame>
    </ChromeContext.Provider>
  );
}
