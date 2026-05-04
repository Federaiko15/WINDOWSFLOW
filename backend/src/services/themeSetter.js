import { exec } from "child_process";

// Teniamo traccia del timeout per poterlo cancellare se l'utente seleziona un altro profilo
let themeTimeout = null;

const themeSetter = async (theme) => {
  // Se c'è un timer attivo per il cambio tema, lo fermiamo
  if (themeTimeout) {
    clearTimeout(themeTimeout);
    themeTimeout = null;
  }

  if (typeof theme === "string") {
    await applyTheme(theme);
  } else if (theme && theme.startDark && theme.startLight) {
    // Gestione del cambio dinamico
    await scheduleTheme(theme.startDark, theme.startLight);
  }
};

const applyTheme = async (themeName) => {
  const normalizedTheme = themeName.toLowerCase();
  const currentTheme = await getCurrentTheme();
  console.log("Tema corrente:", currentTheme);
  if (currentTheme !== normalizedTheme) {
    console.log("I temi sono diversi, quindi cambiamo il tema corrente");
    await setTheme(normalizedTheme);
  }
};

const scheduleTheme = async (startDark, startLight) => {
  const now = new Date();
  const darkTime = parseTime(startDark);
  const lightTime = parseTime(startLight);

  let currentTargetTheme = "dark";
  let nextChangeTime = null;

  // Capiamo quale tema applicare in questo preciso istante e quando sarà il prossimo cambio
  if (lightTime < darkTime) {
    if (now >= lightTime && now < darkTime) {
      currentTargetTheme = "light";
      nextChangeTime = darkTime;
    } else {
      currentTargetTheme = "dark";
      nextChangeTime = now < lightTime ? lightTime : addDays(lightTime, 1);
    }
  } else {
    if (now >= darkTime && now < lightTime) {
      currentTargetTheme = "dark";
      nextChangeTime = lightTime;
    } else {
      currentTargetTheme = "light";
      nextChangeTime = now < darkTime ? darkTime : addDays(darkTime, 1);
    }
  }

  // Applica subito il tema corretto per il momento attuale
  await applyTheme(currentTargetTheme);

  // Calcola quanti millisecondi mancano al prossimo target
  const msUntilNextChange = nextChangeTime.getTime() - now.getTime();
  console.log(
    `Tema impostato su ${currentTargetTheme}. Prossimo cambio tra ${Math.round(msUntilNextChange / 1000 / 60)} minuti.`,
  );

  // Imposta il timer che scatterà ESATTAMENTE quando deve cambiare
  themeTimeout = setTimeout(() => {
    scheduleTheme(startDark, startLight);
  }, msUntilNextChange);
};

const parseTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(":");
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return date;
};

const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

const getCurrentTheme = () => {
  return new Promise((resolve, reject) => {
    exec(
      `powershell -Command "(Get-ItemProperty -Path 'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize').SystemUsesLightTheme"`,
      (error, stdout, stderr) => {
        console.log("stdout raw:", JSON.stringify(stdout));
        console.log("stderr:", stderr);

        if (error) {
          reject(error);
          return;
        }

        const value = parseInt(stdout.trim());
        console.log("value:", value);
        resolve(value === 1 ? "light" : "dark");
      },
    );
  });
};

const setTheme = (theme) => {
  const value = theme === "light" ? 1 : 0;

  return new Promise((resolve, reject) => {
    exec(
      `powershell -Command "Set-ItemProperty -Path 'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize' -Name 'AppsUseLightTheme' -Value ${value}"`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        // Secondo comando separato
        exec(
          `powershell -Command "Set-ItemProperty -Path 'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize' -Name 'SystemUsesLightTheme' -Value ${value}"`,
          (error2) => {
            if (error2) reject(error2);
            else resolve();
          },
        );
      },
    );
  });
};

export default themeSetter;
