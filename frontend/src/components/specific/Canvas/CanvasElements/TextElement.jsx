import { useEffect, useState } from 'react';
import { useCanvas } from '../CanvasContext';

const TextElement = ({ element }) => {
  const { dispatch, persistElement } = useCanvas();
  const [content, setContent] = useState(element.content);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setContent(element.content);
  }, [element.content]);

  const handleUpdate = () => {
    const updated = { ...element, content };
    persistElement(updated);
    setIsEditing(false);
  };

  return (
    <div
      className="absolute bg-white p-2 rounded-md shadow-md cursor-text"
      style={{
        top: `${element.position.y}px`,
        left: `${element.position.x}px`,
        width: `${element.size.width}px`,
        minHeight: `${element.size.height}px`
      }}
      onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: element._id })}
    >
      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleUpdate}
          className="w-full h-full outline-none resize-none"
          autoFocus
        />
      ) : (
        <div className="w-full h-full" onDoubleClick={() => setIsEditing(true)}>
          {content}
        </div>
      )}
    </div>
  );
};

export default TextElement;