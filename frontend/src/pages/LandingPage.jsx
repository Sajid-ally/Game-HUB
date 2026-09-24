import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { gamesAPI } from '../services/api';
import GameCard from '../components/GameCard';

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await gamesAPI.getAll();
        // Take top 3 or 4 games for featured display
        setFeaturedGames(res.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching featured games:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const userLibraryIds = user?.library?.map((item) =>
    typeof item.game === 'object' ? item.game._id : item.game
  ) || [];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow-bg"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulsing-dot"></span> Next-Gen Cloud Gaming Platform
          </div>
          <h1 className="hero-title">
            Your Games. <br />
            <span className="text-gradient">Your Library.</span> <br />
            Your World.
          </h1>
          <p className="hero-subtitle">
            Experience the future of game management. Browse high-octane indie and sci-fi hits, build your personalized cloud library, and unlock unlimited gameplay with GameHub Pro.
          </p>

          <div className="hero-actions">
            <Link to="/games" className="btn-primary-lg">
              Explore Games 🎮
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-secondary-lg">
                Go to Dashboard →
              </Link>
            ) : (
              <Link to="/register" className="btn-secondary-lg">
                Get Started Free →
              </Link>
            )}
          </div>

          <div className="hero-metrics">
            <div className="metric-item">
              <span className="metric-number">8+</span>
              <span className="metric-label">Curated Titles</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-number">₹0</span>
              <span className="metric-label">Free Tier Starter</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-number">Instant</span>
              <span className="metric-label">Cloud Library Sync</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="featured-section">
        <div className="section-header">
          <div className="section-tag">SHOWCASE</div>
          <h2 className="section-title">Featured Titles</h2>
          <p className="section-desc">
            Hand-picked gaming experiences ready to add to your personal collection.
          </p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading featured games...</p>
          </div>
        ) : (
          <div className="games-grid">
            {featuredGames.map((game) => (
              <GameCard
                key={game._id}
                game={game}
                isInLibrary={userLibraryIds.includes(game._id)}
              />
            ))}
          </div>
        )}

        <div className="view-all-wrapper">
          <Link to="/games" className="btn-outline-lg">
            View All Games ({featuredGames.length > 0 ? '8 Available' : 'Browse'}) →
          </Link>
        </div>
      </section>

      {/* SaaS Feature Highlights */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-tag">WHY GAMEHUB</div>
          <h2 className="section-title">Engineered for Modern Gamers</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Universal Cloud Library</h3>
            <p className="feature-desc">
              Organize, track, and manage all your gaming titles in one centralized dashboard with instant access from any device.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3 className="feature-title">Fair SaaS Tiers</h3>
            <p className="feature-desc">
              Start with our Free tier supporting up to 3 games, or unlock the Pro plan at ₹299/mo with zero limitations.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3 className="feature-title">Instant Demo Payment</h3>
            <p className="feature-desc">
              Upgrade safely with our risk-free demo checkout flow. Test live SaaS subscription transitions without real transactions.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2>Ready to Build Your Gaming Arsenal?</h2>
          <p>Create your free account today and start adding games to your personal library.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-primary-lg">
              Create Free Account
            </Link>
            <Link to="/pricing" className="btn-secondary-lg">
              Compare Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
