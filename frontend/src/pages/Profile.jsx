import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import UploadAvatar from "../components/UploadAvatar";


const API_URL = import.meta.env.VITE_API_URL ;

const Profile = () => {
  const { user, token, updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    avatar: "",
    phone: "",
    address: {
      line1: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  /* =========================
     FETCH PROFILE
  ========================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setForm({
          name: data.name || "",
          email: data.email || "",
          avatar: data.profile?.avatar || "",
          phone: data.profile?.phone || "",
          address: {
            line1: data.profile?.address?.line1 || "",
            city: data.profile?.address?.city || "",
            state: data.profile?.address?.state || "",
            pincode: data.profile?.address?.pincode || "",
          },
        });
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* =========================
     SAVE PROFILE
  ========================= */
  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await axios.put(
        `${API_URL}/api/users/me`,
        {
          name: form.name,
          phone: form.phone,
          avatar: form.avatar,
          address: form.address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
        
      );console.log("UPDATED USER:", res.data.user);
console.log("UPDATED AVATAR:", res.data.user?.profile?.avatar);


      // 🔥 LIVE UPDATE NAVBAR
      updateUser(res.data.user);

      toast.success("Profile updated ✅");
      setEditing(false);
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading profile…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">My Profile</h2>

        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shadow-2xl">
        {/* LEFT CARD */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <img
              src={
                form.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border mb-4"
            />

            {editing && (
              <UploadAvatar
                setAvatar={(url) =>
                  setForm((prev) => ({ ...prev, avatar: url }))
                }
                setUploading={setUploading}
              />
            )}

            <h3 className="mt-4 text-xl font-bold">{form.name}</h3>
            <p className="text-gray-500">{form.email}</p>

            <span
              className={`mt-3 px-3 py-1 rounded-full text-sm font-semibold ${
                user.role === "seller"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {user.role === "seller" ? "Seller Account" : "Buyer Account"}
            </span>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Full Name"
              className={`border p-3 rounded ${
                !editing && "bg-gray-100"
              }`}
            />

            <input
              value={form.email}
              disabled
              className="border p-3 rounded bg-gray-100"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Phone"
              className={`border p-3 rounded ${
                !editing && "bg-gray-100"
              }`}
            />
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Address</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="address.line1"
              value={form.address.line1}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Address Line"
              className={`border p-3 rounded ${
                !editing && "bg-gray-100"
              }`}
            />

            <input
              name="address.city"
              value={form.address.city}
              onChange={handleChange}
              disabled={!editing}
              placeholder="City"
              className={`border p-3 rounded ${
                !editing && "bg-gray-100"
              }`}
            />

            <input
              name="address.state"
              value={form.address.state}
              onChange={handleChange}
              disabled={!editing}
              placeholder="State"
              className={`border p-3 rounded ${
                !editing && "bg-gray-100"
              }`}
            />

            <input
              name="address.pincode"
              value={form.address.pincode}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Pincode"
              className={`border p-3 rounded ${
                !editing && "bg-gray-100"
              }`}
            />
          </div>

          {editing && (
            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="mt-6 bg-black text-white px-6 py-3 rounded hover:bg-gray-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
