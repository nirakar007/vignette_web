import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import Toolbar from "./Toolbar";
import { useLocation } from "react-router-dom";

const Canvas = () => {
  const { boardId } = useParams();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [elements, setElements] = useState([]);
  // const [boardName, setBoardName] = useState("");
  const boardRef = useRef(null);
  const [content, setContent] = useState("");

  // // Load board and elements
  // useEffect(() => {
  //   const loadBoard = async () => {
  //     try {
  //       const url = `http://localhost:5000/api/v1/boards/${boardId}`;
  //       const res = await axios.get(url, {
  //         headers: { Authorization: `Bearer ${user?.token}` },
  //       });
  //       if (res.data.success) {
  //         const board = res.data.data;
  //         setElements(res.data.elements || []);
  //         // setBoardName(location.state?.boardName);

  //         // Initialize text content
  //         const textElement = board.elements.find((el) => el.type === "text");
  //         if (textElement && boardRef.current) {
  //           boardRef.current.innerHTML = textElement.content;
  //           setContent(textElement.content);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error loading board:", error);
  //     }
  //   };
  //   loadBoard();
  // }, [boardId, user?.token]);
  useEffect(() => {
    const loadBoard = async () => {
      try {
        const url = `http://localhost:5000/api/v1/boards/${boardId}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });

        if (res.data.success) {
          const board = res.data.board;

          // Fix image URLs inside content
          // let updatedContent = board.content.replace(
          //   /src="\/uploads\//g,
          //   'src="http://localhost:5000/uploads/'
          // );

          // Set text content from elements
          if (board.elements) {
            setContent(board.elements.replace(/&nbsp;/g, " "));
            if (boardRef.current) boardRef.current.innerText = cleanText; // Replace &nbsp; with space
          }
        }
      } catch (error) {
        console.error("Error loading board:", error);
      }
    };

    loadBoard();
  }, [boardId, user?.token]);

  // Autosave text content
  useEffect(() => {
    const autosave = async () => {
      const htmlContent = boardRef.current?.innerHTML;
      if (!htmlContent || htmlContent === content) return;

      try {
        const textElement = elements.find((el) => el.type === "text");
        if (textElement) {
          await axios.put(
            `/api/v1/boards/${boardId}/elements/${textElement._id}`,
            { content: htmlContent },
            { headers: { Authorization: `Bearer ${user?.token}` } }
          );
        } else {
          const res = await axios.post(
            `/api/v1/boards/${boardId}/elements`,
            {
              type: "text",
              content: htmlContent,
              position: { x: 0, y: 0 },
            },
            { headers: { Authorization: `Bearer ${user?.token}` } }
          );
          setElements((prev) => [...prev, res.data.data]);
        }
        setContent(htmlContent);
      } catch (error) {
        console.error("Autosave failed:", error);
      }
    };

    const timer = setTimeout(autosave, 1000);
    return () => clearTimeout(timer);
  }, [content, elements, boardId, user?.token]);

  // Handle image upload (Fixed)
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

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

      console.log("Upload Response:", res.data.success);

      if (res.success && res.imageUrl) {
        // Ensure correct image URL
        const imageUrl = res.imageUrl.startsWith("http")
          ? res.imageUrl
          : `http://localhost:5000/${res.imageUrl}`;

        const newElement = {
          type: "image",
          src: imageUrl,
          position: { x: 100, y: 100 },
          size: { width: 200, height: 200 },
        };

        setElements((prev) => [...prev, newElement]);
        toast.success("Image uploaded successfully");
      } else {
        console.error("Image upload error: No valid URL received");
        toast.error("Image upload failed");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed");
    }
  };

  // Update element position
  const updateElementPosition = async (elementId, x, y) => {
    try {
      await axios.put(
        `/api/v1/boards/${boardId}/elements/${elementId}`,
        { position: { x, y } },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setElements((prev) =>
        prev.map((el) =>
          el._id === elementId ? { ...el, position: { x, y } } : el
        )
      );
    } catch (error) {
      console.error("Position update failed:", error);
    }
  };

  // Delete element
  const handleDeleteElement = async (elementId) => {
    try {
      await axios.delete(`/api/v1/boards/${boardId}/elements/${elementId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setElements((prev) => prev.filter((el) => el._id !== elementId));
      toast.success("Element deleted");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="h-screen w-screen relative bg-gray-50">
      <Toolbar
        boardId={boardId}
        onImageUpload={handleImageUpload}
        boardElements={content}
        boardName={location.state?.boardName}
      />

      {/* Editable text area */}
      <div
        ref={boardRef}
        className="h-[75%] w-full p-8 focus:outline-none"
        contentEditable
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
        placeholder="Start typing..."
        dangerouslySetInnerHTML={{ __html: content }} // Render stored HTML
      />

      {/* Render draggable elements */}
      {/* {elements.map((element) => {
        if (element.type === "image" && element.src) {
          return (
            <Draggable
              key={element._id}
              position={element.position}
              onStop={(e, data) => {
                updateElementPosition(element._id, data.x, data.y);
              }}
            >
              <div className="absolute cursor-move group">
                <img
                  // src={element.src}
                  src="http://localhost:5000/uploads/IMG-1740909304851.jpg/"
                  alt="Uploaded content"
                  className="max-w-xs shadow-lg"
                  style={{
                    width: element.size?.width,
                    height: element.size?.height,
                  }}
                />
                <button
                  onClick={() => handleDeleteElement(element._id)}
                  className="absolute top-0 right-0 bg-red-500 text-white px-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            </Draggable>
          );
        }
        return null;
      })} */}
    </div>
  );
};

export default Canvas;
