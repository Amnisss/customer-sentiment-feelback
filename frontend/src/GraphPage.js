import React, { useState } from "react";
import axios from "axios";

const GraphPage = () => {
  const [graph, setGraph] = useState("");
  const [topics, setTopics] = useState({});
  const [reviews, setReviews] = useState([]);
  const [sentiments, setSentiments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    // Replace with relevant data for your backend (e.g., account ID, location ID)
    const data = {
      accountId: "your-account-id", // Replace with actual account ID
      locationId: "your-location-id", // Replace with actual location ID
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/run-ml",
        data
      );
      const { graph, topics, reviews, predictions } = response.data;

      setGraph(graph); // Set the graph (base64 image)
      setTopics(topics); // Set the topics
      setReviews(reviews); // Set the reviews
      setSentiments(predictions); // Set the sentiment predictions
    } catch (error) {
      setError("An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Graph and Topic Analysis</h1>

      {/* Loading Spinner */}
      {loading && <p>Loading...</p>}

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Button to trigger API call */}
      <button onClick={handleSubmit} disabled={loading}>
        Generate Graph and Topics
      </button>

      {/* Display the Graph (if it exists) */}
      {graph && (
        <div>
          <h2>Sentiment Distribution by Topic</h2>
          <img
            src={`data:image/png;base64,${graph}`}
            alt="Sentiment Distribution"
          />
        </div>
      )}

      {/* Display Topics */}
      {topics && Object.keys(topics).length > 0 && (
        <div>
          <h2>Topics</h2>
          {Object.entries(topics).map(([topic, words], index) => (
            <div key={index}>
              <h3>{topic}</h3>
              <ul>
                {words.map((word, idx) => (
                  <li key={idx}>{word}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Display Reviews and Sentiments */}
      {reviews.length > 0 && (
        <div>
          <h2>Reviews and Sentiments</h2>
          {reviews.map((review, index) => (
            <div key={index}>
              <p>
                <strong>Review {index + 1}:</strong> {review}
              </p>
              <p>
                <strong>Sentiment:</strong>{" "}
                {sentiments[index] === 1 ? "Positive" : "Negative"}
              </p>
              <p>
                <strong>Assigned Topic:</strong> {`Topic ${index}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GraphPage;
