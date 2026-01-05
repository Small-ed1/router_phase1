import React, { useState, useEffect } from 'react';
import Skeleton, { SkeletonText, SkeletonCard } from './Skeleton';
import { cachedFetch } from './apiCache';

const ChatSessions = React.memo(({ onSessionSelect, currentSessionId }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    loadSessions();
  }, [showArchived]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await cachedFetch('/api/chats');
      setSessions(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to create session');
      }
      const data = await response.json();
      onSessionSelect && onSessionSelect(data.id);
      await loadSessions(); // Refresh the list
    } catch (err) {
      setError(`Failed to create session: ${err.message}`);
    }
  };

  const archiveSession = async (sessionId) => {
    if (!confirm(`Are you sure you want to archive this session?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/chats/${sessionId}/archive`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to archive session');
      }
      await loadSessions(); // Refresh the list
    } catch (err) {
      setError(`Failed to archive session: ${err.message}`);
    }
  };

  const deleteSession = async (sessionId) => {
    if (!confirm(`Are you sure you want to permanently delete this session? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/chats/${sessionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete session');
      }
      await loadSessions(); // Refresh the list
    } catch (err) {
      setError(`Failed to delete session: ${err.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getSessionPreview = (session) => {
    if (session.summary) {
      return session.summary;
    }
    if (session.messages && session.messages.length > 0) {
      const lastMessage = session.messages[session.messages.length - 1];
      return lastMessage.content ? lastMessage.content.substring(0, 100) + '...' : 'Empty message';
    }
    return 'New conversation';
  };

  const filteredSessions = sessions.filter(session =>
    showArchived || !session.archived
  );

  if (loading) {
    return (
      <div className="chat-sessions">
        <div className="sessions-header">
          <Skeleton width="150px" height="1.2rem" />
          <div className="header-actions">
            <Skeleton width="100px" height="2rem" />
            <Skeleton width="100px" height="2rem" />
          </div>
        </div>

        <div className="sessions-list">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="session-item">
              <div className="document-info">
                <div className="session-title-row">
                  <Skeleton width="80%" height="1rem" />
                  <div className="session-actions">
                    <Skeleton width="24px" height="24px" variant="circular" />
                    <Skeleton width="24px" height="24px" variant="circular" />
                  </div>
                </div>
                <SkeletonText lines={2} width="100%" />
                <div className="session-meta">
                  <Skeleton width="60px" height="0.8rem" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="chat-sessions">
      <div className="sessions-header">
        <h3>Chat Sessions</h3>
        <div className="header-actions">
          <label className="archive-toggle">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />
            Show archived
          </label>
          <button onClick={createNewSession} className="new-session-button">
            + New Chat
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="dismiss-error">×</button>
        </div>
      )}

      {filteredSessions.length === 0 ? (
        <div className="no-sessions">
          <p>{showArchived ? 'No archived sessions found.' : 'No chat sessions found.'}</p>
          <p>Start a new conversation to see it here.</p>
        </div>
      ) : (
        <div className="sessions-list">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className={`session-item ${session.id === currentSessionId ? 'active' : ''} ${session.archived ? 'archived' : ''}`}
              onClick={() => onSessionSelect && onSessionSelect(session.id)}
            >
              <div className="session-content">
                <div className="session-title-row">
                  <h4 className="session-title">
                    {session.title || 'Untitled Chat'}
                  </h4>
                  <div className="session-actions">
                    {!session.archived && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          archiveSession(session.id);
                        }}
                        className="archive-button"
                        title="Archive session"
                      >
                        📁
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="delete-button"
                      title="Delete session"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <p className="session-preview">
                  {getSessionPreview(session)}
                </p>

                <div className="session-meta">
                  <span className="session-date">
                    {formatDate(session.created_at)}
                  </span>
                  {session.archived && (
                    <span className="archived-badge">Archived</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .chat-sessions {
          background: var(--bg-primary);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px var(--shadow);
          margin: 20px 0;
        }

        .sessions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .sessions-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .archive-toggle {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .archive-toggle input[type="checkbox"] {
          margin: 0;
        }

        .new-session-button {
          padding: 8px 16px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .new-session-button:hover {
          background: #0056b3;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          color: #721c24;
          margin-bottom: 15px;
        }

        .dismiss-error {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #721c24;
        }

        .no-sessions {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .no-sessions p {
          margin: 10px 0;
        }

        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .session-item {
          border: 1px solid #e9ecef;
          border-radius: 6px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f8f9fa;
        }

        .session-item:hover {
          box-shadow: 0 2px 8px var(--shadow);
        }

        .session-item.selected {
          border-color: var(--accent);
        }

        .session-item.active {
          border-color: #007bff;
          background: #e7f3ff;
        }

        .session-item.archived {
          opacity: 0.7;
          border-style: dashed;
        }

        .session-content {
          width: 100%;
        }

        .session-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .session-title {
          margin: 0 0 8px 0;
          color: var(--text-primary);
        }

        .session-actions {
          display: flex;
          gap: 5px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .session-item:hover .session-actions {
          opacity: 1;
        }

        .archive-button,
        .delete-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 3px;
          font-size: 14px;
          transition: background-color 0.2s ease;
        }

        .archive-button:hover {
          background: #e9ecef;
        }

        .delete-button:hover {
          background: #f8d7da;
        }

        .session-preview {
          margin: 0 0 8px 0;
          color: #666;
          font-size: 14px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .session-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }

        .session-date {
          color: #999;
        }

        .archived-badge {
          background: #ffc107;
          color: #856404;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 500;
        }

        .loading {
          text-align: center;
          padding: 40px;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #f3f3f3;
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
          .sessions-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
            justify-content: space-between;
          }

          .session-title-row {
            flex-direction: column;
            gap: 10px;
          }

          .session-actions {
            opacity: 1;
            justify-content: flex-end;
          }

          .session-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
});

ChatSessions.displayName = 'ChatSessions';

export default ChatSessions;