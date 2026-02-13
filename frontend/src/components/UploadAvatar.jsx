import { useRef } from "react";
import { toast } from "react-hot-toast";

const UploadAvatar = ({ setAvatar, setUploading }) => {
  const fileInputRef = useRef(null);

  const uploadImage = async (file) => {
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "rentify_avatar");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dwmphemjp/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        toast.error("Upload failed");
        return;
      }

      setAvatar(data.secure_url);
      toast.success("Photo uploaded ✅");
    } catch (err) {
      console.error(err);
      toast.error("Network error while uploading");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-2">
      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => uploadImage(e.target.files[0])}
      />

      {/* Visible Button */}
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Choose Profile Photo
      </button>
    </div>
  );
};

export default UploadAvatar;
