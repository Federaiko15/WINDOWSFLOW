import { usb, getDeviceList } from "usb";
import getDeviceName from "../services/getDeviceName.js";
import { EventEmitter } from "events";

export class UsbWatcher extends EventEmitter {
  constructor(io) {
    super();
    this.io = io;

    this.devices = [];
    this.currentProfile = "";
    this.associationMode = false;
    this.startGlobalWatcher();
  }

  async startGlobalWatcher() {
    const list = getDeviceList();
    this.devices = await Promise.all(
      list.map(async (device) => ({
        name: await getDeviceName(device),
        idVendor: device.deviceDescriptor.idVendor,
        idProduct: device.deviceDescriptor.idProduct,
        isAttached: true,
      })),
    );

    console.log(
      "UsbWatcher Globale avviato e in ascolto permanente di periferiche usb\n",
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
        if (this.associationMode) {
          this.io.emit("device_added", {
            message: `Device already attached: ${name}`,
            newDevice: existingDevice,
            profileName: this.currentProfile,
          });
          this.associationMode = false;
        } else {
          // Se viene collegata una periferica nota ma non stiamo associando nulla, notifichiamo un cambio hardware
          this.emit("hardware_change");
          this.io.emit("device_status_changed");
        }
      } else {
        console.log(
          "Informazioni nuova periferica: ",
          name,
          idVendor,
          idProduct,
        );

        const newDevice = {
          name,
          idVendor,
          idProduct,
          isAttached: true,
        };
        this.devices.push(newDevice);
        if (this.associationMode) {
          this.io.emit("device_added", {
            message: `New device attached: ${name}`,
            newDevice,
            profileName: this.currentProfile,
          });
          this.associationMode = false;
        } else {
          // Nuova periferica collegata fuori dalla modalità associazione
          this.emit("hardware_change");
          this.io.emit("device_status_changed");
        }
      }
    });

    usb.on("detach", async (device) => {
      const name = await getDeviceName(device);
      const { idVendor, idProduct } = device.deviceDescriptor;

      console.log("Periferica rimossa: ", name);

      // Rimuoviamo il device dalla memoria usando gli ID (più sicuro del nome)
      this.devices = this.devices.filter(
        (d) => !(d.idVendor === idVendor && d.idProduct === idProduct),
      );

      this.io.emit("device_removed", {
        message: `Device detached: ${name}`,
      });

      // Notifichiamo il cambio hardware per far ricalcolare layout
      this.emit("hardware_change");
      this.io.emit("device_status_changed");
    });
  }

  enableAssociationMode(profileName) {
    this.associationMode = true;
    this.currentProfile = profileName;
    console.log("Modalità associazione attivata per il profilo: ", profileName);
  }

  cancelAssociationMode() {
    this.associationMode = false;
    this.currentProfile = "";
    console.log("Modalità associazione disattivata");
  }

  connectedDevices() {
    return this.devices;
  }
}
