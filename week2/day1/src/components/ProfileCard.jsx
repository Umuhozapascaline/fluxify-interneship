// ProfileCard.jsx
import Avatar from './Avatar';
import Bio from './Bio';
import Badge from './Badge';

const ProfileCard = ({ name, role, bio, avatar, isAvailable }) => {
  return (
    <div className="profile-card">
      <Avatar image={avatar} name={name} />
      <div className="profile-info">
        <h2>{name}</h2>
        <h3 className="role">{role}</h3>
        <Bio bio={bio} />
        <Badge isAvailable={isAvailable} />
      </div>
    </div>
  );
};

export default ProfileCard;