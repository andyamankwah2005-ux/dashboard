import React from 'react';
import { useApp } from '../context/AppContext';

export default function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="toast-container" id="toastContainer">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast"
          style={toast.type === 'error' ? { borderLeftColor: '#e11d48' } : undefined}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={toast.type === 'error' ? '#e11d48' : '#10b981'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {toast.type === 'error' ? (
              <>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </>
            ) : (
              <>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </>
            )}
          </svg>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

