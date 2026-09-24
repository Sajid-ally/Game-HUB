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
                    {isPro ? '★ PRO MEMBER' : 'FREE TIER'}
                  </span>
                  <span className="account-verified-tag">✓ Cloud Sync Active</span>
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
                  ★ Upgrade to Pro (₹299/mo)
                </Link>
              ) : (
                <div className="pro-active-notice">
                  ⭐ You enjoy all GameHub Pro benefits!
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
                <div className="empty-sm-icon">📄</div>
                <h4>No billing records yet</h4>
                <p>
                  You are currently using the Free Tier. When you test the Demo Checkout, your order receipt will appear here.
                </p>
                {!isPro && (
                  <Link to="/checkout" className="btn-primary-sm">
                    Test Demo Upgrade →
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
