import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Board = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/boards/${boardId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBoard(response.data);
      } catch (err) {
        console.error("Error fetching board:", err);
        setError("Failed to load board.");
      } finally {
        setLoading(false);
      }
    };

    if (boardId) {
      fetchBoard();
    }
  }, [boardId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!board) return <div>No board found.</div>;

  return (
    <div className="board-container p-4">
      <h1 className="text-2xl font-bold mb-2">{board.title}</h1>
      <p className="mb-4">{board.details}</p>
      {board.image && (
        <img
          src={`http://localhost:5000/${board.elements[image]}`}
          alt="Board"
          className="max-w-full mb-4"
        />
      )}
      <div className="elements mt-4">
        {board.elements &&
          board.elements.map((element, index) => (
            <div key={index} className="element p-2 border rounded mb-2">
              <p>Type: {element.type}</p>
              {element.type === "text" && <p>{element.content}</p>}
              {element.type === "image" && (
                <img
                  src={`http://localhost:5000/${element.image}`}
                  alt="Element"
                  className="max-w-xs"
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Board;
