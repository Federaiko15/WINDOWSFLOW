import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";
import type { DinamicTheme } from "./type";

type AppThemeSetting = "light" | "dark" | "active-profile";
type AppTheme = "light" | "dark";

interface ThemeContextType {
  appThemeSetting: AppThemeSetting;
  setAppThemeSetting: (setting: AppThemeSetting) => void;
  actualTheme: AppTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appThemeSetting, setAppThemeSetting] = useState<AppThemeSetting>(
    () => {
      const savedTheme = localStorage.getItem("windowsflow-app-theme");
      return (savedTheme as AppThemeSetting) || "active-profile";
    },
  );
  const [actualTheme, setActualTheme] = useState<AppTheme>("dark");
  const { profiles } = useSocket();

  useEffect(() => {
    const computeTheme = () => {
      if (appThemeSetting === "light") {
        setActualTheme("light");
      } else if (appThemeSetting === "dark") {
        setActualTheme("dark");
      } else {
        // Logica per 'active-profile'
        const activeProfile = profiles.find((p) => p.active);
        if (activeProfile) {
          if (typeof activeProfile.theme === "string") {
            setActualTheme(activeProfile.theme.toLowerCase() as AppTheme);
          } else if (activeProfile.theme) {
            const theme = activeProfile.theme as DinamicTheme;
            if (theme.startLight && theme.startDark) {
              const now = new Date();
              const parseTime = (timeStr: string) => {
                const [hours, minutes] = timeStr.split(":");
                const date = new Date();
                date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
                return date;
              };

              const lightTime = parseTime(theme.startLight);
              const darkTime = parseTime(theme.startDark);

              if (lightTime < darkTime) {
                if (now >= lightTime && now < darkTime) {
                  setActualTheme("light");
                } else {
                  setActualTheme("dark");
                }
              } else {
                if (now >= darkTime && now < lightTime) {
                  setActualTheme("dark");
                } else {
                  setActualTheme("light");
                }
              }
            }
          }
        }
      }
    };

    computeTheme(); // Calcola immediatamente

    // Imposta un intervallo per ricalcolare il tema ogni minuto nel caso in cui
    // il tema applicato sia dinamico e scatti l'ora esatta del cambio
    let intervalId: ReturnType<typeof setInterval>;
    if (appThemeSetting === "active-profile") {
      intervalId = setInterval(computeTheme, 60000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [appThemeSetting, profiles]);

  useEffect(() => {
    // Salviamo l'impostazione nel localStorage per ricordarla ai prossimi riavvii dell'app
    localStorage.setItem("windowsflow-app-theme", appThemeSetting);
  }, [appThemeSetting]);

  useEffect(() => {
    // Applica una classe globale al body per gestire i colori facilmente via CSS
    document.body.className =
      actualTheme === "light" ? "theme-light" : "theme-dark";
  }, [actualTheme]);

  return (
    <ThemeContext.Provider
      value={{ appThemeSetting, setAppThemeSetting, actualTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
