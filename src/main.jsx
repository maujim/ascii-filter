import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/gif'];
const ASCII_CHARACTERS = " .:,'-^=*+?!|0#X%WM@";

function isAsciiCapable(type) {
  return type === 'image/png' || type === 'image/jpeg';
}

function AsciiImage({ src, alt }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    const image = new Image();
    image.src = src;
    image.alt = alt;

    let animationFrame = 0;

    function render() {
      const { innerWidth: viewportWidth, innerHeight: viewportHeight } = window;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = viewportWidth * dpr;
      canvas.height = viewportHeight * dpr;
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${viewportHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.fillStyle = 'black';
      context.fillRect(0, 0, viewportWidth, viewportHeight);

      const scale = Math.min(viewportWidth / image.width, viewportHeight / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      const drawX = (viewportWidth - drawWidth) / 2;
      const drawY = (viewportHeight - drawHeight) / 2;

      const cellSize = Math.max(8, Math.round(Math.min(viewportWidth, viewportHeight) / 90));
      const sampleWidth = Math.max(1, Math.floor(drawWidth / cellSize));
      const sampleHeight = Math.max(1, Math.floor(drawHeight / cellSize));

      const sampleCanvas = document.createElement('canvas');
      sampleCanvas.width = sampleWidth;
      sampleCanvas.height = sampleHeight;
      const sampleContext = sampleCanvas.getContext('2d', { willReadFrequently: true });
      sampleContext.drawImage(image, 0, 0, sampleWidth, sampleHeight);
      const pixels = sampleContext.getImageData(0, 0, sampleWidth, sampleHeight).data;

      context.font = `${cellSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      for (let y = 0; y < sampleHeight; y += 1) {
        for (let x = 0; x < sampleWidth; x += 1) {
          const index = (y * sampleWidth + x) * 4;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const alpha = pixels[index + 3] / 255;
          const grey = (red * 0.299 + green * 0.587 + blue * 0.114) / 255;
          const character = ASCII_CHARACTERS[Math.floor(grey * (ASCII_CHARACTERS.length - 1))];

          context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
          context.fillText(character, drawX + x * cellSize + cellSize / 2, drawY + y * cellSize + cellSize / 2);
        }
      }
    }

    function queueRender() {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(render);
    }

    image.onload = queueRender;
    window.addEventListener('resize', queueRender);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', queueRender);
    };
  }, [src, alt]);

  return <canvas ref={canvasRef} className="fullscreen-media ascii-canvas" aria-label={alt} />;
}

function App() {
  const [media, setMedia] = useState(null);
  const [error, setError] = useState('');
  const [asciiEnabled, setAsciiEnabled] = useState(true);

  useEffect(() => {
    return () => {
      if (media?.url) URL.revokeObjectURL(media.url);
    };
  }, [media]);

  function handleFile(file) {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload a PNG, JPG, JPEG, or GIF file.');
      return;
    }

    const url = URL.createObjectURL(file);
    setMedia((previous) => {
      if (previous?.url) URL.revokeObjectURL(previous.url);
      return { url, type: file.type, name: file.name };
    });
    setAsciiEnabled(isAsciiCapable(file.type));
    setError(file.type === 'image/gif' ? 'GIF support is experimental and renders without ASCII for now.' : '');
  }

  const canUseAscii = media && isAsciiCapable(media.type);

  return (
    <main className="app">
      {!media ? (
        <section className="upload-panel">
          <h1>Upload media</h1>
          <p>Choose a PNG/JPG image for ASCII, or a GIF to render normally. GIF support is experimental.</p>
          <label className="upload-button">
            Select file
            <input
              type="file"
              accept="image/png,image/jpeg,image/gif,.png,.jpg,.jpeg,.gif"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
          </label>
          {error && <p className="error">{error}</p>}
        </section>
      ) : (
        <>
          {canUseAscii && asciiEnabled ? (
            <AsciiImage src={media.url} alt={media.name} />
          ) : (
            <img className="fullscreen-media" src={media.url} alt={media.name} />
          )}
          <div className="media-actions">
            <label className="control-button">
              Replace
              <input
                type="file"
                accept="image/png,image/jpeg,image/gif,.png,.jpg,.jpeg,.gif"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />
            </label>
            {canUseAscii && (
              <button className="control-button" type="button" onClick={() => setAsciiEnabled((enabled) => !enabled)}>
                Toggle ASCII filter
              </button>
            )}
          </div>
          {error && <p className="floating-error">{error}</p>}
        </>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
