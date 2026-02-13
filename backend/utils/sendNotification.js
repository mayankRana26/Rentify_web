import Notification from "../models/Notification.js";
import { io } from "../index.js"; // VERY IMPORTANT

const sendNotification = async ({
  userId,
  title,
  message,
  type,
  link = "/",
  transactionId
}) => {
  // 1️⃣ save in DB
  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type,
    link,
  });

  // 2️⃣ realtime emit
  io.to(userId.toString()).emit("notification", notification);

  return notification;
};

export default sendNotification;
