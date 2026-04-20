import { useState } from 'react';

const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState('#3498db');
  
  const colors = [
    { name: 'Blue', value: '#3498db', emoji: '💙' },
    { name: 'Red', value: '#e74c3c', emoji: '❤️' },
    { name: 'Green', value: '#2ecc71', emoji: '💚' },
    { name: 'Purple', value: '#9b59b6', emoji: '💜' }
  ];

  return (
    <div className="color-picker">
      <h2>
        <span>🎨</span> Color Picker
      </h2>
      <div className="color-buttons">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => setSelectedColor(color.value)}
            className="color-btn"
            style={{ backgroundColor: color.value }}
          >
            {color.emoji} {color.name}
          </button>
        ))}
      </div>
      
      <div className="preview-section">
        <h3>📦 Preview Box</h3>
        <div className="preview-box" style={{ backgroundColor: selectedColor }}>
          <p>This box changes color!</p>
          <p className="color-code">{selectedColor}</p>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;