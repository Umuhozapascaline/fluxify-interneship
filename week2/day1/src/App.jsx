// App.jsx
import './App.css';
import ProfileCard from './components/ProfileCard';
import SkillsList from './components/SkillsList';

// Sample avatar images (you can use any image URLs)
const avatars = {
  sarah: 'https://randomuser.me/api/portraits/women/1.jpg',
  michael: 'https://randomuser.me/api/portraits/men/2.jpg',
  emily: 'https://randomuser.me/api/portraits/women/3.jpg',
};

function App() {
  // Sample data for different profile cards
  const profiles = [
    {
      name: 'Sarah Johnson',
      role: 'Senior Frontend Developer',
      bio: 'Passionate about creating beautiful and responsive web applications with 7+ years of experience.',
      avatar: avatars.sarah,
      isAvailable: true,
      skills: ['React', 'Vue.js', 'Tailwind CSS', 'TypeScript', 'Next.js'],
    },
    {
      name: 'Michael Chen',
      role: 'Full Stack Engineer',
      bio: 'Building scalable applications with modern JavaScript frameworks and cloud technologies.',
      avatar: avatars.michael,
      isAvailable: false,
      skills: ['Node.js', 'Python', 'Django', 'PostgreSQL', 'AWS'],
    },
    {
      name: 'Emily Rodriguez',
      role: 'UI/UX Developer',
      bio: 'Designing and implementing user-centered interfaces that deliver exceptional experiences.',
      avatar: avatars.emily,
      isAvailable: true,
      skills: ['Figma', 'Adobe XD', 'CSS3', 'JavaScript', 'React'],
    },
  ];

  return (
    <div className="app">
      <h1 className="app-title">Team Members</h1>
      <div className="profiles-container">
        {profiles.map((profile, index) => (
          <div key={index} className="profile-wrapper">
            <ProfileCard {...profile} />
            <SkillsList skills={profile.skills} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;