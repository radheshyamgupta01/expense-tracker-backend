const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const transformedToken = authHeader && authHeader.split(" ")[1];
  const token = transformedToken || null; // Ensure token is not undefined

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not provided" });
  }

  jwt.verify(token, "your-secret-key", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }

    req.user = user;

    next();
  });
};

module.exports = authenticateToken;
