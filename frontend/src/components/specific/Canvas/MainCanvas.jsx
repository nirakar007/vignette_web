import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import CanvasElement from "./CanvasElement"; // Create this component
import Toolbar from "./Toolbar";

const MainCanvas = () => {
  const { boardId } = useParams();
  const { user } = useContext(AuthContext);
  const [board, setBoard] = useState({ elements: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);

  // Fetch board data
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`/api/v1/boards/${boardId}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setBoard({
          ...response.data.data,
          elements: response.data.data?.elements || [],
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load board");
      } finally {
        setLoading(false);
      }
    };

    if (boardId && user) fetchBoard();
  }, [boardId, user?.token]);

  // Handle element updates
  const updateElement = useCallback(
    async (updatedEl) => {
      try {
        await axios.put(
          `/api/v1/boards/${boardId}/elements/${updatedEl._id}`,
          updatedEl,
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        setBoard((prev) => ({
          ...prev,
          elements: prev.elements.map((el) =>
            el._id === updatedEl._id ? updatedEl : el
          ),
        }));
      } catch (err) {
        console.error("Update error:", err);
      }
    },
    [boardId, user?.token]
  );

  // Handle new elements
  const handleAddElement = useCallback(
    async (newEl) => {
      try {
        const res = await axios.post(
          `/api/v1/boards/${boardId}/elements`,
          newEl,
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        setBoard((prev) => ({
          ...prev,
          elements: [...prev.elements, res.data],
        }));
      } catch (err) {
        console.error("Create error:", err);
      }
    },
    [boardId, user?.token]
  );

  // Handle element deletion
  const deleteElement = useCallback(
    async (elementId) => {
      try {
        await axios.delete(`/api/v1/boards/${boardId}/elements/${elementId}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setBoard((prev) => ({
          ...prev,
          elements: prev.elements.filter((el) => el._id !== elementId),
        }));
      } catch (err) {
        console.error("Delete error:", err);
      }
    },
    [boardId, user?.token]
  );

  // Handle text content changes
  const handleContentChange = (elementId, newContent) => {
    setBoard((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el._id === elementId ? { ...el, content: newContent } : el
      ),
    }));
    // Debounce the API update
    setTimeout(() => {
      const element = board.elements.find((el) => el._id === elementId);
      if (element) updateElement({ ...element, content: newContent });
    }, 1000);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Delete" && selectedElement) {
        deleteElement(selectedElement);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedElement, deleteElement]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="relative w-full h-screen bg-gray-50">
      {/* Main Canvas Area */}
      <div className="absolute inset-0">
        {board.elements.map((element) => (
          <CanvasElement
            key={element._id}
            element={element}
            isSelected={selectedElement === element._id}
            drawingMode={drawingMode}
            onSelect={setSelectedElement}
            onUpdate={updateElement}
            onDelete={deleteElement}
            onContentChange={handleContentChange}
          />
        ))}
      </div>

      <Toolbar
        boardId={boardId}
        drawingMode={drawingMode}
        setDrawingMode={setDrawingMode}
        onAddElement={handleAddElement}
      />
    </div>
  );
};

export default MainCanvas;
