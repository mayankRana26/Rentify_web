import jwt from "jsonwebtoken";

const adminProtect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Admin not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  } catch {
    res.status(401).json({ message: "Invalid admin token" });
  }
};

export default adminProtect;
