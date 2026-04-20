// Avatar.jsx
const Avatar = ({ image, name }) => {
  return (
    <div className="avatar">
      <img 
        src={image} 
        alt={`${name}'s avatar`}
        className="avatar-image"
      />
    </div>
  );
};

export default Avatar;