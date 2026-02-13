// let io;

// const initSocket = (server) => {
//   const { Server } = require("socket.io");

//   io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"]
//     }
//   });

//   io.on("connection", (socket) => {
//     console.log("⚡ socket connected:", socket.id);

//     socket.on("joinRoom", (userId) => {
//       socket.join(userId);
//       console.log(`👤 User ${userId} joined room`);
//     });

//     socket.on("disconnect", () => {
//       console.log("❌ socket disconnected:", socket.id);
//     });
//   });

//   return io;
// };

// const getIO = () => {
//   if (!io) {
//     throw new Error("Socket.io not initialized");
//   }
//   return io;
// };

// module.exports = { initSocket, getIO };
