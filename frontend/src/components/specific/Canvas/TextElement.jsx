// TextElement.jsx
import React, { useRef, useState } from "react";

const TextElement = ({ element, isSelected, onSelect, onUpdate }) => {
  const [content, setContent] = useState(element.content);
  const textRef = useRef(null);

  const handleInput = (e) => {
    const newContent = e.currentTarget.innerHTML;
    setContent(newContent);
    onUpdate(element._id, { content: newContent });
  };

  const handleBlur = () => {
    onUpdate(element._id, {
      content,
      styles: {
        fontSize: element.styles.fontSize,
        isBold: element.styles.isBold,
        isUnderline: element.styles.isUnderline,
      },
    });
  };

  return (
    <div
      ref={textRef}
      className={`absolute cursor-text ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      style={{
        left: element.position.x,
        top: element.position.y,
        fontSize: element.styles.fontSize,
        fontWeight: element.styles.isBold ? "bold" : "normal",
        textDecoration: element.styles.isUnderline ? "underline" : "none",
      }}
      contentEditable={isSelected}
      onInput={handleInput}
      onBlur={handleBlur}
      onClick={onSelect}
      dangerouslySetInnerHTML={{ __html: element.content }}
    />
  );
};
