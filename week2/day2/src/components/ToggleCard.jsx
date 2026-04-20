import { useState } from 'react';

const ToggleCard = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="toggle-card">
      <div className="toggle-header">
        <h2>
          <span>🔄</span> Toggle Card
        </h2>
        <button onClick={() => setIsVisible(!isVisible)} className="toggle-btn">
          {isVisible ? '🙈 Hide Content' : '🐵 Show Content'}
        </button>
      </div>
      
      {isVisible && (
        <div className="toggle-content">
          <p>✨ This content can be toggled on and off!</p>
          <p>Click the button above to {isVisible ? 'hide' : 'show'} this section.</p>
          <div className="demo-content">
            <strong>📋 Example Content:</strong>
            <ul>
              <li>Dynamic content rendering</li>
              <li>Conditional display logic</li>
              <li>Interactive user experience</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToggleCard;