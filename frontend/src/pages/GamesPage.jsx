import React, { useEffect, useState } from 'react';
import { useAuth } from '../services/AuthContext';
import { gamesAPI, userAPI } from '../services/api';
import GameCard from '../components/GameCard';

const GamesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [games, setGames] = useState([]);
  const [userLibraryIds, setUserLibraryIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    const loadGamesAndLibrary = async () => {
      try {
        setLoading(true);
        const gamesRes = await gamesAPI.getAll();
        setGames(gamesRes.data || []);

        if (isAuthenticated) {
          const libRes = await userAPI.getLibrary();
          const ids = (libRes.data || []).map((g) => g._id);
          setUserLibraryIds(ids);
        }
      } catch (err) {
        setError('Failed to load games catalog. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadGamesAndLibrary();
  }, [isAuthenticated]);

  const handleLibraryUpdated = (addedGameId) => {
    setUserLibraryIds((prev) => [...prev, addedGameId]);
  };

  // Extract unique genres for quick filter tabs
  const genres = ['All', ...new Set(games.map((g) => g.genre))];

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre = selectedGenre === 'All' || game.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="games-page">
      <div className="games-container">
        {/* Page Header */}
        <div className="games-header">
          <div className="games-header-text">
            <span className="section-tag">CATALOG</span>
            <h1 className="games-title">Explore Games</h1>
            <p className="games-subtitle">
              Browse our curated collection of fictional gaming masterpieces. Add them directly to your personal GameHub library.
            </p>
          </div>

          {/* Search bar */}
          <div className="search-filter-box">
            <input
              type="text"
              placeholder="Search by title, genre, keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="genre-pills-bar">
          {genres.map((genre) => (
            <button
              key={genre}
              className={`genre-pill ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Error message */}
        {error && <div className="alert-box alert-error">{error}</div>}

        {/* Loading state */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading GameHub catalog...</p>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-icon-wrap">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="empty-state-svg"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3>No games found</h3>
            <p>Try refining your search terms or genre filter.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('All');
              }}
              className="btn-secondary-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="games-grid">
            {filteredGames.map((game) => (
              <GameCard
                key={game._id}
                game={game}
                isInLibrary={userLibraryIds.includes(game._id)}
                onLibraryUpdated={handleLibraryUpdated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesPage;
