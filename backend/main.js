import { app, BrowserWindow, shell } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// Diciamo a Node di usare la cartella sicura di Windows (AppData) per salvare i file
process.env.USER_DATA_PATH = app.getPath("userData");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true, // Nasconde la barra dei menu stile Windows
  });

  if (!app.isPackaged) {
    // In sviluppo carica direttamente il server Vite del frontend per avere le modifiche live
    win.loadURL("http://localhost:5173");
  } else {
    // In produzione (app compilata) carica l'URL del backend
    const PORT = process.env.PORT || 4000;
    win.loadURL(`http://localhost:${PORT}`);
  }

  // I DevTools sono disattivati per la versione in produzione
  // win.webContents.openDevTools();

  // Forza l'apertura dei link (es. GitHub) nel browser predefinito di Windows
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Intercetta anche la navigazione diretta ai link esterni (es. GitHub) e la forza nel browser
  win.webContents.on("will-navigate", (event, url) => {
    if (!url.includes("localhost")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

app.whenReady().then(async () => {
  // Avvia il server backend in modo "dinamico", DOPO aver settato il percorso
  await import("./src/app.js");
  createWindow();

  // Imposta l'avvio automatico all'accensione di Windows
  app.setLoginItemSettings({
    openAtLogin: true,
    path: app.getPath("exe"),
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
