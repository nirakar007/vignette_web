const asyncHandler = require("../middleware/async");
const Board = require("../models/board");
const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");
const PDFDocument = require("pdfkit");

// @desc    Get all boards
// @route   GET /api/v1/boards
// @access  Private
// controllers/board.js
exports.getBoards = asyncHandler(async (req, res) => {
  try {
    // ✅ Get the user ID from req.user (set by protect middleware)
    const userId = req.user._id;

    // ✅ Modified Board.find() query to filter by user
    const boards = await Board.find({ user: userId }).populate("user"); // Filter by user ID

    res.status(200).json({ success: true, data: boards });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// @desc    Get single board (SIMPLIFIED for DIAGNOSTIC TESTING)
// @route   GET /api/v1/boards/:boardId
// @access  Private
exports.getBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.boardId)
      .populate("user")
      .lean();

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    // Ensure elements array exists
    board.elements = board.elements || [];
    // Ensure elements have `src`
    const elements = board.elements.map((element) => {
      if (element.type === "image" && !element.src) {
        element.src = `http://localhost:5000/uploads/${element._id}.jpg`; // Adjust if necessary
      }
      return element;
    });

    res.status(200).json({
      success: true,
      data: { ...board.toObject(), elements },
    });
  } catch (err) {
    console.error("Error fetching board:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.getBoardsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("Fetching boards for user:", userId);

    const boards = await Board.find({ user: userId }); // Find boards but don't need to return all data in this case if only count is needed
    const boardCount = boards.length; // Calculate the count

    res.status(200).json({
      success: true,
      count: boardCount, // Just return the count
      // data: boards.map(...) -  No longer needed if we just want the count
    });
  } catch (error) {
    console.error("Error fetching board count:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch board count" });
  }
};

// @desc    Create new board
// @route   POST /api/v1/boards
// @access  Private
exports.createBoard = asyncHandler(async (req, res) => {
  try {
    const { boardName } = req.body;

    if (!boardName) {
      return res.status(400).json({
        success: false,
        message: "Board name is required",
      });
    }

    // Get user ID from authenticated user
    const userId = req.user.id;

    const board = await Board.create({
      boardName,
      user: userId, // Use the authenticated user's ID
      elements: [],
    });

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { boards: board._id }, // Add the new board's _id to the user's boards array
      },
      { new: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      data: board,
    });
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// @desc    Get single board
// @route   GET /api/v1/boards/users/:userId
// @access  Private
exports.toggleFavorite = asyncHandler(async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    // Toggle favorite status
    board.isFavorite = !board.isFavorite;
    await board.save();

    res.status(200).json({
      success: true,
      data: board,
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// @desc    Update board (including adding/updating elements)
// @route   PUT /api/v1/boards/:id
// @access  Private
// In controllers/board.js
exports.updateBoard = asyncHandler(async (req, res) => {
  // Validate input
  if (!req.body.content) {
    return res.status(400).json({
      success: false,
      message: "Content is required",
    });
  }

  try {
    const board = await Board.findByIdAndUpdate(
      req.params.boardId,
      { content: req.body.content },
      { new: true, runValidators: true }
    );

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    res.status(200).json({
      success: true,
      data: board,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during save",
    });
  }
});

// @desc    Delete board
// @route   DELETE /api/v1/boards/:id
// @access  Private
exports.deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    res.status(200).json({ success: true, data: board });
  } catch (err) {
    next(err);
  }
};

// @desc    Search boards by name
// @route   GET /api/v1/boards/search?name=query
// @access  Private
exports.searchBoards = asyncHandler(async (req, res) => {
  try {
    const boards = await Board.find({
      boardName: { $regex: req.query.name, $options: "i" },
    }).populate("user");

    res.status(200).json({
      success: true,
      data: boards,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// controllers/board.js
exports.uploadImageToBoard = asyncHandler(async (req, res) => {
  try {
    console.log("Uploading image for board:", req.params.boardId);
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      console.log("Board not found");
      return res
        .status(404)
        .json({ success: false, message: "Board not found" });
    }

    if (!req.file) {
      console.log("No file uploaded");
      return res
        .status(400)
        .json({ success: false, message: "No image file uploaded" });
    }

    console.log("File uploaded:", req.file);
    const imageUrl = `uploads/${req.file.filename}`;
    console.log("Image URL:", imageUrl);

    const newImage = {
      type: "image",
      content: imageUrl, // Use 'content' as per your schema (not 'src')
      position: { x: 0, y: 0 },
      size: { width: req.body.width || 300, height: req.body.height || 200 },
    };
    console.log("New image element:", newImage);

    board.elements.push(newImage);
    await board.save();
    console.log("Board saved successfully");

    res.status(201).json({
      success: true,
      imageUrl,
      data: newImage,
      message: "Image uploaded to board successfully",
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      success: false,
      message: "Server error during image upload",
      error: error.message,
    });
  }
});

// Fetch all images for a board
exports.getBoardImages = asyncHandler(async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    const images = board.elements.filter((el) => el.type === "image");

    res.status(200).json({
      success: true,
      images, // Ensure the response contains a valid `images` array
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching images",
      error: error.message,
    });
  }
});

// Delete an image
exports.deleteImage = async (req, res) => {
  try {
    const { boardId, imageId } = req.params;
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Find image element
    const imageIndex = board.elements.findIndex(
      (el) => el._id.toString() === imageId && el.type === "image"
    );
    if (imageIndex === -1)
      return res.status(404).json({ message: "Image not found" });

    const imagePath = board.elements[imageIndex].src;

    // Remove from database
    board.elements.splice(imageIndex, 1);
    await board.save();

    // Optionally, delete file from server
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      path.basename(imagePath)
    );
    fs.unlink(filePath, (err) => {
      if (err) console.warn("Failed to delete file:", err);
    });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Add or update an element on the board
// @route   PUT /api/v1/boards/:id/elements
// @access  Private
exports.updateElement = asyncHandler(async (req, res) => {
  const { boardId, elementId } = req.params;
  const { content } = req.body;

  const board = await Board.findById(boardId);
  if (!board) {
    return res.status(404).json({ success: false, message: "Board not found" });
  }

  const elementIndex = board.elements.findIndex(
    (el) => el._id.toString() === elementId
  );
  if (elementIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Element not found" });
  }

  board.elements[elementIndex].content = content;
  await board.save();

  res.status(200).json({
    success: true,
    data: board.elements[elementIndex],
    message: "Element updated successfully",
  });
});

// @desc    Delete an element from the board
// @route   DELETE /api/v1/boards/:id/elements/:elementId
// @access  Private
exports.deleteElement = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Remove the element
    board.elements = board.elements.filter(
      (el) => el._id.toString() !== req.params.elementId
    );

    await board.save();
    res.status(200).json({ success: true, data: board });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new element on board
// @route   POST /api/v1/boards/:boardId/elements
// @access  Private
exports.createElement = asyncHandler(async (req, res, next) => {
  const boardId = req.params.boardId;
  const { type, content, position, style, size, src, shape, color } = req.body;

  if (!boardId) {
    return next(new ErrorResponse(`Board ID is required`, 400));
  }

  if (!type || !content) {
    return next(
      new ErrorResponse(`Element type and content are required`, 400)
    );
  }

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return next(
        new ErrorResponse(`Board not found with ID: ${boardId}`, 404)
      );
    }

    const newElement = {
      type,
      content,
      position: position || { x: 0, y: 0 },
      style,
      size: size || { width: 100, height: 100 },
      src,
      shape,
      color,
    };

    board.elements.push(newElement);
    await board.save();

    res.status(201).json({
      success: true,
      data: newElement,
      message: "Element added to board successfully",
    });
  } catch (error) {
    console.error("Error adding element to board:", error);
    return next(new ErrorResponse("Server error adding element", 500));
  }
});

// @desc    Upload file (image, audio)
// @route   POST /api/v1/boards/:boardId/upload
// @access  Private
exports.uploadFile = asyncHandler(async (req, res, next) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return next(new ErrorResponse(err.message, 400));
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ url: fileUrl });
  });
});

// @desc    Process PDF and add as element
// @route   POST /api/v1/boards/:boardId/pdf
// @access  Private
exports.processPdf = asyncHandler(async (req, res, next) => {
  upload.single("pdf")(req, res, async (err) => {
    if (err) {
      return next(new ErrorResponse(err.message, 400));
    }

    const pdfPath = req.file.path;
    const converter = new pdf2pic({
      density: 100,
      format: "png",
      quality: 100,
    });

    try {
      const imageBuffer = await converter.convert(pdfPath, 1); // Convert first page
      const imageUrl = `/uploads/pdf-${Date.now()}.png`;
      fs.writeFileSync(
        path.join(__dirname, "../public", imageUrl),
        imageBuffer
      );

      const boardId = req.params.boardId;
      const board = await Board.findById(boardId);
      if (!board) {
        return next(
          new ErrorResponse(`Board not found with ID: ${boardId}`, 404)
        );
      }

      const newElement = {
        type: "image",
        src: imageUrl,
        position: { x: 0, y: 0 },
        size: { width: 500, height: 700 },
      };

      board.elements.push(newElement);
      await board.save();

      res.status(200).json({
        success: true,
        data: newElement,
        message: "PDF processed and added as element",
      });
    } catch (error) {
      console.error("Error processing PDF:", error);
      return next(new ErrorResponse("Server error processing PDF", 500));
    }
  });
});

// @desc    Export board as PDF
// @route   GET /api/v1/boards/:boardId/export
// @access  Private
exports.exportBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.boardId);
  if (!board) {
    return res.status(404).json({ success: false, message: "Board not found" });
  }

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${board.boardName}.pdf"`
  );
  doc.pipe(res);

  board.elements.forEach((element) => {
    if (element.type === "text" && element.content) {
      doc.text(element.content, element.position.x, element.position.y);
    } else if (element.type === "image" && element.content) {
      const imagePath = path.join(__dirname, "../public", element.content);
      if (fs.existsSync(imagePath)) {
        doc.image(imagePath, element.position.x, element.position.y, {
          width: element.size.width,
          height: element.size.height,
        });
      }
    }
  });

  doc.end();
});
