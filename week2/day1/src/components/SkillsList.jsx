// SkillsList.jsx
const SkillsList = ({ skills }) => {
  return (
    <div className="skills-section">
      <h3>Skills & Tools</h3>
      
      {/* 
        WHY REACT NEEDS UNIQUE KEYS:
        
        1. React uses keys to identify which items have changed, been added, 
        or been removed in a list, helping it update only the necessary DOM elements.
        
        2. Without unique keys, React would have to re-render the entire list 
        every time a change occurs, which hurts performance for large lists.
        
        3. Keys provide stability to list items, allowing React to maintain 
        component state across re-renders and prevent unexpected behavior 
        when items are reordered.
      */}
      
      <div className="skills-list">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <span key={`${skill}-${index}`} className="skill-tag">
              {skill}
            </span>
          ))
        ) : (
          <p className="no-items">No items found</p>
        )}
      </div>
    </div>
  );
};

export default SkillsList;