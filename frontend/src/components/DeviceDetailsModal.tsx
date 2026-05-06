import { useEffect, useState } from "react";
import type { Device } from "../type";
import { useSocket } from "../SocketContext";
import "../style/DeviceDetailsModal.css";

interface DeviceDetailsModalProps {
  device: Device;
  onClose: () => void;
  profileName: string;
}

export default function DeviceDetailsModal({
  device,
  onClose,
  profileName,
}: DeviceDetailsModalProps) {
  const { socket, layouts, getProfiles } = useSocket();
  const [changeLayout, setChangeLayout] = useState<boolean>(true);
  const [selectedLayout, setSelectedLayout] = useState<string>(
    (device.layout as any)?.name ||
      (typeof device.layout === "string" ? device.layout : ""),
  );
  const [currentLayoutDisplay, setCurrentLayoutDisplay] = useState<string>(
    (device.layout as any)?.name ||
      (typeof device.layout === "string" ? device.layout : ""),
  );

  useEffect(() => {
    if (device.type === "keyboard") {
      socket?.emit("get_layouts");
    }
  }, []);

  const handleChangeLayout = async (
    idVendor: number,
    idProduct: number,
    selectedLayout: string,
  ) => {
    setChangeLayout(true);

    try {
      if (!profileName || !selectedLayout || !idVendor || !idProduct) {
        console.log("Tutti i campi sono importanti per la modifica del layout");
        return;
      }

      // Recuperiamo l'oggetto completo dall'array "layouts"
      const fullLayout = layouts.find((l) => l.name === selectedLayout);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/flow/profiles/${profileName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newLayoutInfo: {
              idVendor,
              idProduct,
              layout: fullLayout, // Passiamo l'intero oggetto invece della sola stringa
            },
          }),
        },
      );

      if (!response.ok) {
        console.log("Error changing layout response");
      } else {
        console.log("Layout changed");
        setCurrentLayoutDisplay(fullLayout?.name || selectedLayout);
        socket?.emit("change_layout");
        getProfiles(); // Aggiorniamo i dati globali affinché il layout si persista
      }
    } catch (error) {
      console.error("Error changing layout:", error);
    }
  };

  return (
    <div className="device_details_overlay" onClick={onClose}>
      <div
        className="device_details_modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="device_details_header">
          <h3>{device.name}</h3>
          <button className="btn_close_modal" onClick={onClose}>
            X
          </button>
        </div>
        <div className="device_details_content">
          <p>
            <strong>Tipo:</strong> {device.type}
          </p>
          <p>
            <strong>Vendor ID:</strong> {device.idVendor}
          </p>
          <p>
            <strong>Product ID:</strong> {device.idProduct}
          </p>
          {device.type === "keyboard" && (
            <label>
              <p>Layout corrente: {currentLayoutDisplay}</p>
              <strong>Selezione il layout: </strong>
              <select
                value={selectedLayout}
                onChange={(e) => {
                  const selectedValue = e.target.value;

                  setSelectedLayout(selectedValue);
                  setChangeLayout(false);
                }}
              >
                {layouts.map((layout, index) => (
                  <option key={index} value={layout.name}>
                    {layout.name}
                  </option>
                ))}
              </select>
              <button
                className="change-layout-button"
                disabled={changeLayout}
                onClick={() => {
                  handleChangeLayout(
                    device.idVendor,
                    device.idProduct,
                    selectedLayout,
                  );
                }}
              >
                Cambia Layout
              </button>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
