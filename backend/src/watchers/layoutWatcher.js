import fs from "fs";
import { setLayout } from "../services/layoutSetter.js";

export class LayoutWatcher {
  constructor(usbWatcher) {
    this.usbWatcher = usbWatcher;
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

    const keyboards =
      active_profile.devices?.filter((device) => device.type == "keyboard") ||
      [];
    if (keyboards.length > 0) {
      const targetKeyboard = keyboards[0];
      console.log(
        "Tastiera trovata nel profilo attivo. Impostiamo il layout ad: ",
        targetKeyboard.layout,
      );
      const devices = this.usbWatcher.connectedDevices();
      if (
        devices.length > 0 &&
        devices.find(
          (device) =>
            device.idVendor === targetKeyboard.idVendor &&
            device.idProduct === targetKeyboard.idProduct,
        )
      ) {
        const layoutId = targetKeyboard.layout?.id || targetKeyboard.layout;
        if (layoutId && typeof layoutId === "string") {
          setLayout(layoutId);
        }
      } else {
        console.log("Tastiera non collegata o non trovata nel profilo attivo");
      }
    } else {
      console.log("Nessuna tastiera trovata nel profilo attivo");
    }

    this.isListening = false;
  }
}
