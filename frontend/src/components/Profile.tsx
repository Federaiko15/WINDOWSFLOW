import { useState } from "react";
import type { Profile, Device } from "../type.ts";
import { useSocket } from "../SocketContext.tsx";
import "../style/Profile.css";

export default function Profile({ profile }: { profile: Profile }) {
  // thanks to the Context feature i can access the socket created in SocketContext.tsx
  const { addDevice, removeDevice } = useSocket();
  const [isOpen, setIsOpen] = useState(false);

  const handleAddDevice = () => {
    addDevice(profile.profile_name);
  };

  const handleDeleteDevice = async (device: Device) => {
    removeDevice(profile.profile_name);
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/flow/profiles/${profile.profile_name}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            removedDevice: device,
          }),
        },
      );
      if (!response.ok) {
        console.log("Error deleting device");
      } else {
        console.log("Device deleted");
      }
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/flow/profiles/${profile.profile_name}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        console.log("Error deleting profile");
      } else {
        console.log("Profile deleted");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <li className="profile_card">
      <div className="profile_header" onClick={() => setIsOpen(!isOpen)}>
        <h2 className="profile_name">{profile.profile_name}</h2>
        <span className="toggle_icon">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className="profile_details">
          <p className="current_theme">
            Theme:{" "}
            {typeof profile.theme === "string"
              ? profile.theme
              : `Dinamico (Chiaro: ${(profile.theme as any)?.startLight}, Scuro: ${(profile.theme as any)?.startDark})`}
          </p>
          <p className="active_status">
            Attivo: {profile.active ? "Sì" : "No"}
          </p>
          <div className="profile_actions">
            <button
              className="btn_delete_profile"
              onClick={handleDeleteProfile}
            >
              Elimina
            </button>
            <button className="btn_add_device" onClick={handleAddDevice}>
              + Periferica
            </button>
          </div>

          <ul className="device_list">
            {profile.devices?.map((device: Device, index: number) => (
              <li key={index} className="device_item">
                <span className="device_info">
                  {device.name} <small>({device.type})</small>
                </span>
                <button
                  className="btn_delete_device"
                  onClick={() => handleDeleteDevice(device)}
                >
                  Rimuovi
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
