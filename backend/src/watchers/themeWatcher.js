import themeSetter from "../services/themeSetter.js";
import fs from "fs";

export class ThemeWatcher {
  constructor(io, currentTheme) {
    this.io = io;
    this.currentTheme = currentTheme;
  }

  startListening() {
    if (this.isListening) {
      return;
    }
    this.isListening = true;
    console.log(
      "ThemeWatcher in ascolto per la verifica del tema da adottare\n",
    );

    let profiles = [];
    if (fs.existsSync("profile-json.json")) {
      const fileData = fs.readFileSync("profile-json.json", "utf8");
      if (fileData) profiles = JSON.parse(fileData);
    }
    let isAProfileActive = false;
    for (let i = 0; i < profiles.length; i++) {
      if (profiles[i].active == true) {
        isAProfileActive = true;
        this.currentTheme = profiles[i].theme;
        break;
      }
    }
    if (!isAProfileActive) {
      return;
    }
    themeSetter(this.currentTheme);
  }
}
