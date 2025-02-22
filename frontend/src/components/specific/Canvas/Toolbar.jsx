import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaDownload,
  FaFilePdf,
  FaGripVertical,
  FaImage,
  FaMicrophone,
  FaPen,
  FaStickyNote,
  FaTextHeight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";

const Toolbar = ({ boardId, onAddElement, drawingMode, setDrawingMode }) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [recording, setRecording] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const mediaRecorder = useRef(null);
  const { user } = useContext(AuthContext);

  // **Drag Handling**
  const handleDragStart = (e) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.addEventListener("mousemove", handleDragging);
    document.addEventListener("mouseup", handleDragEnd);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragging = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStartPos.current.x;
    const newY = e.clientY - dragStartPos.current.y;
    setPosition({
      x: Math.max(0, Math.min(newX, window.innerWidth - 200)), // Prevent going off-screen
      y: Math.max(0, Math.min(newY, window.innerHeight - 300)),
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleDragging);
    document.removeEventListener("mouseup", handleDragEnd);
  };

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleDragging);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, []);

  // **Element Creation Handler**
  const createElement = async (type, data) => {
    try {
      const res = await axios.post(
        `/api/v1/boards/${boardId}/elements`,
        { ...data, type },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      onAddElement(res.data);
      toast.success(`${type} added successfully`);
    } catch (err) {
      toast.error(`Failed to add ${type}`);
      console.error(`Error creating ${type}:`, err);
    }
  };

  // **Text Element**
  const handleText = () =>
    createElement("text", {
      content: "New Text",
      position: { x: 100, y: 100 },
      style: { fontSize: 16, color: "#000" },
      size: { width: 200, height: 50 },
    });

  // **Image Upload**
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await axios.post(
        `/api/v1/boards/${boardId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const fileUrl = uploadRes.data.url;
      await createElement("image", {
        src: fileUrl,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 200 },
      });
    } catch (err) {
      toast.error("Failed to upload image");
      console.error("Image upload error:", err);
    }
  };

  // **PDF Upload**
  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await axios.post(`/api/v1/boards/${boardId}/pdf`, formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onAddElement(res.data);
      toast.success("PDF uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload PDF");
      console.error("PDF upload error:", err);
    }
  };

  // **Sticker Elements**
  const createSticker = (shape) =>
    createElement("sticker", {
      shape,
      position: { x: 100, y: 100 },
      size: { width: 100, height: 100 },
      color: "#FFD700",
    });

  // **Voice Memo**
  const toggleRecording = async () => {
    if (recording) {
      mediaRecorder.current?.stop();
      setRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorder.current = new MediaRecorder(stream, {
          mimeType: "audio/ogg; codecs=opus", // Lightweight format
        });
        mediaRecorder.current.start();

        mediaRecorder.current.ondataavailable = async (e) => {
          const audioFile = new File([e.data], "recording.ogg", {
            type: "audio/ogg; codecs=opus",
          });
          const formData = new FormData();
          formData.append("file", audioFile);

          try {
            const uploadRes = await axios.post(
              `/api/v1/boards/${boardId}/upload`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${user?.token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            const fileUrl = uploadRes.data.url;
            await createElement("audio", {
              src: fileUrl,
              position: { x: 100, y: 100 },
            });
          } catch (err) {
            toast.error("Failed to upload audio");
            console.error("Audio upload error:", err);
          }
        };

        mediaRecorder.current.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
        };
        setRecording(true);
      } catch (err) {
        toast.error("Microphone access required");
        console.error("Recording error:", err);
      }
    }
  };

  // **PDF Export**
  const handleExportPDF = async () => {
    try {
      const res = await axios.get(`/api/v1/boards/${boardId}/export`, {
        headers: { Authorization: `Bearer ${user?.token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `board-${boardId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("PDF exported successfully");
    } catch (err) {
      toast.error("Failed to export PDF");
      console.error("Export error:", err);
    }
  };

  return (
    <div
      className={`fixed bg-white/90 backdrop-blur-lg rounded-xl p-4 shadow-xl border border-gray-300/50 transition-all duration-200 hover:shadow-2xl`}
      style={{ left: position.x, top: position.y }}
    >
      <div className="flex items-center mb-3 pb-2 border-b border-gray-200">
        <div className="cursor-grab" onMouseDown={handleDragStart}>
          <FaGripVertical className="text-gray-400 mr-2" />
        </div>
        <h3 className="text-sm font-semibold text-gray-600">Tools</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Content Section */}
        <div className="space-y-3">
          <ToolbarButton
            icon={<FaTextHeight />}
            onClick={handleText}
            tooltip="Add Text"
          />
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
          <ToolbarButton
            icon={<FaFilePdf />}
            onClick={() => document.getElementById("pdf-upload").click()}
            tooltip="Add PDF"
          />
          <input
            type="file"
            id="pdf-upload"
            hidden
            accept="application/pdf"
            onChange={handlePDFUpload}
          />
        </div>

        {/* Media Section */}
        <div className="space-y-3">
          <ToolbarButton
            icon={<FaStickyNote />}
            onClick={() => createSticker("circle")}
            tooltip="Circle Sticker"
          />
          <ToolbarButton
            icon={<FaStickyNote className="rotate-45" />}
            onClick={() => createSticker("square")}
            tooltip="Square Sticker"
          />
          <ToolbarButton
            icon={<FaMicrophone />}
            onClick={toggleRecording}
            tooltip={recording ? "Stop Recording" : "Record Voice Memo"}
            active={recording}
          />
          <ToolbarButton
            icon={<FaPen />}
            onClick={() => setDrawingMode(!drawingMode)}
            tooltip={drawingMode ? "Exit Drawing" : "Start Drawing"}
            active={drawingMode}
          />
        </div>
      </div>

      {/* Export Section */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <ToolbarButton
          icon={<FaDownload />}
          onClick={handleExportPDF}
          tooltip="Export Board as PDF"
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
