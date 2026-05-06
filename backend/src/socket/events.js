import { getInstalledLayout } from "../services/layoutSetter.js";

const handleEvents = (socket, usbWatcher, themeWatcher, layoutWatcher) => {
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
  socket.on("change_active_profile", () => {
    themeWatcher.startListening();
    layoutWatcher.startListening();
  });
  socket.on("get_layouts", async () => {
    const layouts = await getInstalledLayout();
    socket.emit("layouts", layouts);
  });
  socket.on("change_layout", () => {
    layoutWatcher.startListening();
  });
  socket.on("disconnect", () => {
    usbWatcher.stopListening();
  });
};

export default handleEvents;
