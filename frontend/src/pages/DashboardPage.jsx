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
        {/* Success Banner (e.g. after demo payment) */}
        {successBanner && (
          <div className="alert-banner-success">
            <span className="banner-icon">🎉</span>
            <div>
              <strong>Payment Confirmed!</strong> {successBanner}
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
            <span className="toast-icon">🚀</span>
            <span>{playAlert}</span>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <span className="dashboard-pretitle">SaaS DASHBOARD OVERVIEW</span>
            <h1 className="dashboard-welcome">
              Welcome, <span className="text-gradient">{user?.name || 'Gamer'}</span>
            </h1>
            <p className="dashboard-subtext">
              Manage your collection, monitor subscription quota, and explore new gaming adventures.
            </p>
          </div>

          <div className="dashboard-header-actions">
            <Link to="/games" className="btn-primary-sm">
              + Add Games
            </Link>
            {!isPro && (
              <Link to="/checkout" className="btn-accent-sm">
                ★ Upgrade to Pro
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
              Upgrade to Pro (₹299) →
            </Link>
          </div>
        ) : (
          <div className="plan-pro-banner">
            <div className="pro-banner-content">
              <span className="pro-star-badge">★ PRO MEMBER ACTIVE</span>
              <h3>Unlimited Cloud Library Unlocked</h3>
              <p>Thank you for being a Pro subscriber. You have zero library restrictions and access to all platform features.</p>
            </div>
          </div>
        )}

        {/* Overview Stat Cards */}
        <div className="dashboard-stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Total Games</span>
              <span className="stat-card-icon">🎮</span>
            </div>
            <div className="stat-card-value">{totalCatalogCount}</div>
            <p className="stat-card-sub">Available in GameHub Catalog</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Library Games</span>
              <span className="stat-card-icon">📚</span>
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
              <span className="stat-card-icon">💎</span>
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
              <span className="stat-card-icon">🛡️</span>
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
              Go to Full Library ({libraryCount}) →
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Fetching your library games...</p>
            </div>
          ) : libraryGames.length === 0 ? (
            <div className="empty-state-box">
              <div className="empty-icon">🎮</div>
              <h3>Your personal library is empty</h3>
              <p>You haven't added any games yet. Browse our fictional catalog and claim your first title today.</p>
              <Link to="/games" className="btn-primary-md">
                Browse Games Catalog →
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
                      ▶ Play
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
