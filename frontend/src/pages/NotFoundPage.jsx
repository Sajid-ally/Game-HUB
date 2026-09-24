import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="empty-state-box">
        <div className="empty-icon">404</div>
        <h2>Page Not Found</h2>
        <p>The gaming coordinate you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn-primary-md">
          Return to GameHub Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
