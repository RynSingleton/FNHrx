import React from 'react';

const genres = [
  'Pop', 'Rock', 'Jazz', 'Hip-Hop', 'Classical', 
  'Electronic', 'R&B', 'Country', 'Reggae'
];

function GenreSelector({ onGenreSelect }) {
  return (
    <div className="genre-selector">
      <label>Genre: </label>
      <select onChange={(e) => onGenreSelect(e.target.value)}>
        <option value="">Select a genre</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>{genre}</option>
        ))}
      </select>
    </div>
  );
}

export default GenreSelector;
