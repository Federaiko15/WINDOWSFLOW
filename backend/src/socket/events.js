import getInstalledLayout from "../services/layoutSetter.js";

const handleEvents = (socket, usbWatcher, themeWatcher) => {
  socket.on("add_device", (profileName) => {
    usbWatcher.startListening(profileName);
  });
  socket.on("remove_device", (profileName) => {
    usbWatcher.startListening(profileName);
  });
  socket.on("stop_listening", () => {
    usbWatcher.stopListening();
    console.log("Stopped listening for devices");
  });
  socket.on("get_layouts", async () => {
    const layouts = await getInstalledLayout();
    socket.emit("layouts", layouts);
  });
  socket.on("disconnect", () => {
    usbWatcher.stopListening();
  });
};

export default handleEvents;
