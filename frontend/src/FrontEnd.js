import React, { useState } from "react";
import { GoogleLogout } from "@react-oauth/google"; // If you want to allow users to log out

const FrontEnd = ({ user }) => {
  const [businessName, setBusinessName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [locationId, setLocationId] = useState("");

  const handleLogout = () => {
    // Handle logout logic here
    alert("You have logged out!");
  };

  const handleFormSubmit = () => {
    // Logic to handle form submission (send data to backend, etc.)
    console.log("Form submitted:", { businessName, accountId, locationId });
  };

  return (
    <div style={styles.formContainer}>
      <h2>Welcome, {user.name}</h2> {/* Displaying user's name */}
      <GoogleLogout onLogoutSuccess={handleLogout} />
      {/* Business Name */}
      <div style={{ position: "relative", marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Enter your business name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          style={styles.input}
        />
      </div>
      {/* Account ID */}
      <div style={{ position: "relative", marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Enter your account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          style={styles.input}
        />
      </div>
      {/* Location ID */}
      <div style={{ position: "relative", marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Enter your location ID"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          style={styles.input}
        />
      </div>
      <button onClick={handleFormSubmit} style={styles.button}>
        Submit
      </button>
    </div>
  );
};

// Styles for the components
const styles = {
  formContainer: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    marginBottom: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#4689BE",
    color: "white",
    border: "none",
    padding: "0.75rem 2rem",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
};

export default FrontEnd;
