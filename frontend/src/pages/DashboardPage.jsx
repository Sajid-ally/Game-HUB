import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { userAPI, gamesAPI } from '../services/api';

const DashboardPage = () => {
  const { user, refreshUser } = useAuth();
  const location = useLocation();

  const [libraryGames, setLibraryGames] = useState([]);
  const [totalCatalogCount, setTotalCatalogCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [playAlert, setPlayAlert] = useState('');
  const [successBanner, setSuccessBanner] = useState(location.state?.paymentSuccess || '');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [libRes, gamesRes] = await Promise.all([
          userAPI.getLibrary(),
          gamesAPI.getAll()
        ]);
        setLibraryGames(libRes.data || []);
        setTotalCatalogCount(gamesRes.data?.length || 8);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    refreshUser();
  }, []);

  const handlePlayGame = (title) => {
    setPlayAlert(`Launch initialising for "${title}"... Game launch coming soon.`);
    setTimeout(() => {
      setPlayAlert('');
    }, 4000);
  };

  const isPro = user?.plan === 'pro';
  const libraryCount = libraryGames.length;
  const maxFreeGames = 3;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Success Banner */}
        {successBanner && (
          <div className="alert-banner-success">
            <span className="banner-icon-svg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <div>
              <strong>Payment Confirmed</strong> — {successBanner}
            </div>
            <button
              onClick={() => setSuccessBanner('')}
              className="banner-close-btn"
            >
              ×
            </button>
          </div>
        )}

        {/* Temporary Play Action Toast */}
        {playAlert && (
          <div className="toast-popup animate-bounce">
            <span className="toast-icon-svg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </span>
            <span>{playAlert}</span>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <span className="dashboard-pretitle">DASHBOARD OVERVIEW</span>
            <h1 className="dashboard-welcome">
              Welcome, <span className="text-gradient">{user?.name || 'Gamer'}</span>
            </h1>
            <p className="dashboard-subtext">
              Manage your collection, monitor subscription quota, and explore new gaming adventures.
            </p>
          </div>

          <div className="dashboard-header-actions">
            <Link to="/games" className="btn-primary-sm">
              Add Games
            </Link>
            {!isPro && (
              <Link to="/checkout" className="btn-accent-sm">
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>

        {/* Plan Upgrade Notice for Free Tier */}
        {!isPro ? (
          <div className="plan-upgrade-banner">
            <div className="upgrade-content">
              <h3>Free Plan Status: {libraryCount} / {maxFreeGames} Games Claimed</h3>
              <p>
                You are currently on the Free Starter tier. Upgrade to <strong>GameHub Pro (₹299/mo)</strong> to unlock an unlimited library, priority game access, and an exclusive Pro badge.
              </p>
            </div>
            <Link to="/checkout" className="btn-upgrade-now">
              Upgrade to Pro (₹299)
            </Link>
          </div>
        ) : (
          <div className="plan-pro-banner">
            <div className="pro-banner-content">
              <span className="pro-star-badge">PRO MEMBER ACTIVE</span>
              <h3>Unlimited Cloud Library Unlocked</h3>
              <p>Thank you for being a Pro subscriber. You have zero library restrictions and access to all platform features.</p>
            </div>
          </div>
        )}

        {/* Overview Stat Cards with Sleek SVGs */}
        <div className="dashboard-stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Total Games</span>
              <span className="stat-card-svg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="6" width="20" height="12" rx="4" />
                  <line x1="6" y1="12" x2="10" y2="12" />
                  <line x1="8" y1="10" x2="8" y2="14" />
                </svg>
              </span>
            </div>
            <div className="stat-card-value">{totalCatalogCount}</div>
            <p className="stat-card-sub">Available in GameHub Catalog</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Library Games</span>
              <span className="stat-card-svg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </span>
            </div>
            <div className="stat-card-value">
              {libraryCount}
              {!isPro && <span className="stat-limit"> / {maxFreeGames}</span>}
            </div>
            <p className="stat-card-sub">
              {isPro ? 'Unlimited Capacity' : `${maxFreeGames - libraryCount} free slots remaining`}
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Current Plan</span>
              <span className="stat-card-svg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
            </div>
            <div className="stat-card-value">
              <span className={`plan-pill ${isPro ? 'pill-pro' : 'pill-free'}`}>
                {isPro ? 'PRO (₹299/mo)' : 'FREE (₹0)'}
              </span>
            </div>
            <p className="stat-card-sub">
              {isPro ? 'Active Pro Subscription' : 'Upgrade anytime via Demo Checkout'}
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Account Status</span>
              <span className="stat-card-svg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
            </div>
            <div className="stat-card-value text-success">Active</div>
            <p className="stat-card-sub">Verified Cloud Member</p>
          </div>
        </div>

        {/* Recently Added Games Section */}
        <div className="dashboard-recent-section">
          <div className="section-header-row">
            <div>
              <h2 className="section-title-sm">Recently Added Games</h2>
              <p className="section-subtitle-sm">Your latest additions to your private vault</p>
            </div>
            <Link to="/library" className="link-view-all">
              Go to Full Library ({libraryCount})
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Fetching your library games...</p>
            </div>
          ) : libraryGames.length === 0 ? (
            <div className="empty-state-box">
              <div className="empty-svg-wrap">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <rect x="2" y="6" width="20" height="12" rx="4" />
                  <line x1="6" y1="12" x2="10" y2="12" />
                  <line x1="8" y1="10" x2="8" y2="14" />
                  <circle cx="15.5" cy="11.5" r="1" fill="currentColor" />
                  <circle cx="17.5" cy="13.5" r="1" fill="currentColor" />
                </svg>
              </div>
              <h3>Your personal library is empty</h3>
              <p>You haven't added any games yet. Browse our catalog and claim your first title today.</p>
              <Link to="/games" className="btn-primary-md">
                Browse Games Catalog
              </Link>
            </div>
          ) : (
            <div className="recent-games-grid">
              {libraryGames.slice(0, 4).map((game) => (
                <div key={game._id} className="recent-game-card">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="recent-game-thumb"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="recent-game-info">
                    <h4>{game.title}</h4>
                    <span className="recent-game-genre">{game.genre}</span>
                    <span className="recent-game-date">
                      Added {new Date(game.addedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="recent-game-actions">
                    <button
                      onClick={() => handlePlayGame(game.title)}
                      className="btn-play-sm"
                    >
                      Play
                    </button>
                    <Link to={`/games/${game._id}`} className="btn-details-ghost">
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
