// App.jsx
import './App.css';
import Counter from './components/Counter';
import ToggleCard from './components/ToggleCard';
import ColorPicker from './components/ColorPicker';
import ShoppingCart from './components/ShoppingCart';

function App() {
  return (
    <div className="app">
      <h1 className="main-title">React State Management Exercises</h1>
      
      {/* Task 1: Basic State Management */}
      <section className="exercise-section">
        <h2 className="section-title">📌 Task 1: Basic State Management</h2>
        <div className="components-grid">
          <Counter />
          <ToggleCard />
          <ColorPicker />
        </div>
      </section>

      {/* Task 2: Product Listing with Shared State */}
      <section className="exercise-section">
        <h2 className="section-title">📌 Task 2: Product Listing with Shared State</h2>
        <ShoppingCart />
      </section>
    </div>
  );
}

export default App;