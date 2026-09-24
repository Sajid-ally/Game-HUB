import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { gamesAPI } from '../services/api';

const GameCard = ({ game, isInLibrary, onLibraryUpdated }) => {
  const { isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddToLibrary = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await gamesAPI.addToLibrary(game._id);
      setSuccessMsg('Added to library');
      await refreshUser();
      if (onLibraryUpdated) {
        onLibraryUpdated(game._id);
      }
    } catch (err) {
      if (err.response?.data?.limitReached) {
        setErrorMsg('Free limit (3 games) reached! Upgrade to Pro for unlimited library.');
      } else {
        setErrorMsg(err.response?.data?.message || 'Failed to add game to library');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-card">
      <div className="game-card-media">
        <img
          src={game.image}
          alt={game.title}
          className="game-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="game-card-genre-badge">{game.genre}</div>
        <div className="game-card-rating">
          <svg className="star-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>{game.rating?.toFixed(1) || '4.5'}</span>
        </div>
      </div>

      <div className="game-card-body">
        <h3 className="game-card-title">{game.title}</h3>
        <p className="game-card-desc">{game.description}</p>

        <div className="game-card-footer">
          <div className="game-card-price">
            <span className="price-symbol">₹</span>
            <span className="price-amount">{game.price}</span>
          </div>

          <div className="game-card-actions">
            <Link to={`/games/${game._id}`} className="btn-secondary-sm">
              Details
            </Link>

            {isInLibrary ? (
              <span className="badge-owned">
                In Library
              </span>
            ) : (
              <button
                onClick={handleAddToLibrary}
                disabled={loading}
                className="btn-primary-sm"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="card-alert-error">
            <span>{errorMsg}</span>
            {errorMsg.includes('Upgrade') && (
              <Link to="/pricing" className="alert-link">Upgrade Plan</Link>
            )}
          </div>
        )}

        {successMsg && (
          <div className="card-alert-success">{successMsg}</div>
        )}
      </div>
    </div>
  );
};

export default GameCard;
