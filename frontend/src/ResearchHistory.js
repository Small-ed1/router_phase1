import React, { useState, useEffect } from 'react';

const ResearchHistory = ({ onResumeSession, onDeleteSession }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/research/sessions');
      if (!response.ok) {
        throw new Error('Failed to load sessions');
      }
      const data = await response.json();
      setSessions(data.sessions || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async (taskId) => {
    try {
      const response = await fetch(`/api/research/${taskId}/resume`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to resume session');
      }
      const data = await response.json();
      onResumeSession && onResumeSession(taskId);
      // Reload sessions to update status
      await loadSessions();
    } catch (err) {
      setError(`Failed to resume session: ${err.message}`);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm(`Are you sure you want to delete research session ${taskId}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/research/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete session');
      }
      onDeleteSession && onDeleteSession(taskId);
      // Reload sessions
      await loadSessions();
    } catch (err) {
      setError(`Failed to delete session: ${err.message}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="research-history loading">
        <div className="spinner"></div>
        <p>Loading research history...</p>
      </div>
    );
  }

  return (
    <div className="research-history">
      <div className="history-header">
        <h3>Research History</h3>
        <button onClick={loadSessions} className="refresh-button">
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="dismiss-error">×</button>
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="no-sessions">
          <p>No saved research sessions found.</p>
          <p>Completed research will appear here for resuming later.</p>
        </div>
      ) : (
        <div className="sessions-list">
          {sessions.map((session) => (
            <div key={session.task_id} className="session-item">
              <div className="session-info">
                <div className="session-header">
                  <h4>Research Session</h4>
                  <span className={`status-badge ${session.status}`}>
                    {session.status}
                  </span>
                </div>
                <div className="session-details">
                  <div className="detail">
                    <span className="label">ID:</span>
                    <code className="value">{session.task_id}</code>
                  </div>
                  <div className="detail">
                    <span className="label">Started:</span>
                    <span className="value">
                      {session.start_time ? formatDate(session.start_time) : 'Unknown'}
                    </span>
                  </div>
                  <div className="detail">
                    <span className="label">Last Updated:</span>
                    <span className="value">
                      {session.last_update ? formatDate(session.last_update) : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="session-actions">
                {session.status === 'running' && (
                  <button
                    onClick={() => handleResume(session.task_id)}
                    className="resume-button"
                  >
                    ▶️ Resume
                  </button>
                )}
                <button
                  onClick={() => handleDelete(session.task_id)}
                  className="delete-button"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .research-history {
          background: var(--bg-primary);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px var(--shadow);
          margin: 20px 0;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .history-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .refresh-button {
          padding: 8px 16px;
          background: var(--text-secondary);
          color: var(--bg-primary);
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .refresh-button:hover {
          background: var(--text-muted);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid var(--error);
          border-radius: 4px;
          color: var(--error);
          margin-bottom: 15px;
        }

        .dismiss-error {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: var(--error);
        }

        .no-sessions {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }

        .no-sessions p {
          margin: 10px 0;
        }

        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .session-item {
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 15px;
          background: var(--bg-primary);
        }

        .session-info {
          flex: 1;
          min-width: 200px;
        }

        .session-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .session-header h4 {
          margin: 0;
          color: var(--text-primary);
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-badge.running {
          background: rgba(40, 167, 69, 0.2);
          color: var(--success);
        }

        .status-badge.stopped {
          background: rgba(255, 193, 7, 0.2);
          color: var(--warning);
        }

        .session-details {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .detail {
          display: flex;
          gap: 8px;
          font-size: 14px;
        }

        .label {
          font-weight: 500;
          color: var(--text-secondary);
          min-width: 70px;
        }

        .value {
          color: var(--text-primary);
        }

        .value code {
          background: var(--bg-tertiary);
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
          font-size: 12px;
        }

        .session-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .resume-button,
        .delete-button {
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .resume-button {
          background: var(--success);
          color: white;
        }

        .resume-button:hover {
          background: #218838;
        }

        .delete-button {
          background: var(--error);
          color: white;
        }

        .delete-button:hover {
          background: #c82333;
        }

        .loading {
          text-align: center;
          padding: 40px;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid var(--bg-tertiary);
          border-top: 3px solid var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .session-item {
            flex-direction: column;
          }

          .session-actions {
            align-self: stretch;
            justify-content: space-between;
          }

          .history-header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default ResearchHistory;