import React from "react";
import { useNavigate } from "react-router-dom";
import termsConditionsMock from "./termsConditionsMock";

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const { title, lastUpdated, sections } = termsConditionsMock;

  const handleBackToSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="login-container">
      <div className="privacy-card">
        <header className="privacy-header">
          <h1 className="privacy-title">{title}</h1>
          <p className="privacy-updated">Last updated: {lastUpdated}</p>
        </header>
        <div className="privacy-body">
          {sections.map((section) => (
            <section key={section.id} className="privacy-section">
              <h3>{section.heading}</h3>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
        <div className="register-link">
          <span
            className="register-link-action"
            onClick={handleBackToSignIn}
            role="button"
            tabIndex={0}
            aria-label="Back to Sign In"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleBackToSignIn();
              }
            }}
          >
            Back to Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
