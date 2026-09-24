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
            <span className="toast-icon">🎮</span>
            <span>{playNotification}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="library-header">
          <div>
            <span className="section-tag">MY VAULT</span>
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
                Upgrade for Unlimited →
              </Link>
            )}
          </div>
        </div>

        {/* Plan status alert */}
        {!isPro && libraryCount >= maxFreeGames && (
          <div className="quota-alert-banner">
            <span>⚠️ You have reached the 3-game maximum on the Free plan.</span>
            <Link to="/checkout" className="alert-link">Upgrade to Pro to unlock unlimited games →</Link>
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
            <div className="empty-icon">🎮</div>
            <h2>No Games in Your Library Yet</h2>
            <p>
              Your personal shelf is waiting. Browse our collection of games and add titles to get started.
            </p>
            <Link to="/games" className="btn-primary-md">
              Browse Available Games →
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
                    <span className="library-rating">★ {game.rating?.toFixed(1) || '4.5'}</span>
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
                      ▶ Play Game
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
