import { Server } from 'socket.io';

const io = new Server({
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log("connection")
  socket.on("sendDataClient", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
    io.emit("sendDataServer", { data });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
  });
})
