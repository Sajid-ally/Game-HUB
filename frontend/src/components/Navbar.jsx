import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
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

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">🎮</span>
          <span className="brand-name">Game<span className="brand-accent">Hub</span></span>
        </Link>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Navigation Links */}
        <nav className={`navbar-nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
          <div className="nav-links">
            <NavLink
              to="/games"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMenu}
            >
              Browse Games
            </NavLink>
            <NavLink
              to="/pricing"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMenu}
            >
              Pricing
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink
                  to="/library"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  onClick={closeMenu}
                >
                  My Library
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  onClick={closeMenu}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  onClick={closeMenu}
                >
                  Profile
                </NavLink>
              </>
            )}
          </div>

          {/* User Auth Actions */}
          <div className="nav-auth-actions">
            {isAuthenticated ? (
              <div className="nav-user-bar">
                <span className={`plan-badge badge-${user?.plan || 'free'}`}>
                  {user?.plan === 'pro' ? '★ PRO' : 'FREE'}
                </span>
                <span className="nav-username">{user?.name}</span>
                <button onClick={handleLogout} className="btn-outline-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div className="nav-guest-bar">
                <Link to="/login" className="btn-ghost" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary-sm" onClick={closeMenu}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
