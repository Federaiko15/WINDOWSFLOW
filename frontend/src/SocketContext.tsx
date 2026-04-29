import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { Device } from "./type";

interface SocketContextType {
  socket: Socket | undefined;
  addDevice: (profileName: string) => void;
  removeDevice: (profileName: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: undefined,
  addDevice: () => {},
  removeDevice: () => {},
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
        console.log(data.newDevice);
        setPendingDeviceData(data);
      },
    );

    newSocket.on("device_removed", (data: { message: string }) => {
      console.log(data.message);
    });

    // Cleanup alla disconnessione del componente
    return () => {
      newSocket.close();
    };
  }, []);

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
      }
    } catch (error) {
      console.error("Error adding device:", error);
    }
    setPendingDeviceData(null);
    setSelectedType("keyboard"); // reset
  };

  const handleCancelAddDevice = () => {
    setPendingDeviceData(null);
    setSelectedType("keyboard"); // reset
  };

  const addDevice = (profileName: string) => {
    console.log("Mandata richiesta di add device per il profilo", profileName);
    socket?.emit("add_device", profileName);
  };

  const removeDevice = (profileName: string) => {
    console.log(
      "Mandata richiesta di delete device per il profilo",
      profileName,
    );
    socket?.emit("remove_device", profileName);
  };

  return (
    <SocketContext.Provider value={{ socket, addDevice, removeDevice }}>
      {children}

      {pendingDeviceData && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
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

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  color: "#333",
  padding: "20px",
  borderRadius: "8px",
  maxWidth: "500px",
  width: "100%",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  textAlign: "center",
};
