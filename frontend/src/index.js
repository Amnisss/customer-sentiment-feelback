import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="AIzaSyCnhRs7PENRsjCVhkm64z1ON-JEC065RdM">
    <BrowserRouter>
      {" "}
      {/* Wrap your App with BrowserRouter */}
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
