import React, { useState, useEffect } from 'react';

const MultiAgentDashboard = React.memo(() => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (autoRefresh) {
      loadAgentStatus();
      const interval = setInterval(loadAgentStatus, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadAgentStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/agents/status');
      if (!response.ok) {
        throw new Error('Failed to load agent status');
      }
      const data = await response.json();
      setAgents(data.agents || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'working': return '#28a745';
      case 'idle': return '#6c757d';
      case 'error': return '#dc3545';
      case 'completed': return '#007bff';
      case 'terminated': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'overseer': return '👑';
      case 'researcher': return '🔍';
      case 'analyst': return '📊';
      case 'synthesizer': return '🧠';
      case 'validator': return '✅';
      default: return '🤖';
    }
  };

  const formatLastActive = (lastActive) => {
    if (!lastActive) return 'Never';
    const date = new Date(lastActive);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading && agents.length === 0) {
    return (
      <div className="multi-agent-dashboard loading">
        <div className="spinner"></div>
        <p>Loading agent status...</p>
      </div>
    );
  }

  return (
    <div className="multi-agent-dashboard">
      <div className="dashboard-header">
        <h3>Multi-Agent Dashboard</h3>
        <div className="dashboard-controls">
          <label className="auto-refresh">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh
          </label>
          <button onClick={loadAgentStatus} className="refresh-button">
            ↻ Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {agents.length === 0 ? (
        <div className="no-agents">
          <p>No active agents found.</p>
          <p>Start a research session to see agent activity.</p>
        </div>
      ) : (
        <div className="agents-grid">
          {agents.map((agent) => (
            <div key={agent.id} className="agent-card">
              <div className="agent-header">
                <div className="agent-icon">
                  {getRoleIcon(agent.role)}
                </div>
                <div className="agent-info">
                  <h4 className="agent-id">{agent.id}</h4>
                  <span className="agent-role">{agent.role}</span>
                </div>
                <div
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(agent.status) }}
                  title={`Status: ${agent.status}`}
                ></div>
              </div>

              <div className="agent-details">
                <div className="detail-row">
                  <span className="label">Model:</span>
                  <span className="value">{agent.model}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className="value status-text" style={{ color: getStatusColor(agent.status) }}>
                    {agent.status}
                  </span>
                </div>
                {agent.current_task && (
                  <div className="detail-row">
                    <span className="label">Task:</span>
                    <span className="value">{agent.current_task}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="label">Last Active:</span>
                  <span className="value">{formatLastActive(agent.last_active)}</span>
                </div>
              </div>

              {agent.performance_metrics && Object.keys(agent.performance_metrics).length > 0 && (
                <div className="performance-metrics">
                  <h5>Performance</h5>
                  <div className="metrics-grid">
                    {Object.entries(agent.performance_metrics).map(([key, value]) => (
                      <div key={key} className="metric">
                        <span className="metric-label">{key.replace(/_/g, ' ')}:</span>
                        <span className="metric-value">
                          {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .multi-agent-dashboard {
          background: var(--bg-primary);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px var(--shadow);
          margin: 20px 0;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .dashboard-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .dashboard-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .auto-refresh {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .auto-refresh input[type="checkbox"] {
          margin: 0;
        }

        .refresh-button {
          padding: 8px 16px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .refresh-button:hover {
          background: #0056b3;
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

        .no-agents {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }

        .no-agents p {
          margin: 10px 0;
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
        }

        .agent-card {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
          background: var(--bg-secondary);
          transition: box-shadow 0.2s ease;
        }

        .agent-card:hover {
          box-shadow: 0 4px 12px var(--shadow);
        }

        .agent-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .agent-icon {
          font-size: 24px;
        }

        .agent-info {
          flex: 1;
        }

        .agent-id {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .agent-role {
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: capitalize;
          background: var(--bg-tertiary);
          padding: 2px 6px;
          border-radius: 10px;
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .agent-details {
          margin-bottom: 12px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .label {
          font-weight: 500;
          color: var(--text-secondary);
        }

        .value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .status-text {
          text-transform: capitalize;
        }

        .performance-metrics {
          border-top: 1px solid var(--border-color);
          padding-top: 12px;
        }

        .performance-metrics h5 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: var(--text-primary);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }

        .metric-label {
          color: var(--text-secondary);
          text-transform: capitalize;
        }

        .metric-value {
          font-weight: 600;
          color: var(--accent);
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
          .agents-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .dashboard-controls {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
});

MultiAgentDashboard.displayName = 'MultiAgentDashboard';

export default MultiAgentDashboard;