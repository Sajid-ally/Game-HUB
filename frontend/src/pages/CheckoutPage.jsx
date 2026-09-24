import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { paymentAPI } from '../services/api';

const CheckoutPage = () => {
  const { user, updateUserPlan, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [cardData, setCardData] = useState({
    name: user?.name || 'Alex Mercer',
    email: user?.email || 'alex@example.com',
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/28',
    cvv: '888'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value
    });
  };

  const handleDemoPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await paymentAPI.demoPayment({
        plan: 'pro',
        amount: 299
      });

      if (res.data?.success) {
        updateUserPlan('pro');
        await refreshUser();

        navigate('/dashboard', {
          state: {
            paymentSuccess: 'Congratulations! You are now a GameHub Pro member. Unlimited library access is now active.'
          }
        });
      } else {
        setError(res.data?.message || 'Payment simulation failed.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Payment simulation encountered an error. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Crucial Demo Banner as required */}
        <div className="demo-payment-alert">
          <div className="demo-alert-icon-svg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="demo-alert-text">
            <strong>Demo Checkout — No real payment will be processed.</strong>
            <p>This is a simulated sandbox flow for evaluation purposes. Dummy test values are pre-filled below.</p>
          </div>
        </div>

        <div className="checkout-grid">
          {/* Payment Form */}
          <div className="checkout-form-card">
            <h2 className="checkout-title">Complete Subscription</h2>
            <p className="checkout-subtitle">Enter payment details to confirm your Pro upgrade.</p>

            {error && <div className="alert-box alert-error">{error}</div>}

            <form onSubmit={handleDemoPayment} className="checkout-form">
              <div className="form-group">
                <label htmlFor="name">Cardholder Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={cardData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Receipt Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={cardData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">Card Number (Sandbox)</label>
                <div className="input-with-badge">
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleChange}
                    required
                    className="form-input"
                    maxLength="19"
                  />
                  <span className="input-inner-badge">DEMO VISA</span>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="expiry">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    id="expiry"
                    name="expiry"
                    value={cardData.expiry}
                    onChange={handleChange}
                    required
                    className="form-input"
                    maxLength="5"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleChange}
                    required
                    className="form-input"
                    maxLength="4"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-pay-demo"
              >
                {loading ? 'Processing Demo Payment...' : 'Pay ₹299 (Demo)'}
              </button>

              <div className="checkout-disclaimer">
                By clicking "Pay ₹299 (Demo)", an order record will be simulated in the backend and your account will immediately upgrade to the Pro plan.
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-summary-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-plan-box">
              <div>
                <span className="summary-badge">PRO PLAN</span>
                <h4 className="summary-plan-name">GameHub Pro Monthly</h4>
                <p className="summary-plan-desc">Unlimited cloud gaming library & exclusive features</p>
              </div>
              <div className="summary-plan-price">
                <span>₹299</span>
                <small>/month</small>
              </div>
            </div>

            <div className="summary-list">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹299.00</span>
              </div>
              <div className="summary-row">
                <span>Tax & Gateway Fee</span>
                <span className="text-free">₹0.00 (Demo)</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total-row">
                <span>Total Due Today</span>
                <span className="total-amount">₹299.00</span>
              </div>
            </div>

            <div className="summary-features-list">
              <h5>Included with GameHub Pro:</h5>
              <ul>
                <li>Unlimited personal game library</li>
                <li>Removal of 3-game restriction</li>
                <li>Distinctive Pro badge on profile & dashboard</li>
                <li>Instant simulation without real charges</li>
              </ul>
            </div>

            <div className="summary-back-link">
              <Link to="/pricing">Back to Pricing Plans</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
