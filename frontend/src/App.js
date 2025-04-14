import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import AnimatedBackground from "./AnimatedBackground"; // If you're using a separate component for this
import { useNavigate } from "react-router-dom"; // If you're using React Router for navigation

// Main App Component
function App() {
  const [showForm, setShowForm] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [accountId, setAccountId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [businessName, setBusinessName] = useState(""); // New state for business name
  const [showAccessTokenTooltip, setShowAccessTokenTooltip] = useState(false);
  const [showAccountTooltip, setShowAccountTooltip] = useState(false);
  const [showLocationTooltip, setShowLocationTooltip] = useState(false);

  const navigate = useNavigate(); // For navigation

  const handleLoginSuccess = (response) => {
    const token = response.credential;
    setAccessToken(token);
    console.log("Login Successful! Token:", token);
    // Once the login is successful, you can set any necessary state or make API calls here
  };

  const handleLoginFailure = (error) => {
    console.error("Login Failed:", error);
    alert("Google Login failed. Check console for details.");
  };

  const handleNavigate = () => {
    navigate("/metrics"); // Navigate to metrics page or any other page after form submission
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_OAUTH_CLIENT_ID">
      <div style={styles.pageContainer}>
        <AnimatedBackground />
        <div style={styles.contentWrapper}>
          <h1 style={styles.title}>
            Feel <span style={{ color: "#4689BE" }}>Back</span>
          </h1>
          <p style={styles.tagLine}>
            Analyze your Customer's <i>real</i> feedback.
          </p>

          <p style={styles.subtitle}>
            Harness the power of machine learning to analyze customer sentiment
            and gain valuable metrics from feedback. Make smarter, data-driven
            decisions by understanding your customers better.
          </p>

          {!showForm ? (
            <button onClick={() => setShowForm(true)} style={styles.button}>
              Explore Your Customer Insights
            </button>
          ) : (
            <div style={styles.formContainer}>
              {/* Google Sign-In Button */}
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginFailure}
                useOneTap
                style={styles.googleButton}
              />

              {/* BUSINESS NAME */}
              <div style={{ position: "relative", marginTop: "1rem" }}>
                <input
                  type="text"
                  placeholder="Enter your business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  style={styles.input}
                />
              </div>

              {/* ACCESS TOKEN */}
              <div style={{ position: "relative", marginTop: "1rem" }}>
                <input
                  type="text"
                  placeholder="Enter your access token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  style={styles.input}
                />
                <div
                  style={{ display: "inline-block" }}
                  onMouseEnter={() => setShowAccessTokenTooltip(true)}
                  onMouseLeave={() => setShowAccessTokenTooltip(false)}
                >
                  <span style={styles.tooltipIcon}>?</span>
                  {showAccessTokenTooltip && (
                    <div style={styles.tooltip}>
                      The <strong>OAuth 2.0 Access Token</strong> is a temporary
                      token generated after logging in with your Google account.
                      It authorizes access to your Business Profile data.
                      <br />
                      <br />
                      🔐 You must obtain it through a secure login flow.
                    </div>
                  )}
                </div>
              </div>

              {/* ACCOUNT ID */}
              <div style={{ position: "relative", marginTop: "1rem" }}>
                <input
                  type="text"
                  placeholder="Enter your account ID"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  style={styles.input}
                />
                <div
                  style={{ display: "inline-block" }}
                  onMouseEnter={() => setShowAccountTooltip(true)}
                  onMouseLeave={() => setShowAccountTooltip(false)}
                >
                  <span style={styles.tooltipIcon}>?</span>
                  {showAccountTooltip && (
                    <div style={styles.tooltip}>
                      Your <strong>Google Business Account ID</strong> typically
                      looks like: <code>accounts/1234567890</code>.
                      <br />
                      <br />
                      🧭 You can get it from the API using:{" "}
                      <code>GET /v4/accounts</code>
                    </div>
                  )}
                </div>
              </div>

              {/* LOCATION ID */}
              <div style={{ position: "relative", marginTop: "1rem" }}>
                <input
                  type="text"
                  placeholder="Enter your location ID"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  style={styles.input}
                />
                <div
                  style={{ display: "inline-block" }}
                  onMouseEnter={() => setShowLocationTooltip(true)}
                  onMouseLeave={() => setShowLocationTooltip(false)}
                >
                  <span style={styles.tooltipIcon}>?</span>
                  {showLocationTooltip && (
                    <div style={styles.tooltip}>
                      The <strong>Location ID</strong> identifies the specific
                      business listing (like a store or office).
                      <br />
                      <br />
                      📍 Use{" "}
                      <code>GET /v4/accounts/{"{accountId}"}/locations</code> to
                      find this.
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleNavigate}
                style={{ ...styles.button, marginTop: "1.5rem" }}
              >
                Enter
              </button>
            </div>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

// Styles (CSS in JS)
const styles = {
  pageContainer: {
    position: "relative",
    overflow: "hidden",
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
    fontFamily: "'Tahoma', sans-serif",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
    pointerEvents: "none",
  },
  circle: {
    position: "absolute",
    bottom: "-60px",
    width: "50px",
    height: "50px",
    backgroundColor: "#C2DCDB",
    borderRadius: "50%",
    opacity: 0.3,
  },
  contentWrapper: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    padding: "4rem 1rem",
  },
  title: {
    fontSize: "5rem",
    marginBottom: "0.5rem",
    color: "#008080",
    fontFamily: "'Baloo 2', sans-serif",
  },
  subtitle: {
    fontSize: "1.25rem",
    marginBottom: "2rem",
    color: "#333",
    width: "50%",
    margin: "2rem auto",
  },
  tagLine: {
    marginTop: "0rem",
  },
  button: {
    backgroundColor: "#4689BE",
    color: "white",
    border: "none",
    padding: "0.75rem 2rem",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    fontFamily: "'Tahoma', sans-serif",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    marginBottom: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  formContainer: {
    maxWidth: "400px",
    margin: "0 auto",
    marginTop: "2rem",
  },
  tooltipIcon: {
    position: "absolute",
    right: "10px",
    top: "10px",
    backgroundColor: "#ddd",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    textAlign: "center",
    lineHeight: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  tooltip: {
    position: "absolute",
    top: "40px",
    right: "0",
    backgroundColor: "#333",
    color: "#fff",
    padding: "0.75rem",
    borderRadius: "5px",
    fontSize: "0.85rem",
    width: "280px",
    textAlign: "left",
    zIndex: 10,
  },
  link: {
    color: "#80dfff",
    textDecoration: "underline",
  },
  googleButton: {
    backgroundColor: "#4285F4",
    color: "white",
    padding: "1rem 2rem",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    width: "100%",
  },
};

export default App;
