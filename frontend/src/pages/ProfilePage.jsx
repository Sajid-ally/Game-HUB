import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { userAPI } from '../services/api';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await userAPI.getProfile();
        setProfileData(res.data?.user || null);
        setOrders(res.data?.orders || []);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isPro = (profileData?.plan || user?.plan) === 'pro';

  const memberSinceFormatted = (profileData?.createdAt || user?.createdAt)
    ? new Date(profileData?.createdAt || user?.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'September 2026';

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <span className="section-tag">ACCOUNT SETTINGS</span>
          <h1 className="profile-title">Player Profile</h1>
          <p className="profile-subtitle">Manage your credentials, subscription level, and order history.</p>
        </div>

        <div className="profile-grid">
          {/* Main User Card */}
          <div className="profile-card">
            <div className="profile-avatar-row">
              <div className="profile-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="profile-main-info">
                <h2>{profileData?.name || user?.name}</h2>
                <p className="profile-email">{profileData?.email || user?.email}</p>
                <div className="profile-badge-row">
                  <span className={`plan-badge badge-${isPro ? 'pro' : 'free'}`}>
                    {isPro ? 'PRO MEMBER' : 'FREE TIER'}
                  </span>
                  <span className="account-verified-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Cloud Sync Active
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-meta-list">
              <div className="meta-item">
                <span className="meta-label">Full Name</span>
                <span className="meta-val">{profileData?.name || user?.name}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Email Address</span>
                <span className="meta-val">{profileData?.email || user?.email}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Current Plan</span>
                <span className="meta-val font-bold">
                  {isPro ? 'Pro Subscription (Unlimited Library)' : 'Free Starter (Up to 3 Games)'}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Library Titles</span>
                <span className="meta-val">
                  {profileData?.libraryCount ?? user?.library?.length ?? 0} Games
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Member Since</span>
                <span className="meta-val">{memberSinceFormatted}</span>
              </div>
            </div>

            <div className="profile-actions-bar">
              {!isPro ? (
                <Link to="/checkout" className="btn-accent-md">
                  Upgrade to Pro (₹299/mo)
                </Link>
              ) : (
                <div className="pro-active-notice">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  GameHub Pro active — unlimited access enabled
                </div>
              )}
              <button onClick={handleLogout} className="btn-logout">
                Sign Out
              </button>
            </div>
          </div>

          {/* Membership & Order History Card */}
          <div className="profile-orders-card">
            <h3 className="orders-title">SaaS Subscription & Billing History</h3>
            <p className="orders-subtitle">Record of demo subscription upgrades created on your account.</p>

            {orders.length === 0 ? (
              <div className="empty-orders-box">
                <div className="empty-sm-icon-wrap">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <h4>No billing records yet</h4>
                <p>
                  You are currently using the Free Tier. When you test the Demo Checkout, your order receipt will appear here.
                </p>
                {!isPro && (
                  <Link to="/checkout" className="btn-primary-sm">
                    Test Demo Upgrade
                  </Link>
                )}
              </div>
            ) : (
              <div className="orders-table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="font-bold">{order.plan.toUpperCase()}</td>
                        <td>₹{order.amount}</td>
                        <td>
                          <span className="badge-demo-table">{order.paymentMethod}</span>
                        </td>
                        <td>
                          <span className="badge-success-table">{order.status}</span>
                        </td>
                        <td className="order-date-cell">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
