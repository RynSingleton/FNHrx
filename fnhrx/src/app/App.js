import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import GenreSelector from './components/GenreSelector';
import MusicPlayer from './components/MusicPlayer';
import Visualizer from './components/Visualizer';
import './App.css';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(true);

  // Handle image upload
  const handleImageUpload = (image) => {
    setUploadedImage(image);
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  // Loading screen effect with 3-second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5-second loading screen

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <img
          src={require('./assets/squiggle.gif')}
          alt="Squiggly Animation"
          className="squiggly-animation"
        />
        <div className="loading-text">
          <p>fullnode health</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Left Section - Image Upload */}
      <div className="left-section">
        <h1>FullNode Health</h1>
        <h2>Seizure Detection and Music Player</h2>
        <FileUpload onUpload={handleImageUpload} onSubmit={handleSubmit} />
        {uploadedImage && isSubmitted && <p className="seizure-text">Seizure detected</p>}
        <GenreSelector onGenreSelect={setSelectedGenre} />
        {selectedGenre && <MusicPlayer genre={selectedGenre} />}
      </div>

      
    </div>
  );
}

export default App;
