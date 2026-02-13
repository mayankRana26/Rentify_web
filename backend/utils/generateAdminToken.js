import jwt from "jsonwebtoken";

const generateAdminToken = () => {
  return jwt.sign(
    { role: "admin" },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export default generateAdminToken;
