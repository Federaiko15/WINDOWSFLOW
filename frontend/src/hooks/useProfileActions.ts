import { useState, useEffect } from "react";
import { useSocket } from "../SocketContext";
import type { Device, DinamicTheme } from "../type";

export function useProfileActions(
  profileName: string,
  initialActiveState: boolean,
) {
  const {
    addDevice: emitAddDevice,
    removeDevice: emitRemoveDevice,
    getProfiles,
  } = useSocket();
  const [isActive, setIsActive] = useState(initialActiveState);
  const { socket } = useSocket();

  // Sincronizziamo lo stato locale se i dati in entrata dovessero aggiornarsi
  // in seguito a un ricaricamento (getProfiles() nel padre App.tsx)
  useEffect(() => {
    setIsActive(initialActiveState);
  }, [initialActiveState]);

  const toggleActive = async () => {
    const newActiveState = !isActive;
    setIsActive(newActiveState); // Aggiornamento ottimistico dell'UI

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/flow/profiles/${profileName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            active: newActiveState,
          }),
        },
      );
      if (!response.ok) {
        console.log("Error updating profile status");
        setIsActive(!newActiveState); // Revert dello stato se fallisce la chiamata
      } else {
        console.log("Profile status updated");
        if (newActiveState === true) {
          socket?.emit("change_active_profile");
        }

        getProfiles();
      }
    } catch (error) {
      console.error("Error updating profile status:", error);
      setIsActive(!newActiveState); // Revert dello stato se fallisce la chiamata
    }
  };

  const addDevice = () => {
    emitAddDevice(profileName);
  };

  const deleteDevice = async (device: Device) => {
    emitRemoveDevice(profileName);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/flow/profiles/${profileName}`,
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
        getProfiles();
      }
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  const deleteProfile = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/flow/profiles/${profileName}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        console.log("Error deleting profile");
      } else {
        console.log("Profile deleted");
        getProfiles();
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  const changeProfileTheme = async (profileTheme: string | DinamicTheme) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/flow/profiles/${profileName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            theme: profileTheme,
          }),
        },
      );

      if (!response.ok) {
        console.log("Error changing profile theme");
        return;
      } else {
        console.log("Profile theme changed");
        getProfiles();
      }
    } catch (error) {
      console.error("Server Error changing profile theme:", error);
    }
  };

  return {
    isActive,
    toggleActive,
    addDevice,
    deleteDevice,
    deleteProfile,
    changeProfileTheme,
  };
}
