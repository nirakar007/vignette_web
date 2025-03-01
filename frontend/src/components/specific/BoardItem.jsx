import React from "react";
import { Link } from "react-router-dom";

const BoardItem = ({ board }) => {
  return (
    <Link
      to={`/edit-board/${board._id}`}
      className="w-full md:w-1/3 lg:w-1/4 bg-zinc-800 p-4 rounded-lg text-white"
    >
      <h3 className="text-xl font-bold">{board.title}</h3>
      <p className="text-gray-400 text-sm">
        Created on: {new Date(board.createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
};

export default BoardItem;
