import usb from "usb";

export class UsbWatcher {
  constructor(io) {
    this.io = io;

    this.isListening = false;
    this.devices = [];
    this.initDevices(); // Chiamiamo un metodo per gestire il recupero asincrono dei nomi
  }

  async initDevices() {
    const list = usb.getDeviceList();
    this.devices = await Promise.all(
      list.map(async (device) => ({
        name: await this.getDeviceName(device),
        idVendor: device.deviceDescriptor.idVendor,
        idProduct: device.deviceDescriptor.idProduct,
        isAttached: true,
      })),
    );
  }

  startListening() {
    if (this.isListening) {
      return;
    }
    this.isListening = true;
    usb.on("attach", async (device) => {
      const name = await this.getDeviceName(device);
      const { idVendor, idProduct } = device.deviceDescriptor;
      const existingDevice = this.devices.find(
        (device) =>
          device.idVendor === idVendor && device.idProduct === idProduct,
      );
      if (existingDevice) {
        existingDevice.isAttached = true;
        this.io.emit("attached_device", {
          message: `Device already attached: ${name}`,
        });
        return;
      }

      const newDevice = {
        name,
        idVendor,
        idProduct,
        isAttached: true,
      };
      this.devices.push(newDevice);

      this.io.emit("attached_device", {
        message: `New device attached: ${name}`,
        newDevice,
      });
      usb.removeAllListeners("attach");
    });
    usb.on("detach", async (device) => {
      const name = await this.getDeviceName(device);
      const existingDevice = this.devices.find(
        (d) =>
          d.idVendor === device.deviceDescriptor.idVendor &&
          d.idProduct === device.deviceDescriptor.idProduct,
      );
      if (existingDevice) {
        existingDevice.isAttached = false;
        this.io.emit("detached_device", {
          message: `Device detached: ${name}`,
        });
      }
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

  getDeviceName(device) {
    return new Promise((resolve) => {
      try {
        device.open();

        device.getStringDescriptor(
          device.deviceDescriptor.iManufacturer,
          (errManufacturer, manufacturer) => {
            if (errManufacturer) {
              try {
                device.close();
              } catch (e) {}
              return resolve(
                `Device ${device.deviceDescriptor.idVendor}:${device.deviceDescriptor.idProduct}`,
              );
            }

            device.getStringDescriptor(
              device.deviceDescriptor.iProduct,
              (errProduct, product) => {
                try {
                  device.close();
                } catch (e) {}
                if (errProduct) {
                  return resolve(
                    `Device ${device.deviceDescriptor.idVendor}:${device.deviceDescriptor.idProduct}`,
                  );
                }
                resolve(`${manufacturer} ${product}`);
              },
            );
          },
        );
      } catch (error) {
        try {
          device.close();
        } catch (e) {}
        resolve(
          `Device ${device.deviceDescriptor.idVendor}:${device.deviceDescriptor.idProduct}`,
        );
      }
    });
  }
}
