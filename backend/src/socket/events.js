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
  socket.on("disconnect", () => {
    usbWatcher.stopListening();
  });
};

export default handleEvents;
