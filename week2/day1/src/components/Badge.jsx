// Badge.jsx
const Badge = ({ isAvailable }) => {
  // Conditional rendering: Only show badge if isAvailable is true
  return (
    <>
      {isAvailable && (
        <div className="badge available">
          ✅ Available for hire
        </div>
      )}
    </>
  );
};

export default Badge;