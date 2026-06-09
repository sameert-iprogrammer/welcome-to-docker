import React from "react";
import Sidebar from "./Sidebar";

const LoyaltyPoints = () => {
  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="loyalty-points-container">
        {/* Header */}
        <div className="loyalty-points-header">
          <span className="loyalty-points-eyebrow">LOYALTY PROGRAM</span>
          <h1 className="loyalty-points-title">Loyalty Rewards Program</h1>
          <p className="loyalty-points-desc">
            Earn points with every purchase and redeem them for exclusive
            rewards. Learn how it works below.
          </p>
        </div>

        {/* Step 1 */}
        <div className="loyalty-points-step">
          <div className="loyalty-points-thumbnail">
            <span className="loyalty-points-thumbnail-text">
              <i className="fa-solid fa-star"></i> YOU ARE HERE
            </span>
          </div>
          <div className="loyalty-points-step-row">
            <div className="loyalty-points-number">1</div>
            <p className="loyalty-points-step-desc">
              Sign up and create your account to start earning loyalty points
              automatically.
            </p>
          </div>
        </div>

        <div className="loyalty-points-divider" />

        {/* Step 2 */}
        <div className="loyalty-points-step">
          <div className="loyalty-points-thumbnail">
            <span className="loyalty-points-thumbnail-text">
              <i className="fa-solid fa-coins"></i> EARN POINTS
            </span>
          </div>
          <div className="loyalty-points-step-row">
            <div className="loyalty-points-number">2</div>
            <p className="loyalty-points-step-desc">
              Earn 10 points for every $1 spent on eligible purchases across all
              categories.
            </p>
          </div>
        </div>

        <div className="loyalty-points-divider" />

        {/* Step 3 */}
        <div className="loyalty-points-step">
          <div className="loyalty-points-thumbnail">
            <span className="loyalty-points-thumbnail-text">
              <i className="fa-solid fa-gift"></i> REDEEM REWARDS
            </span>
          </div>
          <div className="loyalty-points-step-row">
            <div className="loyalty-points-number">3</div>
            <p className="loyalty-points-step-desc">
              Redeem your points at checkout — 100 points = $1 discount on your
              order.
            </p>
          </div>
        </div>

        <div className="loyalty-points-divider" />

        {/* Step 4 (shorter, no thumbnail) */}
        <div className="loyalty-points-step">
          <div className="loyalty-points-step-row">
            <div className="loyalty-points-number">4</div>
            <p className="loyalty-points-step-desc">
              Refer a friend and earn 500 bonus points when they make their
              first purchase.
            </p>
          </div>
        </div>

        <div className="loyalty-points-divider" />

        {/* Step 5 (shorter, no thumbnail) */}
        <div className="loyalty-points-step">
          <div className="loyalty-points-step-row">
            <div className="loyalty-points-number">5</div>
            <p className="loyalty-points-step-desc">
              Points expire after 12 months. Check your balance anytime in your
              profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPoints;
