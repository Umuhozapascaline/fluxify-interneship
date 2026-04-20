// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

// ----------------------------------------------
// 1. Card Component (reusable with colored header)
// ----------------------------------------------
const Card = ({ title, description, buttonLabel, headerColorClass }) => {
  return (
    <div className="card">
      {/* Colored header - using consistent primary color shades */}
      <div className={`card-header ${headerColorClass}`}>
        <h3 className="card-title">{title}</h3>
      </div>
      {/* Text body */}
      <div className="card-body">
        <p className="card-description">{description}</p>
      </div>
      {/* Button with hover effect & primary color */}
      <div className="card-footer">
        <button className="card-button">{buttonLabel}</button>
      </div>
    </div>
  );
};

// ----------------------------------------------
// 2. Main App Component
// ----------------------------------------------
const App = () => {
  // Theme state: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference, default light
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Apply theme to document root (html element) via 'dark' class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle theme handler
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Sample data for 6 cards to showcase 3-column grid -> 1 column responsive
  const cardsData = [
    {
      id: 1,
      title: "Strategic Insights",
      description: "Unlock data-driven strategies to accelerate growth. Our analytics help you make confident decisions in real-time.",
      buttonLabel: "Explore",
      headerShade: "bg-primary-600"
    },
    {
      id: 2,
      title: "Creative Studio",
      description: "Design-led solutions that captivate your audience. From branding to interactive experiences, we bring ideas to life.",
      buttonLabel: "Learn More",
      headerShade: "bg-primary-700"
    },
    {
      id: 3,
      title: "Cloud Infrastructure",
      description: "Scalable, secure, and reliable cloud solutions tailored for modern enterprises. Deploy with confidence.",
      buttonLabel: "Get Started",
      headerShade: "bg-primary-500"
    },
    {
      id: 4,
      title: "AI Integration",
      description: "Leverage artificial intelligence to automate workflows and gain predictive insights. Future-proof your business.",
      buttonLabel: "Discover",
      headerShade: "bg-primary-600"
    },
    {
      id: 5,
      title: "Support & Success",
      description: "24/7 dedicated support with proactive monitoring. Your success is our priority, always.",
      buttonLabel: "Contact Support",
      headerShade: "bg-primary-700"
    },
    {
      id: 6,
      title: "Developer Tools",
      description: "Powerful APIs and SDKs to build custom solutions. Enjoy seamless integration and rich documentation.",
      buttonLabel: "View Docs",
      headerShade: "bg-primary-500"
    }
  ];

  // Sidebar navigation items
  const navItems = [
    { name: "Dashboard", icon: "🏠", active: true },
    { name: "Analytics", icon: "📊" },
    { name: "Projects", icon: "📁" },
    { name: "Team", icon: "👥" },
    { name: "Settings", icon: "⚙️" },
    { name: "Reports", icon: "📈" },
  ];

  return (
    <div className="app">
      {/* --- Fixed Sidebar (hidden on mobile, fixed left panel on desktop) --- */}
      <aside className="sidebar">
        {/* Sidebar Header with brand */}
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">F</div>
            <span className="brand-text">Flex<span className="brand-accent">Board</span></span>
          </div>
        </div>
        
        {/* Sidebar Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href="#"
              className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
            </a>
          ))}
        </nav>
        
        {/* Sidebar footer - user info */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">JD</div>
            <div className="user-details">
              <p className="user-name">Jordan Diaz</p>
              <p className="user-email">jordan@flexboard.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area (with left margin on desktop due to fixed sidebar) --- */}
      <main className="main-content">
        {/* Top Bar: Dark Mode Toggle + Mobile header */}
        <div className="top-bar">
          <div className="top-bar-left">
            {/* Visible on mobile only - small brand hint */}
            <div className="mobile-brand">
              <div className="mobile-brand-icon">F</div>
              <span className="mobile-brand-text">FlexBoard</span>
            </div>
            <h1 className="page-title">Content Dashboard</h1>
          </div>
          
          {/* Dark mode toggle button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? (
              <svg className="theme-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="theme-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </div>

        {/* 3-column card grid that collapses to 1 column on small screens */}
        <div className="cards-container">
          <div className="cards-grid">
            {cardsData.map((card) => (
              <Card
                key={card.id}
                title={card.title}
                description={card.description}
                buttonLabel={card.buttonLabel}
                headerColorClass={card.headerShade}
              />
            ))}
          </div>
          
          {/* Footer note */}
          <div className="footer-note">
            <p>✨ Fully responsive — 3 columns on desktop, 1 on mobile. Sidebar hidden on small screens.</p>
            <p className="footer-subnote">Consistent primary color: #3b82f6 across buttons, hover, active states & sidebar highlights.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;