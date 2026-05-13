import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'video/mp4'];

function App() {
  const [media, setMedia] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (media?.url) URL.revokeObjectURL(media.url);
    };
  }, [media]);

  function handleFile(file) {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload a PNG, JPG, JPEG, or MP4 file.');
      return;
    }

    const url = URL.createObjectURL(file);
    setMedia((previous) => {
      if (previous?.url) URL.revokeObjectURL(previous.url);
      return { url, type: file.type, name: file.name };
    });
    setError('');
  }

  return (
    <main className="app">
      {!media ? (
        <section className="upload-panel">
          <h1>Upload media</h1>
          <p>Choose a PNG/JPG image or MP4 video to render full screen.</p>
          <label className="upload-button">
            Select file
            <input
              type="file"
              accept="image/png,image/jpeg,video/mp4,.png,.jpg,.jpeg,.mp4"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
          </label>
          {error && <p className="error">{error}</p>}
        </section>
      ) : (
        <>
          {media.type.startsWith('image/') ? (
            <img className="fullscreen-media" src={media.url} alt={media.name} />
          ) : (
            <video className="fullscreen-media" src={media.url} controls autoPlay loop playsInline />
          )}
          <label className="replace-button">
            Replace
            <input
              type="file"
              accept="image/png,image/jpeg,video/mp4,.png,.jpg,.jpeg,.mp4"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
          </label>
          {error && <p className="floating-error">{error}</p>}
        </>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
