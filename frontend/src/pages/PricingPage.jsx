import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const PricingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const isPro = user?.plan === 'pro';

  const handleProSelect = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="pricing-page">
      <div className="pricing-container">
        {/* Header Section */}
        <div className="pricing-header">
          <span className="section-tag">MEMBERSHIP TIERS</span>
          <h1 className="pricing-title">Simple, Transparent Gaming Plans</h1>
          <p className="pricing-subtitle">
            Choose the gaming experience that matches your ambitions. Start completely free or unlock the full power of GameHub Pro.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pricing-cards-grid">
          {/* FREE PLAN */}
          <div className={`pricing-card ${!isPro && isAuthenticated ? 'active-tier' : ''}`}>
            {!isPro && isAuthenticated && (
              <div className="tier-current-tag">CURRENT PLAN</div>
            )}
            <div className="pricing-card-header">
              <h3 className="plan-name">Free Starter</h3>
              <p className="plan-tagline">Ideal for casual gamers wanting to test the platform.</p>
              <div className="plan-price-wrap">
                <span className="plan-currency">₹</span>
                <span className="plan-amount">0</span>
                <span className="plan-period">/month</span>
              </div>
            </div>

            <div className="pricing-features">
              <div className="feature-row included">
                <svg className="check-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Browse entire fictional catalog</span>
              </div>
              <div className="feature-row included">
                <svg className="check-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Basic personal cloud library</span>
              </div>
              <div className="feature-row included">
                <svg className="check-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><strong>3 games maximum</strong> in library</span>
              </div>
              <div className="feature-row included">
                <svg className="check-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Standard dashboard analytics</span>
              </div>
              <div className="feature-row excluded">
                <svg className="cross-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                <span>Unlimited game storage</span>
              </div>
              <div className="feature-row excluded">
                <svg className="cross-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                <span>Exclusive Pro profile badge</span>
              </div>
            </div>

            <div className="pricing-cta-wrap">
              {isAuthenticated ? (
                isPro ? (
                  <button className="btn-tier-disabled" disabled>
                    Included in Pro
                  </button>
                ) : (
                  <button className="btn-tier-active" disabled>
                    Your Current Plan
                  </button>
                )
              ) : (
                <Link to="/register" className="btn-tier-default">
                  Get Started Free
                </Link>
              )}
            </div>
          </div>

          {/* PRO PLAN */}
          <div className={`pricing-card featured-pro-card ${isPro ? 'active-tier' : ''}`}>
            <div className="pro-popular-badge">RECOMMENDED</div>
            {isPro && <div className="tier-current-tag">ACTIVE SUBSCRIBER</div>}

            <div className="pricing-card-header">
              <h3 className="plan-name pro-name">GameHub Pro</h3>
              <p className="plan-tagline">Complete freedom and zero limitations for true gamers.</p>
              <div className="plan-price-wrap">
                <span className="plan-currency">₹</span>
                <span className="plan-amount">299</span>
                <span className="plan-period">/month</span>
              </div>
            </div>

            <div className="pricing-features">
              <div className="feature-row included pro-feature">
                <svg className="check-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><strong>Unlimited library</strong> capacity</span>
              </div>
              <div className="feature-row included pro-feature">
                <svg className="check-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Access to exclusive releases</span>
              </div>
              <div className="feature-row included pro-feature">
                <svg className="check-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Advanced dashboard & order metrics</span>
              </div>
              <div className="feature-row included pro-feature">
                <svg className="check-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Distinguished Pro badge</span>
              </div>
              <div className="feature-row included pro-feature">
                <svg className="check-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Priority game launch queue</span>
              </div>
              <div className="feature-row included pro-feature">
                <svg className="check-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Simulated Demo Payment flow</span>
              </div>
            </div>

            <div className="pricing-cta-wrap">
              {isPro ? (
                <button className="btn-tier-active" disabled>
                  Active Pro Subscriber
                </button>
              ) : (
                <button onClick={handleProSelect} className="btn-upgrade-pro">
                  Upgrade to Pro (₹299/mo)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Demo Payment Notice Banner with SVG icon */}
        <div className="pricing-notice-box">
          <div className="notice-icon-svg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div>
            <h4>Evaluation Safe — Demo Payment Architecture</h4>
            <p>
              All payments on GameHub utilize a mock transactional workflow. You can test upgrading to Pro using our sandbox checkout with pre-populated dummy credentials — no actual credit card charges will occur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
