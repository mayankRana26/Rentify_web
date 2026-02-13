import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import { toast } from "react-hot-toast";

// 🔔 audio
import notificationSound from "../../assets/notification.mp3";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const NotificationBell = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const boxRef = useRef(null);
  const audioRef = useRef(null);

  /* ===============================
     Load old notifications
  =============================== */
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotifications(res.data))
      .catch(() => toast.error("Failed to load notifications"));
  }, [token]);

  /* ===============================
     Socket join + listener
  =============================== */
  useEffect(() => {
    if (!user?._id) return;

    // 🔗 join room
    socket.emit("join", user._id);

    // 🔊 sound setup
    audioRef.current = new Audio(notificationSound);

    socket.on("notification", (notification) => {
      toast(notification.message);

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      setNotifications((prev) => [notification, ...prev]);
    });

    return () => socket.off("notification");
  }, [user]);

  const unread = notifications.filter((n) => !n.isRead).length;

  /* ===============================
     Toggle + mark read
  =============================== */
  const toggleOpen = async () => {
    setOpen((prev) => !prev);

    if (!open && unread > 0) {
      await axios.put(
        `${API_URL}/api/notifications/mark-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    }
  };

  /* ===============================
     Outside click close
  =============================== */
  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ===============================
     Click notification
     (🔥 PAYMENT REDIRECT HERE)
  =============================== */
  const handleClick = (notification) => {
    setOpen(false);
    navigate(notification.link);
  };

  return (
    <div className="relative" ref={boxRef}>
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-lg border z-[9999]">
          <div className="p-3 font-semibold border-b">
            Notifications
          </div>

          {notifications.length === 0 && (
            <p className="p-3 text-sm text-gray-500">
              No notifications
            </p>
          )}

          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleClick(n)}
              className={`cursor-pointer p-3 text-sm hover:bg-gray-100 ${
                !n.isRead ? "bg-blue-50" : ""
              }`}
            >
              <p className="font-medium">{n.title}</p>
              <p className="text-xs text-gray-600">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
