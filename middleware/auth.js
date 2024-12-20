const jwt = require('jsonwebtoken');

// Middleware for authentication
const authenticate = (req, res, next) => {
  const token =req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded.user.id;
    next();
  } catch (error) {
    res.status(401).json({ message: `Token is not valid ${error}` });
  }
};

module.exports = {
  authenticate
}
