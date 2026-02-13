import generateAdminToken from "../utils/generateAdminToken.js";

export const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const token = generateAdminToken();

  res.json({
    message: "Admin login successful",
    token
  });
};
