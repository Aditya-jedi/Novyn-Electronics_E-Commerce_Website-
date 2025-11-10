import React from 'react';
import { toast } from '../utils/toast';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(/* error */) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log and notify
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error', error, errorInfo);
    try {
      toast.error('An unexpected error occurred. Reload the page.');
    } catch (e) {
      void e;
    }
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const errorText = (this.state.error && this.state.error.toString()) || 'Unknown error';
      const stack = this.state.errorInfo?.componentStack || '';
      return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#fee', color: '#900', padding: 12, zIndex: 9999 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>Something went wrong. Please reload the page.</div>
              <div style={{ marginTop: 8, fontSize: 13, color: '#600' }}>{errorText}</div>
              <details style={{ marginTop: 8 }}>
                <summary style={{ cursor: 'pointer' }}>Show error details</summary>
                <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 300, overflow: 'auto' }}>{stack}</pre>
              </details>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={() => navigator.clipboard?.writeText(`${errorText}\n\n${stack}`)}>
                Copy error
              </button>
              <button onClick={() => window.location.reload()}>Reload</button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;