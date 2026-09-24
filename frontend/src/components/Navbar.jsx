import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { useTheme } from '../services/ThemeContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const isPro = user?.plan === 'pro';

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo with Custom Illuminated Icon */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-logo-icon">
            <svg
              className="logo-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="6" width="20" height="12" rx="4" />
              <line x1="6" y1="12" x2="10" y2="12" />
              <line x1="8" y1="10" x2="8" y2="14" />
              <circle cx="15.5" cy="11.5" r="1" fill="currentColor" />
              <circle cx="17.5" cy="13.5" r="1" fill="currentColor" />
            </svg>
          </div>
          <span className="brand-text">
            GAME<span className="brand-highlight">HUB</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className={`navbar-nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
          <div className="nav-links">
            <NavLink
              to="/games"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              onClick={closeMenu}
            >
              <span className="nav-item-icon">🎮</span>
              <span>Browse Games</span>
            </NavLink>

            <NavLink
              to="/pricing"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              onClick={closeMenu}
            >
              <span className="nav-item-icon">⚡</span>
              <span>Pricing</span>
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink
                  to="/library"
                  className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                  onClick={closeMenu}
                >
                  <span className="nav-item-icon">📚</span>
                  <span>My Library</span>
                </NavLink>

                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                  onClick={closeMenu}
                >
                  <span className="nav-item-icon">📊</span>
                  <span>Dashboard</span>
                </NavLink>
              </>
            )}
          </div>

          {/* User Auth Actions & Theme Switcher */}
          <div className="nav-auth-actions">
            {/* Theme Toggle Button (Light/Bright Mode by default) */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={isDark ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Bright/Dark Mode"
            >
              {isDark ? (
                <span className="theme-toggle-content">☀️ Light</span>
              ) : (
                <span className="theme-toggle-content">🌙 Dark</span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="nav-profile-group">
                <Link to="/profile" className="nav-user-chip" onClick={closeMenu}>
                  <div className={`user-avatar-mini ${isPro ? 'avatar-pro' : ''}`}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="user-chip-meta">
                    <span className="user-chip-name">{user?.name}</span>
                    <span className={`plan-pill-mini ${isPro ? 'pill-pro' : 'pill-free'}`}>
                      {isPro ? '★ PRO' : 'FREE TIER'}
                    </span>
                  </div>
                </Link>

                {!isPro && (
                  <Link to="/checkout" className="btn-nav-upgrade" onClick={closeMenu}>
                    Go Pro (₹299)
                  </Link>
                )}

                <button onClick={handleLogout} className="btn-nav-logout" title="Sign Out">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="nav-guest-actions">
                <Link to="/login" className="btn-nav-login" onClick={closeMenu}>
                  Sign In
                </Link>
                <Link to="/register" className="btn-nav-join" onClick={closeMenu}>
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
