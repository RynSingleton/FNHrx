import React, { useState } from 'react';

function FileUpload({ onUpload, onSubmit }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div className="file-upload">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Uploaded Preview" className="preview" />}
      {preview && <button onClick={onSubmit}>Submit</button>}
    </div>
  );
}

export default FileUpload;
