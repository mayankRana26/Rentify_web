import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import sellerRoutes from "./routes/seller.routes.js"; // 👈 NEW
import webhookRoutes from "./routes/webhookRoutes.js";
import adminRoutes from "./routes/admin.routes.js"


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// 🔥 SOCKET SETUP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("⚡ socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("👤 joined room:", userId);
  });

  socket.on("disconnect", () => {
    console.log("❌ socket disconnected:", socket.id);
  });
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/seller", sellerRoutes); // 👈 NEW
app.use("/api/webhooks", webhookRoutes);
app.use("/api/admin", adminRoutes);


export { io };

const PORT = process.env.PORT || 8000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
