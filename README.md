# FNHrx

FullNode Health utilizes machine learning to predict the onset of a seizure based on EEG data. Using a Convolutional Neural Network (CNN), the system processes the EEG data, outputs a probability of whether a seizure is imminent, and recommends a music genre to help reduce stress and calm the patient.

1. The model classifies the input EEG data into two categories: 1 (seizure) or 0 (no seizure).
2. If a seizure is predicted with high confidence, the system triggers the music recommendation.
3. Once the music genre is selected, it's fetched from Spotify in real-time and played for the patient, offering immediate relief.


npm install react spotify-web-api-js three @react-three/fiber

npm start
