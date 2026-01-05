import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastErrorTime: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console (in production, you might want to send to error reporting service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    const now = Date.now();
    const timeSinceLastError = this.state.lastErrorTime ? now - this.state.lastErrorTime : Infinity;

    this.setState(prevState => ({
      error: error,
      errorInfo: errorInfo,
      retryCount: prevState.retryCount + 1,
      lastErrorTime: now,
      // Auto-retry if it's been more than 30 seconds since last error and under 3 retries
      hasError: !(timeSinceLastError > 30000 && prevState.retryCount < 3)
    }));

    // Auto-retry after a delay if conditions are met
    if (timeSinceLastError > 30000 && this.state.retryCount < 3) {
      setTimeout(() => {
        this.handleRetry();
      }, 2000);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      const { retryCount } = this.state;
      const canRetry = retryCount < 5;

      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#ffe6e6',
          color: '#d63031'
        }}>
          <h2>⚠️ Something went wrong</h2>
          <p>We're experiencing technical difficulties. Our system is designed to recover automatically.</p>

          {retryCount > 0 && (
            <p style={{ fontSize: '14px', margin: '10px 0' }}>
              Attempted recovery {retryCount} time{retryCount > 1 ? 's' : ''}.
              {retryCount >= 3 && " If this persists, please refresh the page."}
            </p>
          )}

          <div style={{ marginTop: '20px' }}>
            {canRetry && (
              <button
                onClick={this.handleRetry}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                🔄 Try Again
              </button>
            )}

            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#d63031',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              🔄 Refresh Page
            </button>

            <button
              onClick={() => {
                // Clear all caches and reload
                if ('caches' in window) {
                  caches.keys().then(names => {
                    names.forEach(name => caches.delete(name));
                  });
                }
                window.location.reload();
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#636e72',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🧹 Clear Cache & Reload
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '20px' }}>
              <summary>Error Details (Development Only)</summary>
              <pre style={{
                whiteSpace: 'pre-wrap',
                fontSize: '12px',
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRadius: '4px',
                marginTop: '10px',
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;