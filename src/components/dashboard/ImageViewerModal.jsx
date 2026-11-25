import React from 'react';

export default function ImageViewerModal({ src, title, onClose }) {
  if (!src) return null;

  return (
    <div className="modal-overlay open" id="imageViewerModal" onClick={onClose}>
      <div className="image-viewer-card" onClick={(e) => e.stopPropagation()}>
        <div className="image-viewer-header">
          <span id="imageViewerTitle" style={{ fontWeight: 700, color: '#ffffff' }}>
            {title || 'Trade Chart Screenshot'}
          </span>
          <button
            className="modal-close-btn"
            id="closeImageViewerBtn"
            style={{ color: '#ffffff' }}
            onClick={onClose}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <img src={src} id="imageViewerSrc" alt="Fullscreen Screenshot" className="image-viewer-img" />
      </div>
    </div>
  );
}

