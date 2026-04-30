import { useState } from "react";
import type { Profile, Device } from "../type.ts";
import "../style/Profile.css";
import DeviceDetailsModal from "./DeviceDetailsModal";
import { useProfileActions } from "../hooks/useProfileActions.ts";

export default function Profile({ profile }: { profile: Profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Usiamo il nostro Custom Hook
  const { isActive, toggleActive, deleteDevice, deleteProfile, addDevice } =
    useProfileActions(profile.profile_name, profile.active);

  const handleToggleActive = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Evita di aprire/chiudere i dettagli del profilo al click
    await toggleActive();
  };

  return (
    <li className="profile_card">
      <div className="profile_header" onClick={() => setIsOpen(!isOpen)}>
        <h2 className="profile_name">{profile.profile_name}</h2>
        <span className="toggle_icon">{isOpen ? "▲" : "▼"}</span>
        <button
          className={`toggle_switch ${isActive ? "on" : "off"}`}
          onClick={handleToggleActive}
        >
          <span className="toggle_slider"></span>
        </button>
      </div>

      {isOpen && (
        <div className="profile_details">
          <p className="current_theme">
            Theme:{" "}
            {typeof profile.theme === "string"
              ? profile.theme
              : `Dinamico (Chiaro: ${(profile.theme as any)?.startLight}, Scuro: ${(profile.theme as any)?.startDark})`}
          </p>
          <p className="active_status">Attivo: {isActive ? "Sì" : "No"}</p>
          <div className="profile_actions">
            <button className="btn_delete_profile" onClick={deleteProfile}>
              Elimina
            </button>
            <button className="btn_add_device" onClick={addDevice}>
              + Periferica
            </button>
          </div>

          <ul className="device_list">
            {profile.devices?.map((device: Device, index: number) => (
              <li
                key={index}
                className="device_item"
                onClick={() => setSelectedDevice(device)}
              >
                <span className="device_info">
                  {device.name} <small>({device.type})</small>
                </span>
                <button
                  className="btn_delete_device"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDevice(device);
                  }}
                >
                  Rimuovi
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedDevice && (
        <DeviceDetailsModal
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />
      )}
    </li>
  );
}
