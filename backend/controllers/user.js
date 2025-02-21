const asyncHandler = require("../middleware/async");
const User = require("../models/user");
const path = require("path");
const fs = require("fs");
const user = require("../models/user");

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await Users.find({});
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Get single users
// @route   GET /api/v1/users/:id
// @access  Private

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res
      .status(404)
      .json({ message: "User not found with id of ${req.params.id}" });
  } else {
    res.status(200).json({
      success: true,
      data: user,
    });
  }
});

// @desc    Create new user
// @route   POST /api/v1/users
// @access  Public

exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(req.body);
  if (user) {
    return res.status(400).send({ message: "User already exists" });
  }

  // const board = await Board.findOne({ _id: req.body.batch });
  // if (!board) {
  //   return res.status(400).send({ message: "Invalid Batch" });
  // }
  await User.create(req.body);

  res.status(200).json({
    success: true,
    message: "User created successfully",
  });
});

// @desc   Login user
// @route  POST /api/v1/users/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide a username and password" });
  }

  // Check if user exists
  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  sendTokenResponse(user, 200, res);
});

exports.logout = (req, res) => {
  req.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

//=========================== Searching ===========================

// @desc    Search user by batch
// @route   GET /api/v1/users/search/:batchId
// @access  Private

exports.searchByBatch = asyncHandler(async (req, res, next) => {
  // const users = await Student.find({ batch: req.params.batchId });
  // if (!users) {
  //   return res.status(404).send({ message: "No users found" });
  // }
  // res.status(200).json({
  //   success: true,
  //   count: users.length,
  //   data: users,
  // });

  const batchId = req.params.batchId;
  // dont show password

  Student.find({ batch: batchId })
    .populate("batch", "-__v")
    .populate("course", "-__v")
    .select("-password -__v")
    .then((user) => {
      res.status(201).json({
        success: true,
        message: "List of users by batch",
        data: user,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err,
      });
    });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private

exports.updateUser = asyncHandler(async (req, res, next) => {
  const updates = req.body; // ✅ Get updates from request body
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    updates, // Use the updates object
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  });
});

// Get current user
// @route   GET /api/v1/users/me
// @access  Private

exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private

exports.deleteUser = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (user != null) {
        var imagePath = path.join(
          __dirname,
          "..",
          "public",
          "uploads",
          user.image
        );

        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log(err);
          }
          res.status(200).json({
            success: true,
            message: "User deleted successfully",
          });
        });
      } else {
        res.status(400).json({
          success: false,
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    });
});

// @desc Upload Single Image
// @route POST /api/v1/auth/upload
// @access Private

exports.uploadImage = asyncHandler(async (req, res, next) => {
  // // check for the file size and send an error message
  // if (req.file.size > process.env.MAX_FILE_UPLOAD) {
  //   return res.status(400).send({
  //     message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
  //   });
  // }

  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
});

// Get token from model , create cookie and send response
const sendTokenResponse = (User, statusCode, res) => {
  const token = User.getSignedJwtToken();

  const options = {
    //Cookie will expire in 30 days
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Cookie security is false .if you want https then use this code. do not use in development time
  if (process.env.NODE_ENV === "proc") {
    options.secure = true;
  }
  //we have created a cookie with a token

  res
    .status(statusCode)
    .cookie("token", token, options) // key , value ,options
    .json({
      success: true,
      token,
    });
};
