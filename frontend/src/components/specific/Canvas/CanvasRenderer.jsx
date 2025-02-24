// CanvasRenderer.jsx (or whatever you named it)
import React, { useRef } from "react";

const CanvasRenderer = ({ elements, boardId }) => { // Receives elements as prop
    const boardRef = useRef(null);

    return (
        <div className="h-screen w-screen relative bg-gray-50">
            {/* Main editable area */}
            <div
                ref={boardRef}
                className="h-full w-full p-8 focus:outline-none"
                contentEditable
                placeholder="Start typing your notes..."
            >
                {/* You might still want to allow direct text input, or remove contentEditable if text elements are only added via Toolbar */}
            </div>

            {/* Display elements OUTSIDE the contentEditable div */}
            {elements.map((element, index) => { // <-- LINE 22 is likely HERE now in CanvasRenderer
                if (element.type === "image") {
                    return (
                        <img
                            key={index}
                            src={`http://localhost:5000/uploads/${element.filename}`}
                            alt="Uploaded content"
                            className="absolute max-w-xs shadow-lg cursor-move"
                            style={{
                                left: element.position?.x || 0,
                                top: element.position?.y || 0,
                            }}
                        />
                    );
                }
                if (element.type === "text") {
                    return (
                        <div
                            key={index}
                            className="absolute shadow-md cursor-move"
                            style={{
                                left: element.position?.x || 0,
                                top: element.position?.y || 0,
                                border: '1px solid black', padding: '5px', backgroundColor: 'white'
                            }}
                        >
                            {element.content}
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
};

export default CanvasRenderer;