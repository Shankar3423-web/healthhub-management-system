// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  let token = req.header('x-auth-token');
  if (!token) {
    token = req.header('Authorization')?.split(' ')[1]; // Bearer token
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret-key');

    if (!decoded.user || !decoded.user.id) {
      return res.status(401).json({ msg: 'Invalid token structure' });
    }

    req.user = decoded.user; // { id, role }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired' });
    }
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
};