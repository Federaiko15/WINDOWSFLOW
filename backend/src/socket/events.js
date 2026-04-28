const handleEvents = (socket, usbWatcher, themeWatcher) => {
  socket.on("add_device", (profileName) => {
    usbWatcher.startListening(profileName);
  });
  socket.on("remove_device", (profileName) => {
    usbWatcher.startListening(profileName);
  });
  socket.on("disconnect", () => {
    usbWatcher.stopListening();
  });
};

export default handleEvents;
