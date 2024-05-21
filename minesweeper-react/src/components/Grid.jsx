// src/components/Grid.jsx
import React from 'react';

const Grid = ({ squares, click, addFlag }) => {
  return (
    <div className="grid">
      {squares.map((square, i) => (
        <div
          key={i}
          id={i}
          className={square.className}
          onClick={() => click(square)}
          onContextMenu={(e) => { e.preventDefault(); addFlag(square); }}
        >
          {square.content}
        </div>
      ))}
    </div>
  );
};

export default Grid;
