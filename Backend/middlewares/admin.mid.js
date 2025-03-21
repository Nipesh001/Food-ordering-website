import jwt from "jsonwebtoken";
import config from "../config.js";

function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Access denied. No token provided.");
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, config.JWT_ADMIN_PASSWORD);
    // console.log(decoded);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
    console.log("Invalid token" + error);
  }
}
export default adminMiddleware;
