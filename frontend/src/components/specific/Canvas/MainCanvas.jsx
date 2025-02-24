import axios from "axios";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import Toolbar from "./Toolbar";

const MainCanvas = () => {
  const { boardId } = useParams();
  const { user } = useContext(AuthContext);
  const [elements, setElements] = useState([]);
  const [drawingMode, setDrawingMode] = useState(false);
  const boardRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load board data on mount
  useEffect(() => {
    const loadBoard = async () => {
      try {
        const res = await axios.get(`/api/v1/boards/${boardId}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setElements(res.data.elements || []);
      } catch (error) {
        console.error("Error loading board:", error);
      }
    };

    if (boardId) loadBoard();
  }, [boardId, user?.token]); // Removed elements from dependencies

  // Save handler with error feedback
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await axios.put(
        `/api/v1/boards/${boardId}`,
        { elements },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      console.log("Board saved successfully");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save board. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  }, [elements, boardId, user?.token]);

  // Add new element with position validation
  const handleAddElement = (newElement) => {
    setElements((prev) => [
      ...prev,
      {
        ...newElement,
        position: {
          x: Math.random() * window.innerWidth * 0.5,
          y: Math.random() * window.innerHeight * 0.5,
        },
      },
    ]);
  };

  const handleTextInput = (e) => {
    const textElement = elements.find((el) => el.type === "text") || {
      type: "text",
      content: "",
      position: { x: 20, y: 20 },
    };

    textElement.content = e.target.textContent; // <--- Changed to textContent
    setElements((prev) => [
      ...prev.filter((el) => el.type !== "text"),
      textElement,
    ]);
  };

  return (
    <div className="h-screen w-screen relative bg-gray-50">
      <Toolbar
        boardId={boardId}
        onAddElement={handleAddElement}
        drawingMode={drawingMode}
        setDrawingMode={setDrawingMode}
        onSave={handleSave}
      />

      {/* Main editable area */}
      <div
        ref={boardRef}
        className="h-full w-full p-8 focus:outline-none"
        contentEditable
        placeholder="Start typing your notes..."
        onInput={handleTextInput}
      />

      {/* Display elements OUTSIDE the contentEditable div */}
      {elements.map((element, index) => {
        if (element.type === "image") {
          return (
            <img
              key={index}
              src={element.src}
              alt="Uploaded content"
              className="absolute max-w-xs shadow-lg cursor-move"
              style={{
                left: element.position?.x || 0,
                top: element.position?.y || 0,
              }}
            />
          );
        }
        return null;
      })}

      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md">
          Saving...
        </div>
      )}
    </div>
  );
};

export default MainCanvas;

// import axios from "axios";
// import React, {
//   useCallback,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { useParams } from "react-router-dom";
// import { AuthContext } from "../../../context/AuthContext";

// const MainCanvas = () => {
//   const { boardId } = useParams();
//   console.log({ boardId });
//   const { user } = useContext(AuthContext);
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [images, setImages] = useState([]);
//   const fileInputRef = useRef(null);

//   // Create axios instance with dynamic token
//   const getApi = useCallback(() => {
//     const token = user?.token || localStorage.getItem("token");
//     return axios.create({
//       baseURL: "http://localhost:5000/api/v1",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });
//   }, [user?.token]);

//   // Add request interceptor
//   useEffect(() => {
//     const api = getApi();

//     const requestInterceptor = api.interceptors.request.use(
//       (config) => {
//         if (!config.headers.Authorization) {
//           const token = user?.token || localStorage.getItem("token");
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     const responseInterceptor = api.interceptors.response.use(
//       (response) => response,
//       (error) => {
//         if (error.response?.status === 401) {
//           localStorage.removeItem("token");
//           window.location.href = "/sign-in";
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       api.interceptors.request.eject(requestInterceptor);
//       api.interceptors.response.eject(responseInterceptor);
//     };
//   }, [getApi, user?.token]);

//   // Fetch board data
//   useEffect(() => {
//     const fetchBoard = async () => {
//       try {
//         const api = getApi();
//         const response = await api.get(`/boards/${boardId}`);
//         setContent(response.data.content || "");
//         setImages(response.data.images || []);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load board");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (boardId && user) fetchBoard();
//   }, [boardId, user, getApi]);

//   // Save content with proper auth
//   const saveContent = useCallback(
//     async (newContent) => {
//       try {
//         const api = getApi();
//         await api.put(`/boards/${boardId}`, { content: newContent });
//       } catch (err) {
//         console.error("Save error:", err);
//         if (err.response?.status === 401) {
//           localStorage.removeItem("token");
//           window.location.href = "/sign-in";
//         }
//       }
//     },
//     [boardId, getApi]
//   );

//   // Handle image upload with proper auth
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       setLoading(true);
//       const api = getApi();
//       const res = await api.post(`/boards/${boardId}/images`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       setImages((prev) => [...prev, res.data]);
//     } catch (err) {
//       console.error("Image upload failed:", err);
//       if (err.response?.status === 401) {
//         localStorage.removeItem("token");
//         window.location.href = "/sign-in";
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-save with debounce
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       saveContent(content);
//     }, 2000);

//     return () => clearTimeout(timeout);
//   }, [content, saveContent]);

//   if (loading) return <div className="loading-spinner">Loading...</div>;
//   if (error) return <div className="error-message">{error}</div>;

//   return (
//     <div className="w-full h-screen flex flex-col p-4 bg-gray-50">
//       {/* Toolbar */}
//       <div className="flex gap-2 mb-4">
//         <button
//           onClick={() => fileInputRef.current.click()}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Upload Image
//         </button>
//         <input
//           type="file"
//           ref={fileInputRef}
//           accept="image/*"
//           onChange={handleImageUpload}
//           className="hidden"
//         />
//       </div>

//       {/* Content Area */}
//       <div className="flex-1 bg-white p-6 rounded-lg shadow">
//         {/* Text Editor */}
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           className="w-full h-48 p-2 border rounded mb-4"
//           placeholder="Start typing your notes..."
//         />

//         {/* Image Gallery */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {images.map((image, index) => (
//             <div key={index} className="relative group">
//               <img
//                 src={`http://localhost:5000/uploads/${image.filename}`}
//                 alt={`Uploaded ${index}`}
//                 className="w-full h-48 object-cover rounded-lg"
//               />
//               <button
//                 onClick={() => {
//                   setImages((prev) => prev.filter((_, i) => i !== index));
//                   api.delete(`/boards/${boardId}/images/${image._id}`);
//                 }}
//                 className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 &times;
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainCanvas;
