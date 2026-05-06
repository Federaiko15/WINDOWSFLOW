import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { Device, ApiGetProfiles, Profile, Layouts } from "./type";
import "./style/SocketContext.css";

interface SocketContextType {
  socket: Socket | undefined;
  addDevice: (profileName: string) => void;
  removeDevice: (profileName: string) => void;
  getProfiles: () => void;
  profiles: Profile[];
  layouts: Layouts[];
}

const SocketContext = createContext<SocketContextType>({
  socket: undefined,
  addDevice: () => {},
  removeDevice: () => {},
  getProfiles: async () => {},
  profiles: [],
  layouts: [],
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket>();
  const [pendingDeviceData, setPendingDeviceData] = useState<{
    message: string;
    newDevice: Device;
    profileName: string;
  } | null>(null);
  const [selectedType, setSelectedType] = useState<string>("keyboard");
  const [selectedLayout, setSelectedLayout] = useState<string>("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [layouts, setLayouts] = useState<Layouts[]>([]);
  const [isSearchingDevices, setIsSearchingDevices] = useState<boolean>(false);

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    // Gestione degli eventi in entrata
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on(
      "device_added",
      (data: { message: string; newDevice: Device; profileName: string }) => {
        console.log(data.message);
        setIsSearchingDevices(false);
        setPendingDeviceData(data);
      },
    );

    newSocket.on("device_removed", (data: { message: string }) => {
      console.log(data.message);
    });

    newSocket.on("layouts", (data: Layouts[]) => {
      console.log("Received layouts:", data);
      setLayouts(data);
    });

    // Cleanup alla disconnessione del componente
    return () => {
      newSocket.close();
    };
  }, []);

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
    if (!pendingDeviceData) return;

    if (!pendingDeviceData.profileName) {
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
        `http://localhost:4000/api/v1/flow/profiles/${pendingDeviceData.profileName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newDevice: deviceWithType,
          }),
        },
      );

      if (!response.ok) {
        console.log("Error adding device");
      } else {
        console.log("Device added");
        getProfiles();
      }
    } catch (error) {
      console.error("Error adding device:", error);
    }
    setPendingDeviceData(null);
    setSelectedType("keyboard"); // reset
    setSelectedLayout(""); // reset
  };

  const getProfiles = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/flow/profiles",
        {
          method: "GET",
        },
      );
      if (!response.ok) {
        console.log("Error getting profiles response");
      }
      const result: ApiGetProfiles = await response.json();
      setProfiles(result.data);
    } catch (error) {
      console.error("Error getting profiles:", error);
    }
  };

  const handleCancelAddDevice = () => {
    setPendingDeviceData(null);
    setSelectedType("keyboard"); // reset
    setSelectedLayout(""); // reset
  };

  const addDevice = (profileName: string) => {
    console.log("Mandata richiesta di add device per il profilo", profileName);
    setIsSearchingDevices(true);
    socket?.emit("add_device", profileName);
  };

  const removeDevice = (profileName: string) => {
    console.log(
      "Mandata richiesta di delete device per il profilo",
      profileName,
    );
    socket?.emit("remove_device", profileName);
  };

  const handleCancelListening = () => {
    setIsSearchingDevices(false);
    socket?.emit("stop_listening");
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        addDevice,
        removeDevice,
        getProfiles,
        profiles,
        layouts,
      }}
    >
      {children}

      {isSearchingDevices && (
        <div className="socket_overlay">
          <div className="socket_modal">
            <div className="listening_spinner"></div>
            <h3>In ascolto...</h3>
            <p>Collega una nuova periferica USB al computer.</p>
            <button
              className="btn_cancel_listening"
              onClick={handleCancelListening}
            >
              Annulla
            </button>
          </div>
        </div>
      )}

      {pendingDeviceData && (
        <div className="socket_overlay">
          <div className="socket_modal">
            <h3>Nuova periferica rilevata</h3>
            <p>{pendingDeviceData.message}</p>
            <ul
              style={{
                textAlign: "left",
                marginBottom: "15px",
                listStyle: "none",
                padding: 0,
              }}
            >
              <li>
                <strong>Nome:</strong> {pendingDeviceData.newDevice.name}
              </li>
              <li>
                <strong>Vendor ID:</strong>{" "}
                {pendingDeviceData.newDevice.idVendor}
              </li>
              <li>
                <strong>Product ID:</strong>{" "}
                {pendingDeviceData.newDevice.idProduct}
              </li>
            </ul>

            <div style={{ marginBottom: "20px" }}>
              <label>
                Tipologia di periferica:{" "}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  style={{ padding: "5px", marginLeft: "10px" }}
                >
                  <option value="keyboard">Tastiera</option>
                  <option value="mouse">Mouse</option>
                  <option value="headset">Cuffie</option>
                  <option value="controller">Controller</option>
                  <option value="other">Altro</option>
                </select>
              </label>
            </div>

            {selectedType === "keyboard" && layouts.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <label>
                  Layout della tastiera:{" "}
                  <select
                    value={selectedLayout}
                    onChange={(e) => setSelectedLayout(e.target.value)}
                    style={{ padding: "5px", marginLeft: "10px" }}
                  >
                    {layouts.map((layout, index) => (
                      <option key={index} value={layout.name}>
                        {layout.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleCancelAddDevice}
                style={{ padding: "8px 16px", cursor: "pointer" }}
              >
                Annulla
              </button>
              <button
                onClick={handleConfirmAddDevice}
                style={{ padding: "8px 16px", cursor: "pointer" }}
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}
    </SocketContext.Provider>
  );
};
