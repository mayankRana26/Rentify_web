import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  /* ===============================
     Close dropdown on outside click
  =============================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===============================
     Safe Avatar Resolver
  =============================== */
  const avatarUrl =
  user?.profile?.avatar
    ? `${user.profile.avatar}?v=${Date.now()}`
    : DEFAULT_AVATAR;


  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar */}
      <img
        src={avatarUrl}
        onClick={() => setOpen((prev) => !prev)}
        onError={(e) => {
          e.target.src = DEFAULT_AVATAR;
        }}
        className="w-9 h-9 rounded-full cursor-pointer border object-cover"
        alt="profile"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50">
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            My Profile
          </Link>

          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
