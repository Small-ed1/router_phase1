import React, { useState, useEffect } from 'react';
import { cachedFetch } from './apiCache';

const MainSidebar = React.memo(({
  isOpen,
  onToggle,
  activeMode,
  onModeChange,
  currentChatSessionId,
  onChatSessionSelect,
  selectedModel,
  onModelChange,
  onSettingsClick
}) => {
  const [sessions, setSessions] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
      loadModels();
    }
  }, [isOpen, showArchived]);

  const loadSessions = async () => {
    try {
      const data = await cachedFetch('/api/chats');
      setSessions(data || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const loadModels = async () => {
    try {
      const data = await cachedFetch('/api/models');
      setAvailableModels(data.items || []);
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await fetch('/api/chats', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        onChatSessionSelect(data.id);
        await loadSessions();
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const modes = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'research', label: 'Deep Research', icon: '🔬' },
    { id: 'qa', label: 'Documents', icon: '📚' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onToggle}
        />
      )}

      <div className={`main-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <h2>Router Phase 1</h2>
            <button
              className="sidebar-close"
              onClick={onToggle}
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="sidebar-content">
          {/* Model Selection */}
          <div className="sidebar-section">
            <h3>Current Model</h3>
            <select
              value={selectedModel || ''}
              onChange={(e) => onModelChange(e.target.value)}
              className="model-select"
            >
              <option value="">Select Model...</option>
              {availableModels.map(model => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Navigation */}
          <div className="sidebar-section">
            <h3>Modes</h3>
            <div className="mode-buttons">
              {modes.map(mode => (
                <button
                  key={mode.id}
                  className={`mode-button ${activeMode === mode.id ? 'active' : ''}`}
                  onClick={() => onModeChange(mode.id)}
                >
                  <span className="mode-icon">{mode.icon}</span>
                  <span className="mode-label">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Sessions */}
          <div className="sidebar-section">
            <div className="section-header">
              <h3>Chat Sessions</h3>
              <button
                className="new-session-btn"
                onClick={createNewSession}
                title="New Chat"
              >
                +
              </button>
            </div>

            <div className="archive-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                />
                Show archived
              </label>
            </div>

            <div className="sessions-list">
              {sessions
                .filter(session => showArchived || !session.archived)
                .map(session => (
                  <div
                    key={session.id}
                    className={`session-item ${currentChatSessionId === session.id ? 'active' : ''}`}
                    onClick={() => onChatSessionSelect(session.id)}
                  >
                    <div className="session-title">
                      {session.title || 'Untitled Chat'}
                    </div>
                    <div className="session-date">
                      {new Date(session.created_at).toLocaleDateString()}
                    </div>
                    {session.archived && (
                      <div className="session-archived">Archived</div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Settings */}
          <div className="sidebar-section">
            <button
              className="settings-button"
              onClick={onSettingsClick}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar-overlay {
            display: block;
          }
        }

        .main-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 320px;
          height: 100vh;
          background: var(--bg-primary);
          border-right: 1px solid var(--border-color);
          box-shadow: 2px 0 10px var(--shadow);
          z-index: 1000;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .main-sidebar.open {
          transform: translateX(0);
        }

        /* Extra small screens (< 480px) */
        @media (max-width: 480px) {
          .main-sidebar {
            width: min(100vw - 40px, 320px);
            max-width: calc(100vw - 20px);
          }
        }

        /* Small screens (481px - 768px) */
        @media (min-width: 481px) and (max-width: 768px) {
          .main-sidebar {
            width: min(90vw, 350px);
            max-width: calc(100vw - 40px);
          }
        }

        /* Medium screens (769px - 1024px) */
        @media (min-width: 769px) and (max-width: 1024px) {
          .main-sidebar {
            position: relative;
            transform: translateX(0);
            width: 320px;
          }

          .main-sidebar.closed {
            transform: translateX(-100%);
          }

          .sidebar-overlay {
            display: none !important;
          }
        }

        /* Large screens (1025px - 1440px) */
        @media (min-width: 1025px) and (max-width: 1440px) {
          .main-sidebar {
            position: relative;
            transform: translateX(0);
            width: 320px;
          }

          .main-sidebar.closed {
            transform: translateX(-100%);
          }

          .sidebar-overlay {
            display: none !important;
          }
        }

        /* Extra large screens (> 1440px) */
        @media (min-width: 1441px) {
          .main-sidebar {
            position: relative;
            transform: translateX(0);
            width: clamp(320px, 25vw, 400px);
          }

          .main-sidebar.closed {
            transform: translateX(-100%);
          }

          .sidebar-overlay {
            display: none !important;
          }
        }

        .sidebar-header {
          padding: clamp(15px, 3vw, 20px);
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .sidebar-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-title h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: clamp(16px, 2.5vw, 18px);
          font-weight: 600;
        }

        .sidebar-close {
          background: none;
          border: none;
          font-size: clamp(18px, 3vw, 20px);
          color: var(--text-secondary);
          cursor: pointer;
          padding: clamp(4px, 1vw, 6px);
          border-radius: 4px;
          transition: all 0.2s ease;
          width: clamp(32px, 5vw, 40px);
          height: clamp(32px, 5vw, 40px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-close:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        /* Hide close button on desktop */
        @media (min-width: 769px) {
          .sidebar-close {
            display: none;
          }
        }

        /* Extra small screens */
        @media (max-width: 480px) {
          .sidebar-header {
            padding: 12px;
          }

          .sidebar-title h2 {
            font-size: 16px;
          }

          .sidebar-content {
            padding: 12px;
            gap: 16px;
          }

          .mode-buttons {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }

          .mode-button {
            padding: 10px 8px;
            font-size: 12px;
          }

          .mode-icon {
            width: 20px;
          }
        }

        /* Small screens */
        @media (min-width: 481px) and (max-width: 768px) {
          .mode-buttons {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }

          .mode-button {
            padding: 12px 10px;
          }
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: clamp(15px, 3vw, 20px);
          display: flex;
          flex-direction: column;
          gap: clamp(16px, 4vw, 24px);
        }

        /* Extra small screens */
        @media (max-width: 480px) {
          .sidebar-content {
            padding: 12px;
            gap: 16px;
          }
        }

        .sidebar-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sidebar-section h3 {
          margin: 0;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .model-select {
          width: 100%;
          padding: 8px 12px;
          border: 2px solid var(--border-color);
          border-radius: 6px;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
        }

        .model-select:focus {
          outline: none;
          border-color: var(--accent);
        }

        .mode-buttons {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mode-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: none;
          border: none;
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .mode-button:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .mode-button.active {
          background: var(--accent);
          color: white;
        }

        .mode-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .new-session-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent);
          color: white;
          border: none;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .new-session-btn:hover {
          background: #0056b3;
          transform: scale(1.1);
        }

        .archive-toggle {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .archive-toggle input[type="checkbox"] {
          margin-right: 6px;
        }

        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 300px;
          overflow-y: auto;
        }

        .session-item {
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .session-item:hover {
          background: var(--bg-tertiary);
        }

        .session-item.active {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }

        .session-title {
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .session-date {
          font-size: 12px;
          opacity: 0.7;
        }

        .session-archived {
          font-size: 11px;
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 6px;
          border-radius: 10px;
          margin-top: 4px;
          display: inline-block;
        }

        .settings-button {
          width: 100%;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .settings-button:hover {
          background: var(--bg-secondary);
          border-color: var(--accent);
        }
      `}</style>
    </>
  );
});

MainSidebar.displayName = 'MainSidebar';

export default MainSidebar;