// src/components/Header.jsx
import React from 'react';

const Header = ({ flagsLeft, time, resetGame }) => {
  return (
    <div className="header">
      <div>Flags left: <span>{flagsLeft}</span></div>
      <div id="timer">Time: <span>{time}</span>s</div>
      <button id="reset-button" onClick={resetGame}>Reset</button>
    </div>
  );
};

export default Header;
