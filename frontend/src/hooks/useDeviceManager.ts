import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import type { Device, Layouts } from "../type";

export function useDeviceManager(
  socket: Socket | undefined,
  layouts: Layouts[],
  getProfiles: () => void,
) {
  const [pendingDeviceData, setPendingDeviceData] = useState<{
    message: string;
    newDevice: Device;
    profileName: string;
  } | null>(null);
  const [selectedType, setSelectedType] = useState<string>("keyboard");
  const [selectedLayout, setSelectedLayout] = useState<string>("");
  const [isSearchingDevices, setIsSearchingDevices] = useState<boolean>(false);

  useEffect(() => {
    if (!socket) return;

    const handleDeviceAdded = (data: {
      message: string;
      newDevice: Device;
      profileName: string;
    }) => {
      console.log(data.message);
      setIsSearchingDevices(false);
      setPendingDeviceData(data);
    };

    const handleDeviceRemoved = (data: { message: string }) => {
      console.log(data.message);
    };

    socket.on("device_added", handleDeviceAdded);
    socket.on("device_removed", handleDeviceRemoved);

    return () => {
      socket.off("device_added", handleDeviceAdded);
      socket.off("device_removed", handleDeviceRemoved);
    };
  }, [socket]);

  useEffect(() => {
    if (pendingDeviceData && selectedType === "keyboard") {
      socket?.emit("get_layouts");
    }
  }, [pendingDeviceData, selectedType, socket]);

  useEffect(() => {
    if (layouts.length > 0 && !selectedLayout) {
      setSelectedLayout(layouts[0].name);
    }
  }, [layouts, selectedLayout]);

  const handleConfirmAddDevice = async () => {
    if (!pendingDeviceData || !pendingDeviceData.profileName) {
      console.warn(
        "Nessun profilo trovato nel payload, chiamata API annullata.",
      );
      setPendingDeviceData(null);
      return;
    }

    console.log("Proviamo adesso a chiamare la API per aggiornare il device");
    try {
      const deviceWithType = {
        ...pendingDeviceData.newDevice,
        type: selectedType,
        layout:
          selectedType === "keyboard"
            ? layouts.find((l) => l.name === selectedLayout)
            : undefined,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/flow/profiles/${pendingDeviceData.profileName}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newDevice: deviceWithType }),
        },
      );

      if (response.ok) {
        console.log("Device added");
        getProfiles();
      } else {
        console.log("Error adding device");
      }
    } catch (error) {
      console.error("Error adding device:", error);
    }
    setPendingDeviceData(null);
    setSelectedType("keyboard"); // reset
    setSelectedLayout(""); // reset
  };

  const handleCancelAddDevice = () => {
    setPendingDeviceData(null);
    setSelectedType("keyboard");
    setSelectedLayout("");
  };

  const addDevice = (profileName: string) => {
    console.log("Mandata richiesta di add device per il profilo", profileName);
    setIsSearchingDevices(true);
    socket?.emit("add_device", profileName);
  };

  const handleCancelListening = () => {
    setIsSearchingDevices(false);
    socket?.emit("stop_listening");
  };

  return {
    isSearchingDevices,
    pendingDeviceData,
    selectedType,
    setSelectedType,
    selectedLayout,
    setSelectedLayout,
    addDevice,
    handleConfirmAddDevice,
    handleCancelAddDevice,
    handleCancelListening,
  };
}
