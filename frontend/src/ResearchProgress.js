import React, { useState, useEffect } from 'react';

const ResearchProgress = ({ taskId, onComplete, onError }) => {
  const [progress, setProgress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!taskId) return;

    const eventSource = new EventSource(`/api/research/${taskId}/progress`);

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.error) {
          setError(data.error);
          onError && onError(data.error);
          return;
        }

        if (data.type === 'heartbeat') {
          // Keep connection alive
          return;
        }

        setProgress(data);

        if (data.status === 'completed') {
          onComplete && onComplete(data);
          eventSource.close();
        }
      } catch (err) {
        console.error('Error parsing progress data:', err);
        setError('Failed to parse progress data');
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource error:', err);
      setIsConnected(false);
      setError('Connection lost');
      onError && onError('Connection lost');
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [taskId, onComplete, onError]);

  if (!progress) {
    return (
      <div className="research-progress loading">
        <div className="progress-spinner"></div>
        <p>Connecting to research session...</p>
      </div>
    );
  }

  const progressPercent = Math.round(progress.progress || 0);

  return (
    <div className="research-progress">
      <div className="progress-header">
        <h3>Research Progress</h3>
        <div className={`status-indicator ${progress.status}`}>
          <span className={`status-dot ${progress.status}`}></span>
          {progress.status === 'running' ? 'Running' :
           progress.status === 'completed' ? 'Completed' : 'Error'}
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <span className="progress-text">{progressPercent}%</span>
      </div>

      <div className="progress-details">
        <div className="detail-row">
          <span className="label">Phase:</span>
          <span className="value">{progress.phase || 'Initializing'}</span>
        </div>
        <div className="detail-row">
          <span className="label">Topics:</span>
          <span className="value">
            {progress.topics_completed || 0} / {progress.total_topics || 0}
          </span>
        </div>
        <div className="detail-row">
          <span className="label">Findings:</span>
          <span className="value">{progress.findings_count || 0}</span>
        </div>
        {progress.start_time && (
          <div className="detail-row">
            <span className="label">Started:</span>
            <span className="value">
              {new Date(progress.start_time).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="progress-error">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
        </div>
      )}

      <style>{`
        .research-progress {
          background: var(--bg-primary);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px var(--shadow);
          margin: 20px 0;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .progress-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-dot.running {
          background: var(--accent);
          animation: pulse 2s infinite;
        }

        .status-dot.completed {
          background: var(--success);
        }

        .status-dot.error {
          background: var(--error);
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .progress-bar-container {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .progress-bar {
          flex: 1;
          height: 20px;
          background: var(--bg-tertiary);
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), #0056b3);
          transition: width 0.3s ease;
        }

        .progress-text {
          font-weight: 600;
          color: var(--accent);
          min-width: 45px;
        }

        .progress-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 20px;
          margin-bottom: 15px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .label {
          font-weight: 500;
          color: var(--text-secondary);
        }

        .value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .progress-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid var(--error);
          border-radius: 4px;
          color: var(--error);
        }

        .loading {
          text-align: center;
          padding: 40px;
        }

        .progress-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--bg-tertiary);
          border-top: 4px solid var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .progress-details {
            grid-template-columns: 1fr;
          }

          .progress-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default ResearchProgress;