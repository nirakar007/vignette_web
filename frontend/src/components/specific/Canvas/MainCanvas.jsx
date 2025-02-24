import axios from "axios";
import React, { useCallback, useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import SimpleNotepadToolbar from "./SimpleNotepadToolbar"; // Rename/replace Toolbar

const MainCanvas = () => {
  const { boardId } = useParams();
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  // Configure API instance
  const api = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });

  // Fetch board data
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await api.get(`/boards/${boardId}`);
        setContent(response.data.content || "");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load board");
      } finally {
        setLoading(false);
      }
    };

    if (boardId && user) fetchBoard();
  }, [boardId, user?.token]);

  // Save content with debounce
  const saveContent = useCallback(
    async (newContent) => {
      try {
        await api.put(`/boards/${boardId}`, { content: newContent });
      } catch (err) {
        console.error("Save error:", err);
      }
    },
    [boardId]
  );

  // Handle image upload
  const handleImageUpload = useCallback(
    async (file) => {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await api.post(`/boards/${boardId}/upload`, formData);
        const imgHTML = `<img src="${res.data.url}" alt="Uploaded image" class="max-w-full h-auto my-2" />`;
        setContent((prev) => {
          const newContent = prev + imgHTML;
          saveContent(newContent);
          return newContent;
        });
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    },
    [boardId, saveContent]
  );

  // Handle audio recording
  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.start();
        setIsRecording(true);

        mediaRecorder.current.ondataavailable = (e) => {
          audioChunks.current.push(e.data);
        };

        mediaRecorder.current.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/webm",
          });
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");

          try {
            const res = await api.post(`/boards/${boardId}/upload`, formData);
            const audioHTML = `
              <div class="my-2">
                <audio controls src="${res.data.url}"></audio>
              </div>
            `;
            setContent((prev) => {
              const newContent = prev + audioHTML;
              saveContent(newContent);
              return newContent;
            });
          } catch (err) {
            console.error("Audio upload failed:", err);
          }

          audioChunks.current = [];
        };
      } catch (err) {
        console.error("Microphone access denied:", err);
      }
    }
  }, [boardId, isRecording, saveContent]);

  // Auto-save with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveContent(content);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [content, saveContent]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="w-full h-screen flex flex-col">
      <SimpleNotepadToolbar
        onImageUpload={handleImageUpload}
        onRecordAudio={toggleRecording}
        isRecording={isRecording}
        onSave={() => saveContent(content)}
      />

      <div
        className="flex-1 p-4 bg-white overflow-auto"
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
        contentEditable
        placeholder="Start typing..."
      />
    </div>
  );
};

export default MainCanvas;

// import axios from "axios";
// import React, { useCallback, useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { AuthContext } from "../../../context/AuthContext";
// import CanvasElement from "./CanvasElement"; // Create this component
// import Toolbar from "./Toolbar";

// const MainCanvas = () => {
//   const { boardId } = useParams();
//   const { user } = useContext(AuthContext);
//   const [board, setBoard] = useState({ elements: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedElement, setSelectedElement] = useState(null);
//   const [drawingMode, setDrawingMode] = useState(false);

//   // Fetch board data
//   useEffect(() => {
//     const fetchBoard = async () => {
//       try {
//         const response = await axios.get(`/api/v1/boards/${boardId}`, {
//           headers: { Authorization: `Bearer ${user?.token}` },
//         });
//         setBoard({
//           ...response.data.data,
//           elements: response.data.data?.elements || [],
//         });
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load board");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (boardId && user) fetchBoard();
//   }, [boardId, user?.token]);

//   // Handle element updates
//   const updateElement = useCallback(
//     async (updatedEl) => {
//       try {
//         await axios.put(
//           `/api/v1/boards/${boardId}/elements/${updatedEl._id}`,
//           updatedEl,
//           { headers: { Authorization: `Bearer ${user?.token}` } }
//         );
//         setBoard((prev) => ({
//           ...prev,
//           elements: prev.elements.map((el) =>
//             el._id === updatedEl._id ? updatedEl : el
//           ),
//         }));
//       } catch (err) {
//         console.error("Update error:", err);
//       }
//     },
//     [boardId, user?.token]
//   );

//   // Handle new elements
//   const handleAddElement = useCallback(
//     async (newEl) => {
//       try {
//         const res = await axios.post(
//           `/api/v1/boards/${boardId}/elements`,
//           newEl,
//           { headers: { Authorization: `Bearer ${user?.token}` } }
//         );
//         setBoard((prev) => ({
//           ...prev,
//           elements: [...prev.elements, res.data],
//         }));
//       } catch (err) {
//         console.error("Create error:", err);
//       }
//     },
//     [boardId, user?.token]
//   );

//   // Handle element deletion
//   const deleteElement = useCallback(
//     async (elementId) => {
//       try {
//         await axios.delete(`/api/v1/boards/${boardId}/elements/${elementId}`, {
//           headers: { Authorization: `Bearer ${user?.token}` },
//         });
//         setBoard((prev) => ({
//           ...prev,
//           elements: prev.elements.filter((el) => el._id !== elementId),
//         }));
//       } catch (err) {
//         console.error("Delete error:", err);
//       }
//     },
//     [boardId, user?.token]
//   );

//   // Handle text content changes
//   const handleContentChange = (elementId, newContent) => {
//     setBoard((prev) => ({
//       ...prev,
//       elements: prev.elements.map((el) =>
//         el._id === elementId ? { ...el, content: newContent } : el
//       ),
//     }));
//     // Debounce the API update
//     setTimeout(() => {
//       const element = board.elements.find((el) => el._id === elementId);
//       if (element) updateElement({ ...element, content: newContent });
//     }, 1000);
//   };

//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (e.key === "Delete" && selectedElement) {
//         deleteElement(selectedElement);
//       }
//     };

//     window.addEventListener("keydown", handleKeyPress);
//     return () => window.removeEventListener("keydown", handleKeyPress);
//   }, [selectedElement, deleteElement]);

//   if (loading) return <div className="loading-spinner">Loading...</div>;
//   if (error) return <div className="error-message">{error}</div>;

//   return (
//     <div className="relative w-full h-screen bg-gray-50">
//       {/* Main Canvas Area */}
//       <div className="absolute inset-0">
//         {board.elements.map((element) => (
//           <CanvasElement
//             key={element._id}
//             element={element}
//             isSelected={selectedElement === element._id}
//             drawingMode={drawingMode}
//             onSelect={setSelectedElement}
//             onUpdate={updateElement}
//             onDelete={deleteElement}
//             onContentChange={handleContentChange}
//           />
//         ))}
//       </div>

//       <Toolbar
//         boardId={boardId}
//         drawingMode={drawingMode}
//         setDrawingMode={setDrawingMode}
//         onAddElement={handleAddElement}
//       />
//     </div>
//   );
// };

// export default MainCanvas;
