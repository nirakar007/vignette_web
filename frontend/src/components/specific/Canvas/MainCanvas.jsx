import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Toolbar from "./Toolbar";
import { AuthContext } from "../../../context/AuthContext";

const CanvasContent = () => {
  const { state, dispatch } = useCanvas();
  const { boardData, elements, activeTool } = state;

  const handleCanvasClick = (e) => {
    if (activeTool === 'text') {
      const rect = e.currentTarget.getBoundingClientRect();
      const newElement = {
        type: 'text',
        content: 'New Text',
        position: { x: e.clientX - rect.left - 100, y: e.clientY - rect.top - 50 },
        size: { width: 200, height: 100 }
      };
      dispatch({ type: 'ADD_ELEMENT', payload: newElement });
    }
  };

  if (state.loading) return <div className="loading-spinner">Loading...</div>;
  if (state.error) return <div className="error-message">{state.error}</div>;

  return (
    <div className="relative w-full h-screen bg-gray-200">

      <div 
        className="absolute inset-0" 
        onClick={handleCanvasClick}
      >
        {elements.map(element => {
          switch (element.type) {
            case 'text':
              return <TextElement key={element._id} element={element} />;
            case 'image':
              return <ImageElement key={element._id} element={element} />;
            case 'shape':
              return <ShapeElement key={element._id} element={element} />;
            default:
              return null;
          }
        })}
      </div>
      
      <div className="fixed top-4 left-4 bg-white p-4 rounded-lg shadow-lg">
        <CanvasTools />
      </div>
    </div>
  );
};




const MainCanvas = () => {
  const { boardId } = useParams();
  const { user } = useContext(AuthContext);
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`/api/v1/boards/${boardId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        });

        // Ensure elements array exists
        const boardData = response.data.data || {};
        setBoard({
          ...boardData,
          elements: boardData.elements || [],
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load board");
      } finally {
        setLoading(false);
      }
    };

    if (boardId && user) {
      fetchBoard();
    }
  }, [boardId, user?.token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center h-screen">
        Board not found.
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gray-200">
      
      {board.elements?.map((element) => (
        <div
          key={element._id}
          className="absolute bg-white p-3 shadow-md rounded-md cursor-move"
          style={{
            top: `${element.position?.y || 0}px`,
            left: `${element.position?.x || 0}px`,
            width: `${element.size?.width || 100}px`,
            height: `${element.size?.height || 100}px`,
          }}
        >
          {element.type === "text" && (
            <p className="w-full h-full outline-none">{element.content}</p>
          )}
          {element.type === "image" && (
            <img
              src={element.src}
              alt="Board element"
              className="w-full h-full object-contain"
            />
          )}
        </div>
      ))}
      <Toolbar
        boardId={boardId}
        onAddElement={(newElement) =>
          setBoard((prev) => ({
            ...prev,
            elements: [...prev.elements, newElement],
          }))
        }
      />
    </div>
  );
};

export default MainCanvas;
