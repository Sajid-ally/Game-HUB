import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const WelcomePage = () => {
  const { user } = useAuth();

  const memberSinceFormatted = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    : 'September 2026';

  return (
    <div className="welcome-page animate-fade-in">
      <div className="welcome-glow-bg"></div>

      <div className="welcome-container">
        {/* Header Section */}
        <div className="welcome-header">
          <div className="welcome-badge">Welcome Onboard</div>
          <h1 className="welcome-title">
            Welcome to GameHub, <span className="text-gradient">{user?.name || 'Gamer'}</span>
          </h1>
          <p className="welcome-tagline">"Your gaming journey starts here."</p>
          <p className="welcome-subdesc">
            Discover games, build your personal library, and unlock more with GameHub Pro.
          </p>
        </div>

        {/* Three Feature Cards with Sleek SVGs */}
        <div className="welcome-cards-grid">
          <div className="welcome-feature-card">
            <div className="welcome-card-svg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3 className="welcome-card-title">Discover</h3>
            <p className="welcome-card-desc">
              Explore games and find something new to play.
            </p>
          </div>

          <div className="welcome-feature-card">
            <div className="welcome-card-svg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h3 className="welcome-card-title">Build Your Library</h3>
            <p className="welcome-card-desc">
              Save your favorite games in one place.
            </p>
          </div>

          <div className="welcome-feature-card pro-highlight">
            <div className="welcome-card-svg pro-svg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3 className="welcome-card-title">Go Pro</h3>
            <p className="welcome-card-desc">
              Unlock unlimited access and exclusive features.
            </p>
          </div>
        </div>

        {/* Small Profile / Status Section */}
        <div className="welcome-status-box">
          <div className="status-item">
            <span className="status-label">Account</span>
            <span className="status-value">{user?.name || 'Verified User'}</span>
          </div>
          <div className="status-divider"></div>
          <div className="status-item">
            <span className="status-label">Current Tier</span>
            <span className="status-badge-free">Free Plan (3 Games max)</span>
          </div>
          <div className="status-divider"></div>
          <div className="status-item">
            <span className="status-label">Member Since</span>
            <span className="status-value">{memberSinceFormatted}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="welcome-actions">
          <Link to="/games" className="btn-primary-lg">
            Explore Games
          </Link>
          <Link to="/dashboard" className="btn-secondary-lg">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
