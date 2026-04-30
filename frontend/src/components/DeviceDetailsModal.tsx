import type { Device } from "../type";

interface DeviceDetailsModalProps {
  device: Device;
  onClose: () => void;
}

export default function DeviceDetailsModal({
  device,
  onClose,
}: DeviceDetailsModalProps) {
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
        </div>
      </div>
    </div>
  );
}
