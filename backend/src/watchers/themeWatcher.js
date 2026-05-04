import themeSetter from "../services/themeSetter.js";
import fs from "fs";

export class ThemeWatcher {
  constructor() {
    this.currentTheme = "";
    this.isListening = false;
  }

  startListening() {
    if (this.isListening) {
      return;
    }
    this.isListening = true;
    console.log("Theme Watcher attivato per il cambio di tema");

    let profiles = [];
    if (fs.existsSync("profile-json.json")) {
      const fileData = fs.readFileSync("profile-json.json", "utf8");
      if (fileData) profiles = JSON.parse(fileData);
    }
    let isAProfileActive = false;
    for (let i = 0; i < profiles.length; i++) {
      if (profiles[i].active == true) {
        console.log("Profilo attivo trovato:", profiles[i]);
        isAProfileActive = true;
        this.currentTheme = profiles[i].theme;
        break;
      }
    }
    if (!isAProfileActive) {
      console.log("Nessun profilo attivo trovato");
      return;
    }
    console.log("Tema del Profilo Attivo: ", this.currentTheme);
    themeSetter(this.currentTheme);
    this.isListening = false;
  }
}
