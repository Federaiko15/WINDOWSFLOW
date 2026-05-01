import { useEffect } from "react";
import type { Device } from "../type";
import { useSocket } from "../SocketContext";

interface DeviceDetailsModalProps {
  device: Device;
  onClose: () => void;
}

export default function DeviceDetailsModal({
  device,
  onClose,
}: DeviceDetailsModalProps) {
  const { socket, layouts } = useSocket();

  useEffect(() => {
    if (device.type === "keyboard") {
      socket?.emit("get_layouts");
    }
  }, []);

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
              <strong>Selezione il layout: </strong>
              <select>
                {layouts.map((layout, index) => (
                  <option key={index}>{layout.name}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
