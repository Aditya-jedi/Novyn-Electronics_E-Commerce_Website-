// A lightweight toast shim to avoid dependency issues with react-toastify in dev
// Exports: ToastContainer (React component) and toast object with success/error/info
import React from 'react';

function ensureContainer() {
  let container = document.getElementById('app-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'app-toast-container';
    Object.assign(container.style, {
      position: 'fixed',
      top: '12px',
      right: '12px',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxWidth: '320px',
    });
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message, bg = '#333') {
  try {
    const container = ensureContainer();
    const el = document.createElement('div');
    el.textContent = message;
    Object.assign(el.style, {
      background: bg,
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      fontSize: '14px',
      lineHeight: '1.2',
    });
    container.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity 300ms, transform 300ms';
      el.style.opacity = '0';
      el.style.transform = 'translateX(20px)';
      setTimeout(() => el.remove(), 350);
    }, 3000);
  } catch (err) {
    // fallback to console if DOM operations fail
    // eslint-disable-next-line no-console
    console.log('Toast:', message, err && err.message ? err.message : '');
  }
}

export const toast = {
  success: (msg) => showToast(msg, '#198754'),
  error: (msg) => showToast(msg, '#dc3545'),
  info: (msg) => showToast(msg, '#0d6efd'),
  warn: (msg) => showToast(msg, '#ffc107'),
};

export function ToastContainer() {
  // This component intentionally renders nothing — the shim mounts to document.body.
  return null;
}

export default ToastContainer;