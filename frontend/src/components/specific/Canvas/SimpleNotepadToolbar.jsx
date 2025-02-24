import React from "react";
import { FaImage, FaMicrophone, FaSave } from "react-icons/fa";

const SimpleNotepadToolbar = ({
  onImageUpload,
  onRecordAudio,
  isRecording,
  onSave,
}) => {
  return (
    <div className="bg-gray-100 p-2 flex gap-2 border-b">
      <label className="cursor-pointer p-2 hover:bg-gray-200 rounded">
        <FaImage className="inline mr-1" />
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onImageUpload(e.target.files[0])}
          className="hidden"
        />
      </label>

      <button
        onClick={onRecordAudio}
        className={`p-2 hover:bg-gray-200 rounded ${
          isRecording ? "text-red-500" : ""
        }`}
      >
        <FaMicrophone className="inline mr-1" />
        {isRecording ? "Stop Recording" : "Record Audio"}
      </button>

      <button
        onClick={onSave}
        className="p-2 hover:bg-gray-200 rounded ml-auto"
      >
        <FaSave className="inline mr-1" />
        Save
      </button>
    </div>
  );
};

export default SimpleNotepadToolbar;
