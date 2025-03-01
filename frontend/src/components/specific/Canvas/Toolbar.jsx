import axios from "axios";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FaDownload,
  FaFileExport,
  FaGripVertical,
  FaImage,
  FaTextHeight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";

const Toolbar = ({ boardId, onAddElement }) => {
  const { user } = useContext(AuthContext);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const toolbarRef = useRef(null);

  // Configure axios instance
  const api = axios.create({
    baseURL: "http://localhost:5000/api/v1/",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // Drag handling for the toolbar
  const handleDragStart = (e) => {
    isDragging.current = true;
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    document.addEventListener("mousemove", handleDragging);
    document.addEventListener("mouseup", handleDragEnd);
    e.preventDefault();
  };

  const handleDragging = useCallback((e) => {
    if (!isDragging.current) return;
    const newX = e.clientX - dragStartPos.current.x;
    const newY = e.clientY - dragStartPos.current.y;

    if (toolbarRef.current) {
      toolbarRef.current.style.left = `${newX}px`;
      toolbarRef.current.style.top = `${newY}px`;
    }

    setPosition({
      x: Math.max(0, Math.min(newX, window.innerWidth - 200)),
      y: Math.max(0, Math.min(newY, window.innerHeight - 300)),
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleDragging);
    document.removeEventListener("mouseup", handleDragEnd);
  }, [handleDragging]);

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleDragging);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [handleDragging, handleDragEnd]);

  // Create new element (e.g., image, text)
  const createElement = async (type, data) => {
    try {
      const elementData = {
        type,
        ...data,
        position: data.position || { x: 100, y: 100 },
        size: data.size || { width: 200, height: 200 },
        createdAt: new Date().toISOString(),
      };

      // POST to create the element
      const res = await api.post(`/boards/${boardId}/elements`, elementData);

      // Check for the element ID on the proper response path
      if (!res.data || !res.data.data || !res.data.data._id) {
        throw new Error("Invalid element response");
      }

      // Add the element to the canvas (or update state)
      onAddElement(res.data.data);
      return res.data.data;
    } catch (err) {
      console.error(`Error creating ${type}:`, err);
      throw err;
    }
  };

  // Image upload handling
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    await axios.post(`/api/v1/boards/${boardId}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    try {
      toast.info("Uploading image...", { autoClose: false });

      const uploadRes = await api.post(`boards/${boardId}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload Response:", uploadRes.data); // Debugging

      if (!uploadRes.data || !uploadRes.data.data?.src) {
        throw new Error("Image upload failed. No URL received.");
      }

      // Create a new image element on the board with the uploaded URL.
      await createElement("image", {
        src: uploadRes.data.data.src, // Ensure correct field
        meta: {
          originalName: file.name,
          size: file.size,
          type: file.type,
        },
      });

      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error(
        `Upload failed: ${err.response?.data?.message || err.message}`
      );
      console.error("Image upload error:", err);
    } finally {
      e.target.value = null;
      toast.dismiss();
    }
  };

  // --- New: Handle board export ---
  const handleExport = async () => {
    try {
      toast.info("Exporting board...", { autoClose: false });
      // GET request to export board. Set responseType to blob for file download.
      const response = await api.get(`boards/${boardId}/export`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      // Create a URL for the blob object
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Set a default file name; adjust as needed
      link.setAttribute("download", `board-${boardId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Board exported successfully");
    } catch (error) {
      toast.error(
        `Export failed: ${error.response?.data?.message || error.message}`
      );
      console.error("Export board error:", error);
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div
      ref={toolbarRef}
      className="fixed bg-white/90 backdrop-blur-lg rounded-xl p-4 shadow-xl border border-gray-300/50 cursor-grab active:cursor-grabbing select-none touch-none"
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleDragStart}
    >
      <div className="flex items-center mb-3 pb-2 border-b border-gray-200">
        <div className="-mt-5 mx-2">
          <img src="/src/assets/logo/logo.svg" alt="Logo" className="h-8 w-9" />
        </div>
        <FaGripVertical className="text-gray-400 mr-2" />
        <h3 className="text-sm font-semibold text-gray-600">Tools</h3>
      </div>
      <div className="flex flex-col items-center">
        <div className="space-y-2">
          {/* Button to add text element */}
          <ToolbarButton
            icon={<FaTextHeight />}
            onClick={() => createElement("text", { content: "New Text" })}
            tooltip="Add Text"
          />

          {/* Button to trigger image upload */}
          <ToolbarButton
            icon={<FaImage />}
            onClick={() => document.getElementById("image-upload").click()}
            tooltip="Add Image"
          />
          <input
            type="file"
            id="image-upload"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />

          {/* Additional buttons can be added similarly */}
        </div>
      </div>

      <div className="flex mt-4 pt-3 border-t space-x-2 border-gray-200">
        {/* Export Board Button */}
        <ToolbarButton
          icon={<FaFileExport />}
          onClick={handleExport}
          tooltip="Export Board as PDF"
          className="w-full justify-center bg-blue-50 hover:bg-blue-100 text-blue-600"
        />
        {/* Save Board Button */}
        <ToolbarButton
          icon={<FaDownload />}
          onClick={() => console.log("Save board")}
          tooltip="Save Board"
          className="w-full justify-center bg-blue-50 hover:bg-blue-100 text-blue-600"
        />
      </div>
    </div>
  );
};

const ToolbarButton = ({
  icon,
  onClick,
  tooltip,
  active = false,
  className = "",
}) => (
  <button
    className={`p-2.5 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center ${
      active ? "bg-blue-100 text-blue-600" : "text-gray-600"
    } ${className} relative group`}
    onClick={onClick}
  >
    {icon}
    <span className="absolute left-full ml-2 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
      {tooltip}
    </span>
  </button>
);

export default Toolbar;
