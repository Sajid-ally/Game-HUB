import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { gamesAPI, userAPI } from '../services/api';

const GameDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshUser } = useAuth();

  const [game, setGame] = useState(null);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await gamesAPI.getById(id);
        setGame(res.data);

        // Check if game is in user library
        if (isAuthenticated) {
          const libRes = await userAPI.getLibrary();
          const owned = (libRes.data || []).some((g) => g._id === id);
          setIsInLibrary(owned);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Game details could not be found.');
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id, isAuthenticated]);

  const handleAddToLibrary = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAdding(true);
    setActionError('');
    setActionSuccess('');

    try {
      await gamesAPI.addToLibrary(id);
      setIsInLibrary(true);
      setActionSuccess(`"${game.title}" was successfully added to your GameHub library!`);
      await refreshUser();
    } catch (err) {
      if (err.response?.data?.limitReached) {
        setActionError('Free plan limit (3 games) reached! Please upgrade to Pro for unlimited library capacity.');
      } else {
        setActionError(err.response?.data?.message || 'Failed to add game to library');
      }
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="game-details-loading">
        <div className="spinner"></div>
        <p>Loading game details...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="game-details-error">
        <div className="empty-state-box">
          <div className="empty-icon">⚠️</div>
          <h2>Game Not Found</h2>
          <p>{error || 'The requested game could not be retrieved from the catalog.'}</p>
          <Link to="/games" className="btn-primary-md">
            ← Back to Games Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="game-details-page">
      <div className="game-details-container">
        {/* Navigation Breadcrumb */}
        <div className="breadcrumb-bar">
          <Link to="/games" className="breadcrumb-link">← Back to Catalog</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{game.title}</span>
        </div>

        {/* Hero Details Grid */}
        <div className="details-hero-grid">
          {/* Cover Media */}
          <div className="details-media-box">
            <img
              src={game.image}
              alt={game.title}
              className="details-cover-img"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="details-media-overlay">
              <span className="details-genre-tag">{game.genre}</span>
            </div>
          </div>

          {/* Info & Purchase/Library Column */}
          <div className="details-info-box">
            <div className="details-meta-row">
              <span className="details-rating-badge">★ {game.rating?.toFixed(1) || '4.5'} / 5.0</span>
              <span className="details-availability">Verified Cloud Title</span>
            </div>

            <h1 className="details-title">{game.title}</h1>

            <div className="details-price-tag">
              <span className="price-curr">₹</span>
              <span className="price-val">{game.price}</span>
              <span className="price-note">Single license purchase value (Free with Pro membership)</span>
            </div>

            <p className="details-desc">{game.description}</p>

            {/* Features list */}
            <div className="game-spec-list">
              <div className="spec-item">
                <span className="spec-label">Genre:</span>
                <span className="spec-val">{game.genre}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Cloud Sync:</span>
                <span className="spec-val">Enabled</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Platform:</span>
                <span className="spec-val">GameHub SaaS Web Client</span>
              </div>
            </div>

            {/* Action Feedback */}
            {actionSuccess && (
              <div className="alert-box alert-success">
                ✓ {actionSuccess}
                <div style={{ marginTop: '0.5rem' }}>
                  <Link to="/library" className="alert-link">Open My Library →</Link>
                </div>
              </div>
            )}

            {actionError && (
              <div className="alert-box alert-error">
                {actionError}
                {actionError.includes('upgrade') || actionError.includes('Upgrade') ? (
                  <div style={{ marginTop: '0.5rem' }}>
                    <Link to="/checkout" className="alert-link">Upgrade to Pro (₹299) →</Link>
                  </div>
                ) : null}
              </div>
            )}

            {/* Action Buttons */}
            <div className="details-actions-bar">
              {isInLibrary ? (
                <div className="in-library-status-box">
                  <span className="badge-owned-lg">✓ Already in Your Library</span>
                  <Link to="/library" className="btn-secondary-md">
                    Open in Library →
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleAddToLibrary}
                  disabled={adding}
                  className="btn-primary-lg"
                >
                  {adding ? 'Adding to Library...' : '+ Add to Personal Library'}
                </button>
              )}
            </div>

            {/* Plan Info Hint */}
            <div className="details-hint-box">
              <p>
                💡 <strong>Free Plan:</strong> Store up to 3 games in your library.
                <br />
                ⭐ <strong>Pro Plan:</strong> Unlimited games for just ₹299/mo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPage;
