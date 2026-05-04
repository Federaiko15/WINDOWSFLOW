import { usb } from "usb";

function getDeviceName(device) {
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

export default getDeviceName;
