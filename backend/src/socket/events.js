const handleEvents = (socket, usbWatcher) => {
  socket.on("add_device", (profileName) => {
    usbWatcher.startListening(profileName);
  });
};

export default handleEvents;
