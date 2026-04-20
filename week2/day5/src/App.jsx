// App.jsx
import React, { useState, useMemo } from 'react';
import './App.css';

// ==================== INITIAL DATA ====================
const initialMembers = [
  { id: 1, name: "Alex Morgan", role: "Frontend Lead", department: "Engineering", avatarInitial: "AM" },
  { id: 2, name: "Jordan Lee", role: "UX Designer", department: "Product Design", avatarInitial: "JL" },
  { id: 3, name: "Casey Rivera", role: "Backend Developer", department: "Engineering", avatarInitial: "CR" },
  { id: 4, name: "Taylor Smith", role: "Product Manager", department: "Product", avatarInitial: "TS" },
  { id: 5, name: "Riley Johnson", role: "QA Engineer", department: "Quality Assurance", avatarInitial: "RJ" },
  { id: 6, name: "Morgan Freeman", role: "DevOps Specialist", department: "Infrastructure", avatarInitial: "MF" }
];

// ==================== AVATAR COMPONENT ====================
const AvatarPlaceholder = ({ name, initial }) => {
  const getColorFromName = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 75%)`;
  };
  const bgColor = getColorFromName(name);
  const displayInitial = initial && initial.length >= 2 ? initial.slice(0,2).toUpperCase() : (name ? name.slice(0,2).toUpperCase() : "TM");
  return (
    <div className="avatar-placeholder" style={{ backgroundColor: bgColor }}>
      {displayInitial}
    </div>
  );
};

// ==================== MEMBER CARD COMPONENT ====================
const MemberCard = ({ member }) => {
  return (
    <div className="member-card">
      <AvatarPlaceholder name={member.name} initial={member.avatarInitial} />
      <div className="member-info">
        <h3 className="member-name">{member.name}</h3>
        <p className="member-role">{member.role}</p>
        <div className="member-department-badge">
          <span>{member.department}</span>
        </div>
      </div>
    </div>
  );
};

// ==================== SEARCH BAR COMPONENT ====================
const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-wrapper">
      <div className="search-container">
        <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or role..."
          className="search-input"
        />
      </div>
    </div>
  );
};

// ==================== ADD MEMBER FORM COMPONENT ====================
const AddMemberForm = ({ onAddMember }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim() || !formData.department.trim()) {
      setError('All fields are required.');
      return;
    }
    const newMember = {
      id: Date.now(),
      name: formData.name.trim(),
      role: formData.role.trim(),
      department: formData.department.trim(),
      avatarInitial: formData.name.trim().slice(0,2).toUpperCase() || "TM"
    };
    onAddMember(newMember);
    setFormData({ name: '', role: '', department: '' });
    setError('');
  };

  return (
    <div className="form-card">
      <h2 className="form-title">
        <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a5 5 0 0110 0v1H3v-1z" />
        </svg>
        Add Team Member
      </h2>
      <form onSubmit={handleSubmit} className="add-member-form">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Jamie Parker"
          />
        </div>
        <div className="form-group">
          <label>Role *</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g., Data Scientist"
          />
        </div>
        <div className="form-group">
          <label>Department *</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g., Analytics"
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="submit-btn">
          + Add Member
        </button>
      </form>
    </div>
  );
};

// ==================== MEMBER LIST COMPONENT ====================
const MemberList = ({ members }) => {
  if (members.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="empty-title">No matching team members found</p>
        <p className="empty-subtitle">Try adjusting your search or add a new member</p>
      </div>
    );
  }
  
  return (
    <>
      {members.map(member => (
        <MemberCard key={member.id} member={member} />
      ))}
    </>
  );
};

// ==================== MAIN APP COMPONENT ====================
const App = () => {
  const [members, setMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return members;
    const lowerQuery = searchTerm.toLowerCase();
    return members.filter(member => 
      member.name.toLowerCase().includes(lowerQuery) || 
      member.role.toLowerCase().includes(lowerQuery)
    );
  }, [members, searchTerm]);

  const handleAddMember = (newMember) => {
    setMembers(prevMembers => [...prevMembers, newMember]);
  };

  return (
    <div className="app-container">
      <div className="app-inner">
        {/* Header */}
        <div className="app-header">
          <h1 className="app-title">Team Directory</h1>
          <p className="app-subtitle">Meet our talented team · Search, explore & grow together</p>
        </div>
        
        {/* Search + Form Row */}
        <div className="action-row">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <AddMemberForm onAddMember={handleAddMember} />
        </div>
        
        {/* Member Grid */}
        <div className="members-section">
          <div className="members-grid">
            <MemberList members={filteredMembers} />
          </div>
          <div className="member-count">
            Showing {filteredMembers.length} of {members.length} team members
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;