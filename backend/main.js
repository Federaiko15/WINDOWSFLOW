import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// Diciamo a Node di usare la cartella sicura di Windows (AppData) per salvare i file
process.env.USER_DATA_PATH = app.getPath("userData");

// Avvia il tuo server backend (Express + Socket.io) in background
import "./src/app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true, // Nasconde la barra dei menu stile Windows
  });

  // Carica l'URL servito dal nostro server Express locale sulla porta corretta
  const PORT = process.env.PORT || 4000;
  win.loadURL(`http://localhost:${PORT}`);

  // I DevTools sono disattivati per la versione in produzione
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
