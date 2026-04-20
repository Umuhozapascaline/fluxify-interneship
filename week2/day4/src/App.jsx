// App.jsx
import React, { useState } from 'react';
import './App.css';

const App = () => {
  // ========== TASK 1: Registration Form State ==========
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const [successMessage, setSuccessMessage] = useState('');

  // ========== TASK 2: Live Preview State ==========
  const [profile, setProfile] = useState({
    name: '',
    jobTitle: '',
    bio: ''
  });

  // ========== TASK 1: Validation & Submission ==========
  const validateForm = () => {
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: ''
    };
    let isValid = true;

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage(''); // Clear previous success message

    if (validateForm()) {
      // Clear form on success
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
      });
      setSuccessMessage('Account created successfully!');
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // ========== TASK 2: Live Preview Handlers ==========
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>✨ Registration + Live Preview</h1>
        <p>Task 1: Secure registration form | Task 2: Dynamic profile preview</p>
      </div>

      <div className="two-column-layout">
        {/* LEFT COLUMN - Forms */}
        <div className="left-column">
          {/* TASK 1: Registration Form */}
          <div className="form-card">
            <div className="card-header registration-header">
              <h2>📝 Create Account</h2>
              <p>All fields required · secure password validation</p>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} noValidate>
                {/* Full Name Field */}
                <div className="form-group">
                  <label>Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Johnathan Doe"
                    className={errors.fullName ? 'error-input' : ''}
                  />
                  {errors.fullName && <p className="error-message">{errors.fullName}</p>}
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <label>Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className={errors.email ? 'error-input' : ''}
                  />
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label>Password <span className="required">*</span></label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="•••••••• (min 8 chars)"
                    className={errors.password ? 'error-input' : ''}
                  />
                  {errors.password && <p className="error-message">{errors.password}</p>}
                </div>

                {/* Confirm Password Field */}
                <div className="form-group">
                  <label>Confirm Password <span className="required">*</span></label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="repeat password"
                    className={errors.confirmPassword ? 'error-input' : ''}
                  />
                  {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                </div>

                {/* Role Dropdown */}
                <div className="form-group">
                  <label>Role <span className="required">*</span></label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={errors.role ? 'error-input' : ''}
                  >
                    <option value="">-- Select your role --</option>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Admin">Admin</option>
                    <option value="Guest">Guest</option>
                  </select>
                  {errors.role && <p className="error-message">{errors.role}</p>}
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="success-message">{successMessage}</div>
                )}

                <button type="submit" className="submit-btn registration-btn">
                  🚀 Register Account
                </button>
              </form>
            </div>
          </div>

          {/* TASK 2: Live Preview Form */}
          <div className="form-card">
            <div className="card-header preview-header">
              <h2>🎭 Dynamic Profile Editor</h2>
              <p>Type anything — preview updates instantly on the right</p>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Full Name / Display Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="e.g., Alex Johnson"
                />
              </div>

              <div className="form-group">
                <label>Job Title / Role</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={profile.jobTitle}
                  onChange={handleProfileChange}
                  placeholder="Frontend Developer, Designer, ..."
                />
              </div>

              <div className="form-group">
                <label>Short Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  rows="3"
                  placeholder="Tell something about yourself..."
                ></textarea>
              </div>
              <p className="helper-text">✨ Live preview updates on every keystroke</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Live Profile Preview Card */}
        <div className="right-column">
          <div className="preview-card">
            <div className="preview-header-gradient">
              <h3>👤 Live Profile Card</h3>
              <p>Updates as you type</p>
            </div>
            <div className="preview-body">
              <div className="preview-section">
                <span className="preview-label">Name</span>
                <p className="preview-name">{profile.name || '—'}</p>
              </div>
              <div className="preview-section">
                <span className="preview-label">Job Title</span>
                <p className="preview-job">{profile.jobTitle || '—'}</p>
              </div>
              <div className="preview-section">
                <span className="preview-label">Bio</span>
                <div className="preview-bio">
                  {profile.bio ? profile.bio.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < profile.bio.split('\n').length - 1 && <br />}
                    </span>
                  )) : '—'}
                </div>
              </div>
            </div>
            <div className="preview-footer">
              <span>✨ realtime</span>
              <span>⚡ instant preview</span>
            </div>
          </div>
          <div className="preview-note">
            No submit needed for preview — powered by React state
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;