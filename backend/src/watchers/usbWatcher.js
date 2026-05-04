import { usb, getDeviceList } from "usb";
import getDeviceName from "../services/getDeviceName.js";

export class UsbWatcher {
  constructor(io) {
    this.io = io;

    this.isListening = false;
    this.devices = [];
    this.currentProfile = "";
    this.initDevices(); // Chiamiamo un metodo per gestire il recupero asincrono dei nomi
  }

  async initDevices() {
    const list = getDeviceList();
    this.devices = await Promise.all(
      list.map(async (device) => ({
        name: await getDeviceName(device),
        idVendor: device.deviceDescriptor.idVendor,
        idProduct: device.deviceDescriptor.idProduct,
        isAttached: true,
      })),
    );
  }

  startListening(profileName) {
    this.currentProfile = profileName;
    if (this.isListening) {
      return;
    }
    this.isListening = true;
    console.log(
      "UsbWatcher in ascolto di collegamenti o scollegamenti di periferiche usb\n",
    );

    usb.on("attach", async (device) => {
      console.log("Periferica rintracciata\n");

      const name = await getDeviceName(device);
      const { idVendor, idProduct } = device.deviceDescriptor;
      const existingDevice = this.devices.find(
        (device) =>
          device.idVendor === idVendor && device.idProduct === idProduct,
      );
      if (existingDevice) {
        existingDevice.isAttached = true;
        this.io.emit("device_added", {
          message: `Device already attached: ${name}`,
          newDevice: existingDevice,
          profileName: this.currentProfile,
        });
        this.stopListening();
        return;
      }
      console.log("Informazioni nuova periferica: ", name, idVendor, idProduct);

      const newDevice = {
        name,
        idVendor,
        idProduct,
      };
      this.devices.push(newDevice);

      this.io.emit("device_added", {
        message: `New device attached: ${name}`,
        newDevice,
        profileName: this.currentProfile,
      });
      console.log("UsbWatcher ha terminato la sessione di ascolto");
      this.stopListening();
    });
    usb.on("detach", async (device) => {
      const name = await getDeviceName(device);
      const existingDevice = this.devices.find(
        (d) =>
          d.idVendor === device.deviceDescriptor.idVendor &&
          d.idProduct === device.deviceDescriptor.idProduct,
      );
      console.log(
        "Periferica rintracciata per scollegamento: ",
        existingDevice,
      );
      if (existingDevice) {
        this.devices = this.devices.filter((device) => device.name != name);
        this.io.emit("device_removed", {
          message: `Device detached from profile ${this.currentProfile}: ${existingDevice}`,
        });
      }
      console.log("Periferica rimossa: ", name);
      this.stopListening();
    });
  }

  stopListening() {
    if (!this.isListening) {
      return;
    }
    this.isListening = false;
    usb.removeAllListeners("attach");
    usb.removeAllListeners("detach");
  }
}
