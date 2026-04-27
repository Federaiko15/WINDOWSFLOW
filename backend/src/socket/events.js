const handleEvents = (socket, usbWatcher) => {
  socket.on("add_device", (device) => {
    usbWatcher.startListening();
  });
};

export default handleEvents;
