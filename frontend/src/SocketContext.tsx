import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { ApiGetProfiles, Profile, Layouts } from "./type";
import "./style/SocketContext.css";
import { useDeviceManager } from "./hooks/useDeviceManager";

interface SocketContextType {
  socket: Socket | undefined;
  addDevice: (profileName: string) => void;
  getProfiles: () => void;
  profiles: Profile[];
  layouts: Layouts[];
}

const SocketContext = createContext<SocketContextType>({
  socket: undefined,
  addDevice: () => {},
  getProfiles: async () => {},
  profiles: [],
  layouts: [],
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket>();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [layouts, setLayouts] = useState<Layouts[]>([]);

  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_SERVER_URL}`);
    setSocket(newSocket);

    // Gestione degli eventi in entrata
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("layouts", (data: Layouts[]) => {
      console.log("Received layouts:", data);
      setLayouts(data);
    });

    newSocket.on("device_status_changed", () => {
      console.log(
        "Cambiamento hardware rilevato: aggiorno la lista dei profili",
      );
      getProfiles();
    });

    // Cleanup alla disconnessione del componente
    return () => {
      newSocket.close();
    };
  }, []);

  const getProfiles = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/flow/profiles`,
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

  const {
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
  } = useDeviceManager(socket, layouts, getProfiles);

  return (
    <SocketContext.Provider
      value={{
        socket,
        addDevice,
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
