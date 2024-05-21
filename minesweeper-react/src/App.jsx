// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Grid from './components/Grid';
import Footer from './components/Footer';

const App = () => {
  const width = 10;
  const bombAmount = 20;
  const [flags, setFlags] = useState(0);
  const [squares, setSquares] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    createBoard();
    startTimer();
    return () => clearInterval(timer);
  }, []);

  const startTimer = () => {
    const newTimer = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
    setTimer(newTimer);
  };

  const stopTimer = () => {
    clearInterval(timer);
  };

  const resetGame = () => {
    stopTimer();
    setTime(0);
    setFlags(0);
    setSquares([]);
    setIsGameOver(false);
    createBoard();
    startTimer();
  };

  const createBoard = () => {
    let bombsArray = Array(bombAmount).fill('bomb');
    let emptyArray = Array(width * width - bombAmount).fill('valid');
    let gameArray = emptyArray.concat(bombsArray);
    let shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    let newSquares = shuffledArray.map((type, i) => ({
      id: i,
      type,
      className: type,
      content: ''
    }));

    for (let i = 0; i < newSquares.length; i++) {
      let total = 0;
      const isLeftEdge = (i % width === 0);
      const isRightEdge = (i % width === width - 1);

      if (newSquares[i].type === 'valid') {
        if (i > 0 && !isLeftEdge && newSquares[i - 1].type === 'bomb') total++;
        if (i > 9 && !isRightEdge && newSquares[i + 1 - width].type === 'bomb') total++;
        if (i > 10 && newSquares[i - width].type === 'bomb') total++;
        if (i > 11 && !isLeftEdge && newSquares[i - 1 - width].type === 'bomb') total++;
        if (i < 98 && !isRightEdge && newSquares[i + 1].type === 'bomb') total++;
        if (i < 90 && !isLeftEdge && newSquares[i - 1 + width].type === 'bomb') total++;
        if (i < 88 && !isRightEdge && newSquares[i + 1 + width].type === 'bomb') total++;
        if (i < 89 && newSquares[i + width].type === 'bomb') total++;
        newSquares[i].data = total;
      }
    }

    setSquares(newSquares);
  };

  const addFlag = (square) => {
    if (isGameOver) return;
    if (!square.className.includes('checked') && (flags < bombAmount)) {
      let newSquares = [...squares];
      if (!square.className.includes('flag')) {
        newSquares[square.id].className += ' flag';
        newSquares[square.id].content = '🚩';
        setFlags(flags + 1);
      } else {
        newSquares[square.id].className = newSquares[square.id].className.replace(' flag', '');
        newSquares[square.id].content = '';
        setFlags(flags - 1);
      }
      setSquares(newSquares);
    }
  };

  const click = (square) => {
    if (isGameOver) return;
    if (square.className.includes('checked') || square.className.includes('flag')) return;
    if (square.type === 'bomb') {
      gameOver(square);
    } else {
      let newSquares = [...squares];
      let total = square.data;
      if (total !== 0) {
        newSquares[square.id].className += ' checked';
        newSquares[square.id].content = total;
        newSquares[square.id].className += ` ${numberToClass(total)}`;
        setSquares(newSquares);
        return;
      }
      checkSquare(newSquares, square.id);
      setSquares(newSquares);
    }
    square.className += ' checked';
  };

  const checkSquare = (newSquares, currentId) => {
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width - 1);

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        click(newSquares[parseInt(currentId) - 1]);
      }
      if (currentId > 9 && !isRightEdge) {
        click(newSquares[parseInt(currentId) + 1 - width]);
      }
      if (currentId > 10) {
        click(newSquares[parseInt(currentId - width)]);
      }
      if (currentId > 11 && !isLeftEdge) {
        click(newSquares[parseInt(currentId) - 1 - width]);
      }
      if (currentId < 98 && !isRightEdge) {
        click(newSquares[parseInt(currentId) + 1]);
      }
      if (currentId < 90 && !isLeftEdge) {
        click(newSquares[parseInt(currentId) - 1 + width]);
      }
      if (currentId < 88 && !isRightEdge) {
        click(newSquares[parseInt(currentId) + 1 + width]);
      }
      if (currentId < 89) {
        click(newSquares[parseInt(currentId) + width]);
      }
    }, 10);
  };

  const gameOver = (square) => {
    setIsGameOver(true);
    stopTimer();

    let newSquares = [...squares];
    newSquares.forEach(square => {
      if (square.type === 'bomb') {
        square.content = '💣';
        square.className = square.className.replace(' bomb', ' checked');
      }
    });
    setSquares(newSquares);
  };

  const checkForWin = () => {
    let matches = 0;
    squares.forEach(square => {
      if (square.className.includes('flag') && square.type === 'bomb') {
        matches++;
      }
    });
    if (matches === bombAmount) {
      setIsGameOver(true);
      stopTimer();
    }
  };

  const numberToClass = (num) => {
    switch (num) {
      case 1:
        return 'one';
      case 2:
        return 'two';
      case 3:
        return 'three';
      case 4:
        return 'four';
      default:
        return '';
    }
  };

  return (
    <div className="container">
      <Header flagsLeft={bombAmount - flags} time={time} resetGame={resetGame} />
      <Grid squares={squares} click={click} addFlag={addFlag} />
      <div id="result">{isGameOver && (squares.some(square => square.content === '💣') ? 'BOOM! Game Over!' : 'YOU WIN!')}</div>
      <Footer />
    </div>
  );
};

export default App;
