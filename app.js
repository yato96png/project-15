import React, { useState, useEffect, useMemo } from "react";

const symbols = ['♥️', '♦️', '♣️', '♠️', '★', '☆', '■', '□'];

function MemoryGame() {
  // Генерация карты с повторениями символов
  const generateShuffledCards = () => {
    const cards = [...symbols, ...symbols]; // Дублируем символы
    return cards.sort(() => Math.random() - 0.5); // Перемешиваем
  };

  const [cards, setCards] = useState(generateShuffledCards());
  const [flipped, setFlipped] = useState([]); // Храним индексы перевернутых карт
  const [matched, setMatched] = useState([]); // Храним индексы совпавших карт
  const [moves, setMoves] = useState(0); // Счётчик ходов
  const [gameOver, setGameOver] = useState(false); // Флаг окончания игры
  const [lastFlipTime, setLastFlipTime] = useState(Date.now()); // Для ограничения времени между кликами

  // Мемоизируем карты, чтобы избежать ненужных пересозданий
  const memoizedCards = useMemo(() => cards, [cards]);

  // Функция для переворачивания карты
  const flipCard = (index) => {
    if (gameOver || flipped.length === 2 || Date.now() - lastFlipTime < 1000) {
      return; // Нельзя переворачивать, если игра окончена или дважды нажали за 1 секунду
    }
    setLastFlipTime(Date.now()); // Обновляем время последнего клика
    setFlipped((prev) => [...prev, index]);
  };

  // Проверка на совпадения после переворота 2 карт
  useEffect(() => {
    if (flipped.length === 2) {
      setMoves((prev) => prev + 1); // Увеличиваем количество ходов
      const [firstIndex, secondIndex] = flipped;
      if (cards[firstIndex] === cards[secondIndex]) {
        setMatched((prev) => [...prev, firstIndex, secondIndex]); // Если совпали, добавляем в matched
      }
      setTimeout(() => setFlipped([]), 1000); // Закрыть карты через 1 секунду
    }
  }, [flipped, cards]);

  // Проверка окончания игры
  useEffect(() => {
    if (matched.length === cards.length) {
      setGameOver(true); // Игра окончена, если все карты совпали
    }
  }, [matched]);

  return (
    <div>
      <h1>Memory Game</h1>
      <p>Moves: {moves}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 100px)', gap: '10px' }}>
        {memoizedCards.map((symbol, index) => (
          <div
            key={index}
            onClick={() => flipCard(index)}
            style={{
              width: 100,
              height: 100,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: flipped.includes(index) || matched.includes(index) ? 'lightgray' : 'white',
              border: '1px solid black',
              cursor: gameOver ? 'not-allowed' : 'pointer',
              fontSize: '24px',
            }}
          >
            {(flipped.includes(index) || matched.includes(index)) ? symbol : '❓'}
          </div>
        ))}
      </div>
      {gameOver && <p>Congratulations! You've matched all the cards in {moves} moves!</p>}
    </div>
  );
}

export default MemoryGame;
