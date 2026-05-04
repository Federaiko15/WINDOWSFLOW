import fs from "fs";
import { setLayout } from "../services/layoutSetter.js";

export class LayoutWatcher {
  constructor() {
    this.isListening = false;
  }
  startListening() {
    if (this.isListening) {
      return;
    }
    this.isListening = true;
    console.log("Layout Watcher attivato per il cambio di layout");
    let profiles = [];
    if (fs.existsSync("profile-json.json")) {
      const fileData = fs.readFileSync("profile-json.json", "utf8");
      if (fileData) profiles = JSON.parse(fileData);
    }
    const active_profile = profiles.find((profile) => profile.active == true);
    if (!active_profile) {
      console.log("Nessun profilo attivo trovato");
      this.isListening = false;
      return;
    }

    const keyboars =
      active_profile.devices?.filter((device) => device.type == "keyboard") ||
      [];
    if (keyboars.length > 0) {
      const targetKeyboard = keyboars[0];
      console.log(
        "Tastiera trovat nel profilo attivo. Impostiamo il layout ad: ",
        targetKeyboard.layout,
      );
      setLayout(targetKeyboard.layout.id);
    } else {
      console.log("Nessuna tastiera trovata nel profilo attivo");
    }

    this.isListening = false;
  }
}
