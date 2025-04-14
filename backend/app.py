import numpy as np
import pandas as pd
import string
import requests
import io
import base64
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import TFBertForSequenceClassification, BertTokenizer
import tensorflow as tf
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import TfidfVectorizer
import nltk

# NLTK stopwords download
nltk.download('stopwords')
from nltk.corpus import stopwords

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Preprocessing function: remove punctuation, lowercase the text
translator = str.maketrans('', '', string.punctuation)  # Remove punctuation
stop_words = set(stopwords.words('english'))

def preprocess_text(text):
    # Lowercase the text and remove punctuation
    text = text.lower()
    text = text.translate(translator)
    words = text.split()  # Split text into words
    words = [word for word in words if word not in stop_words]
    return " ".join(words)

# Load model and tokenizer once at startup
model_path = "/Users/Amruta/Downloads/bert_model"
my_model = TFBertForSequenceClassification.from_pretrained(model_path)
tokenizer = BertTokenizer.from_pretrained(model_path)

@app.route('/api/run-ml', methods=['POST'])
def run_ml():
    data = request.get_json()
    access_token = data.get('accessToken')
    account_id = data.get('accountId')
    location_id = data.get('locationId')

    try:
        # Step 1: Call the Google Business Profile API to get reviews
        url = f'https://mybusiness.googleapis.com/v4/accounts/{account_id}/locations/{location_id}/reviews'
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            return jsonify({'error': f'Google API Error: {response.status_code}', 'details': response.text}), 500

        reviews_json = response.json()
        reviews = reviews_json.get('reviews', [])

        if not reviews:
            return jsonify({'error': 'No reviews found.'}), 404

        # Normalize JSON to DataFrame
        df = pd.json_normalize(reviews)

        # Step 2: Extract comments
        if 'comment' not in df.columns:
            return jsonify({'error': 'Required field "comment" not found in data.'}), 400

        texts = df['comment'].tolist()

        # Step 3: Preprocess and tokenize texts
        cleaned_texts = [preprocess_text(text) for text in texts]

        # Step 4: TF-IDF Vectorization
        vectorizer = TfidfVectorizer(max_features=1000)
        X = vectorizer.fit_transform(cleaned_texts)

        # Step 5: Run LDA for topic modeling
        n_topics = 5  # Number of topics to identify
        lda = LatentDirichletAllocation(n_components=n_topics, random_state=42)
        lda.fit(X)

        # Assign dominant topic to each review
        topic_assignments = lda.transform(X)
        dominant_topics = np.argmax(topic_assignments, axis=1)

        # Add the dominant topic to the DataFrame
        df['dominant_topic'] = dominant_topics

        # Step 6: BERT Model for Sentiment Classification
        inputs = tokenizer(cleaned_texts, return_tensors="tf", padding=True, truncation=True)
        outputs = my_model(**inputs)
        probs = tf.nn.softmax(outputs.logits, axis=1)
        predicted_classes = tf.argmax(probs, axis=1).numpy().tolist()

        # Separate reviews by sentiment
        df['sentiment'] = predicted_classes  # Assuming 0 for negative, 1 for positive
        df_positive = df[df['sentiment'] == 1]
        df_negative = df[df['sentiment'] == 0]

        # Count the number of reviews for each topic and sentiment
        positive_counts = df_positive['dominant_topic'].value_counts().reindex(range(n_topics), fill_value=0)
        negative_counts = df_negative['dominant_topic'].value_counts().reindex(range(n_topics), fill_value=0)

        # Create the plot
        fig, ax = plt.subplots(figsize=(10, 6))

        # Plot positive counts
        ax.bar(positive_counts.index - 0.2, positive_counts.values, width=0.4, label='Positive', color='#008080')

        # Plot negative counts
        ax.bar(negative_counts.index + 0.2, negative_counts.values, width=0.4, label='Negative', color='#4881A7')

        # Title and labels
        ax.set_title("Sentiment Distribution by Topic")
        ax.set_xlabel("Topic")
        ax.set_ylabel("Number of Reviews")
        ax.set_xticks(range(n_topics))  # Ensure all topics are shown on the x-axis
        ax.set_xticklabels(range(n_topics))
        ax.legend()

        # Save plot to a buffer
        img_buf = io.BytesIO()
        plt.savefig(img_buf, format='png')
        img_buf.seek(0)
        img_base64 = base64.b64encode(img_buf.read()).decode('utf-8')

        # Step 7: Extract and return the list of topics and associated words
        num_words = 5  # Number of words to display for each topic
        topics = {}
        for idx, topic in enumerate(lda.components_):
            words = [vectorizer.get_feature_names_out()[i] for i in topic.argsort()[:-num_words - 1:-1]]
            topics[f"Topic {idx}"] = words

        # Send the topics, sentiment predictions, reviews, and graph as a base64 string to the frontend
        return jsonify({
            'reviews': texts,
            'predictions': predicted_classes,  # Sentiment labels (positive/negative)
            'dominant_topics': df['dominant_topic'].tolist(),  # Topics assigned to reviews
            'topics': topics,  # List of topics with associated words
            'graph': img_base64  # Graph as a base64 string
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
