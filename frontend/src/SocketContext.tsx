import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { Device } from "./type";

interface SocketContextType {
  socket: Socket | undefined;
  addDevice: (profileName: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: undefined,
  addDevice: () => {},
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    // Gestione degli eventi in entrata
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on(
      "device_added",
      async (data: {
        message: string;
        newDevice: Device;
        profileName: string;
      }) => {
        console.log(data.message);
        console.log(data.newDevice);
        const confirm = window.confirm(data.message);
        if (confirm) {
          // Evitiamo le chiamate API se il profilo è vuoto (es. //)
          if (!data.profileName) {
            console.warn(
              "Nessun profilo trovato nel payload, chiamata API annullata.",
            );
            return;
          }

          console.log(
            "Proviamo adesso a chiamare la API per aggiornare il device",
          );
          try {
            const response = await fetch(
              `http://localhost:4000/api/v1/flow/profiles/${data.profileName}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  newDevice: data.newDevice,
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
        }
      },
    );

    // Cleanup alla disconnessione del componente
    return () => {
      newSocket.close();
    };
  }, []);

  const addDevice = (profileName: string) => {
    console.log("Mandata richiesta di add device per il profilo", profileName);
    socket?.emit("add_device", profileName);
  };

  return (
    <SocketContext.Provider value={{ socket, addDevice }}>
      {children}
    </SocketContext.Provider>
  );
};
