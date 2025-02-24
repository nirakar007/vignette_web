//PROTECT THE MIDDLEWARE
const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const User = require("../models/user");

//Protect routes
exports.protect = async (req, res, next) => {
  let token = req.cookies.token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user and attach to request
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Token is invalid" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Grant access to specific roles , i.e publisher and admin

exports.authorize = (...roles) => {
  return (req, res, next) => {
    ///check if it is admin or publisher. user cannot access
    //  console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      // return next(new ErrorResponse(`User role ${req.user.roles} is not authorized to access this route`, 403));
      return res.status(403).json({
        message: `User role ${req.user.roles} is not authorized to access this route`,
      });
    }
    next();
  };
};
