import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <span className="brand-icon">🎮</span>
              <span className="brand-name">Game<span className="brand-accent">Hub</span></span>
            </div>
            <p className="footer-desc">
              Next-generation gaming library SaaS platform. Discover indie and sci-fi hits, organize your collection, and unlock unlimited cloud access.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/games">Browse Games</Link></li>
              <li><Link to="/pricing">SaaS Pricing</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/library">Game Library</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Membership</h4>
            <ul>
              <li><Link to="/pricing">Free Tier (3 Games)</Link></li>
              <li><Link to="/checkout">GameHub Pro (₹299/mo)</Link></li>
              <li><span className="badge-demo-footer">Demo Payment System</span></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/profile">Profile Settings</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} GameHub SaaS. Built for technical evaluation. All rights reserved.</p>
          <p className="footer-disclaimer">Fictional gaming platform demo — no actual financial transactions are performed.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
