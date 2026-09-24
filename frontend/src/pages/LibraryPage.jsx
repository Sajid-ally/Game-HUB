import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { userAPI } from '../services/api';

const LibraryPage = () => {
  const { user } = useAuth();
  const [libraryGames, setLibraryGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playNotification, setPlayNotification] = useState('');

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        setLoading(true);
        const res = await userAPI.getLibrary();
        setLibraryGames(res.data || []);
      } catch (err) {
        setError('Failed to fetch your library games.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  const handlePlayClick = (gameTitle) => {
    setPlayNotification(`Launching "${gameTitle}"... Game launch coming soon.`);
    setTimeout(() => {
      setPlayNotification('');
    }, 4500);
  };

  const isPro = user?.plan === 'pro';
  const libraryCount = libraryGames.length;
  const maxFreeGames = 3;

  return (
    <div className="library-page">
      <div className="library-container">
        {/* Play Notification Toast */}
        {playNotification && (
          <div className="toast-popup animate-bounce">
            <span className="toast-icon-svg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </span>
            <span>{playNotification}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="library-header">
          <div>
            <span className="section-tag">COLLECTION</span>
            <h1 className="library-title">Personal Game Library</h1>
            <p className="library-subtitle">
              Access your claimed titles and launch them straight from the GameHub cloud client.
            </p>
          </div>

          <div className="library-quota-box">
            <div className="quota-info">
              <span className="quota-label">Storage Quota</span>
              <span className="quota-number">
                {libraryCount} {isPro ? 'Games (Unlimited)' : `/ ${maxFreeGames} Max Free`}
              </span>
            </div>
            {!isPro && libraryCount >= maxFreeGames && (
              <Link to="/checkout" className="btn-accent-sm">
                Upgrade for Unlimited
              </Link>
            )}
          </div>
        </div>

        {/* Plan status alert */}
        {!isPro && libraryCount >= maxFreeGames && (
          <div className="quota-alert-banner">
            <span>You have reached the 3-game maximum on the Free plan.</span>
            <Link to="/checkout" className="alert-link">Upgrade to Pro to unlock unlimited games</Link>
          </div>
        )}

        {/* Loading and Error */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your personal library...</p>
          </div>
        ) : error ? (
          <div className="alert-box alert-error">{error}</div>
        ) : libraryGames.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-svg-wrap">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="2" y="6" width="20" height="12" rx="4" />
                <line x1="6" y1="12" x2="10" y2="12" />
                <line x1="8" y1="10" x2="8" y2="14" />
              </svg>
            </div>
            <h2>No Games in Your Library Yet</h2>
            <p>
              Your personal shelf is waiting. Browse our collection of games and add titles to get started.
            </p>
            <Link to="/games" className="btn-primary-md">
              Browse Available Games
            </Link>
          </div>
        ) : (
          <div className="library-grid">
            {libraryGames.map((game) => (
              <div key={game._id} className="library-card">
                <div className="library-card-media">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="library-card-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <span className="library-genre-tag">{game.genre}</span>
                </div>

                <div className="library-card-content">
                  <h3 className="library-game-title">{game.title}</h3>
                  <div className="library-game-meta">
                    <span className="library-rating">
                      <svg className="star-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      {game.rating?.toFixed(1) || '4.5'}
                    </span>
                    <span className="library-date">
                      Added {new Date(game.addedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="library-card-actions">
                    <button
                      onClick={() => handlePlayClick(game.title)}
                      className="btn-play-action"
                    >
                      Play Game
                    </button>
                    <Link to={`/games/${game._id}`} className="btn-details-ghost">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
