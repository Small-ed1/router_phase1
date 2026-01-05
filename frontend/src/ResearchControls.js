import React, { useState } from 'react';

const ResearchControls = React.memo(({ onStartResearch, onStopResearch, currentTask, isResearching }) => {
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState('standard');
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsStarting(true);
    try {
      await onStartResearch(topic.trim(), depth);
      setTopic('');
    } catch (error) {
      console.error('Failed to start research:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const handleStop = async () => {
    if (currentTask && onStopResearch) {
      try {
        await onStopResearch(currentTask);
      } catch (error) {
        console.error('Failed to stop research:', error);
      }
    }
  };

  return (
    <div className="research-controls">
      <div className="controls-header">
        <h3>Research Controls</h3>
        {currentTask && (
          <div className="current-session">
            <span className="session-label">Active Session:</span>
            <code className="session-id">{currentTask}</code>
          </div>
        )}
      </div>

      {!isResearching ? (
        <form onSubmit={handleStart} className="research-form">
          <div className="form-group">
            <label htmlFor="topic">Research Topic</label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your research topic..."
              required
              disabled={isStarting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="depth">Research Depth</label>
            <select
              id="depth"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              disabled={isStarting}
            >
              <option value="quick">Quick (Fast results, basic analysis)</option>
              <option value="standard">Standard (Balanced depth and speed)</option>
              <option value="deep">Deep (Comprehensive analysis, slower)</option>
            </select>
          </div>

          <button
            type="submit"
            className="start-button"
            disabled={!topic.trim() || isStarting}
          >
            {isStarting ? (
              <>
                <span className="spinner"></span>
                Starting Research...
              </>
            ) : (
              <>
                <span className="icon">🔍</span>
                Start Research
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="active-research">
          <div className="status-message">
            <span className="status-icon">⚡</span>
            <span>Research in progress...</span>
          </div>

          <button
            onClick={handleStop}
            className="stop-button"
          >
            <span className="icon">⏹️</span>
            Stop Research
          </button>
        </div>
      )}

      <style>{`
        .research-controls {
          background: var(--bg-primary);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px var(--shadow);
          margin: 20px 0;
        }

        .controls-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .controls-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .current-session {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .session-label {
          color: var(--text-secondary);
        }

        .session-id {
          background: var(--bg-tertiary);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          color: var(--accent);
        }

        .research-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-weight: 500;
          color: var(--text-primary);
          font-size: 14px;
        }

        .form-group input,
        .form-group select {
          padding: 10px 12px;
          border: 2px solid var(--border-color);
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.2s ease;
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
        }

        .form-group input:disabled,
        .form-group select:disabled {
          background: var(--bg-tertiary);
          cursor: not-allowed;
        }

        .start-button,
        .stop-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          align-self: flex-start;
        }

        .start-button {
          background: var(--accent);
          color: white;
        }

        .start-button:hover:not(:disabled) {
          background: #0056b3;
          transform: translateY(-1px);
        }

        .start-button:disabled {
          background: #6c757d;
          cursor: not-allowed;
          transform: none;
        }

        .stop-button {
          background: var(--error);
          color: white;
        }

        .stop-button:hover {
          background: #c82333;
          transform: translateY(-1px);
        }

        .active-research {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--bg-tertiary);
          border-radius: 8px;
        }

        .status-message {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 500;
          color: var(--accent);
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .controls-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .research-form {
            gap: 12px;
          }

          .start-button {
            align-self: stretch;
          }
        }
      `}</style>
    </div>
  );
});

ResearchControls.displayName = 'ResearchControls';

export default ResearchControls;