import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  return (
    <div className="counter">
      <h2>
        <span>🔢</span> Counter
      </h2>
      <div className="counter-display">
        <span className="count-value">{count}</span>
      </div>
      <div className="counter-buttons">
        <button onClick={decrement} className="counter-btn decrement">
          −
        </button>
        <button onClick={increment} className="counter-btn increment">
          +
        </button>
      </div>
      {count === 0 && (
        <p className="min-message">⚠️ Count cannot go below 0</p>
      )}
    </div>
  );
};

export default Counter;