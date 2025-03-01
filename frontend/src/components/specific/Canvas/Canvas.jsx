import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import Toolbar from "./Toolbar";

const Canvas = () => {
  const { boardId } = useParams();
  const { user } = useContext(AuthContext);
  const [elements, setElements] = useState([]);
  const boardRef = useRef(null);
  const [content, setContent] = useState("");

  // Load board data on mount
  useEffect(() => {
    const loadBoard = async () => {
      try {
        const res = await axios.get(`/api/v1/boards/${boardId}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (res.data.success && res.data.data) {
          const board = res.data.data;
          setElements(board.elements || []);
          const textElement = board.elements.find((el) => el.type === "text");
          if (textElement && boardRef.current) {
            boardRef.current.innerHTML = textElement.content;
            setContent(textElement.content);
          }
        }
      } catch (error) {
        console.error("Error loading board:", error);
      }
    };
    loadBoard();
  }, [boardId, user?.token]);

  // Fetch images when board loads
  useEffect(() => {
    const loadImages = async () => {
      if (!boardId || !user?.token) return;

      try {
        const res = await axios.get(`/api/v1/boards/${boardId}/images`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!res.data || !res.data.images || !res.data.success) {
          throw new Error("Invalid image data received");
        }

        // Merge existing elements with new images
        setElements((prevElements) => [...prevElements, ...res.data.images]);
      } catch (error) {
        console.error("Error fetching images:", error);
        toast.error("Failed to load images");
      }
    };

    loadImages();
  }, [boardId, user?.token]);

  useEffect(() => {
    const saveContent = async () => {
      try {
        const updatedContent = boardRef.current.innerHTML;
        const textElement = elements.find((el) => el.type === "text");

        if (textElement) {
          // Update existing text element
          await axios.put(
            `/api/v1/boards/${boardId}/elements/${textElement._id}`,
            { content: updatedContent },
            { headers: { Authorization: `Bearer ${user?.token}` } }
          );
        } else {
          // Create new text element
          const newElement = {
            type: "text",
            content: updatedContent,
            position: { x: 0, y: 0 },
            size: { width: 800, height: 600 },
          };
          const res = await axios.post(
            `/api/v1/boards/${boardId}/elements`,
            newElement,
            { headers: { Authorization: `Bearer ${user?.token}` } }
          );
          setElements([...elements, res.data.data]); // Update local state
        }
      } catch (error) {
        console.error("Error saving content:", error);
      }
    };

    if (content) {
      const timer = setTimeout(saveContent, 1000); // Save every second
      return () => clearTimeout(timer);
    }
  }, [content, boardId, user?.token, elements]);

  // Handle image upload and update elements with the correct image URL
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `/api/v1/boards/${boardId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Image Upload Response:", res.data); // Debugging

      if (!res.data.data.src) {
        throw new Error("Image upload failed. No URL received.");
      }

      setElements((prev) => [...prev, res.data.data]); // Add the new image
    } catch (error) {
      console.error("Image upload error:", error);
    }
  };

  // Delete image
  const handleDeleteImage = async (imageId) => {
    if (!boardId || !user?.token) return;

    try {
      await axios.delete(`/api/v1/boards/${boardId}/deleteImage/${imageId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      toast.success("Image deleted successfully");

      // Remove the image from elements state
      setElements((prevElements) =>
        prevElements.filter((el) => el._id !== imageId)
      );
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="h-screen w-screen relative bg-gray-50">
      {/* Toolbar receives the boardId and handleImageUpload */}
      <Toolbar boardId={boardId} onImageUpload={handleImageUpload} />

      {/* Main editable area */}
      <div
        ref={boardRef}
        className="h-full w-full p-8 focus:outline-none"
        contentEditable
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
        placeholder="Start typing your notes..."
        aria-label="Canvas board"
      ></div>

      {/* Render image elements over the main editable area */}
      {elements.length > 0 ? (
        elements.map((element) =>
          element.type === "image" && element.src ? (
            <div key={element._id} className="relative inline-block">
              <img
                src={element.src}
                alt="Uploaded content"
                className="absolute max-w-xs shadow-lg cursor-move"
                style={{
                  left: element.position?.x || 0,
                  top: element.position?.y || 0,
                  width: element.size?.width || "auto",
                  height: element.size?.height || "auto",
                }}
              />
              <button
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                onClick={() => handleDeleteImage(element._id)}
                aria-label="Delete image"
              >
                X
              </button>
            </div>
          ) : null
        )
      ) : (
        <p className="text-center text-gray-400 mt-4">No elements to display</p>
      )}
    </div>
  );
};

export default Canvas;
