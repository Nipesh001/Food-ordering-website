import jwt from "jsonwebtoken";

function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Access denied. No token provided.");
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_USER_PASSWORD);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
    console.log("Invalid token" + error);
  }
}
export default userMiddleware;
