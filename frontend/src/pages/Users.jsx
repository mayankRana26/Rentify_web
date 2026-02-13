import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    adminApi.get("/users").then(res => setUsers(res.data));
  }, []);

  const toggleBlock = (id) => {
    adminApi.put(`/user/block/${id}`).then(() => {
      setUsers(prev =>
        prev.map(u =>
          u._id === id ? { ...u, isBlocked: !u.isBlocked } : u
        )
      );
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users</h1>

      {users.map(user => (
        <div
          key={user._id}
          className="flex justify-between bg-white p-3 mb-2 rounded shadow"
        >
          <span>{user.email}</span>
          <button
            onClick={() => toggleBlock(user._id)}
            className="bg-black text-white px-3 rounded"
          >
            {user.isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Users;
