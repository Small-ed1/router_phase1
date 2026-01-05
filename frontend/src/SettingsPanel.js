import React, { useState, useEffect } from 'react';
import Skeleton, { SkeletonText, SkeletonCard } from './Skeleton';

const SettingsPanel = React.memo(({ onSettingsChange }) => {
  const [settings, setSettings] = useState({});
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
    loadModels();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const loadModels = async () => {
    try {
      const response = await fetch('/api/models');
      if (response.ok) {
        const data = await response.json();
        setAvailableModels(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load models:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-panel">
        <div className="panel-header">
          <Skeleton width="150px" height="1.5rem" />
          <Skeleton width="120px" height="2.5rem" className="skeleton-button" />
        </div>

        <div className="settings-sections">
          {/* Model Settings Skeleton */}
          <div className="settings-section">
            <Skeleton width="200px" height="1.2rem" className="skeleton-section-title" />
            <div className="setting-group">
              <Skeleton width="120px" height="1rem" />
              <Skeleton width="100%" height="2.5rem" />
            </div>
            <div className="setting-group">
              <Skeleton width="100px" height="1rem" />
              <Skeleton width="150px" height="2.5rem" />
            </div>
          </div>

          {/* UI Settings Skeleton */}
          <div className="settings-section">
            <Skeleton width="150px" height="1.2rem" className="skeleton-section-title" />
            <div className="setting-group">
              <Skeleton width="80px" height="1rem" />
              <Skeleton width="120px" height="2.5rem" />
            </div>
            <div className="setting-group checkbox">
              <Skeleton width="150px" height="1rem" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-panel">
      <div className="panel-header">
        <h3>Settings</h3>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="save-button"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          <span>Settings saved successfully!</span>
        </div>
      )}

      <div className="settings-sections">
        {/* Model Settings */}
        <div className="settings-section">
          <h4>Model Configuration</h4>
          <div className="setting-group">
            <label htmlFor="defaultModel">Default Model</label>
            <select
              id="defaultModel"
              value={settings.defaultModel || ''}
              onChange={(e) => handleSettingChange('defaultModel', e.target.value)}
            >
              <option value="">Auto-select</option>
              {availableModels.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          <div className="setting-group">
            <label htmlFor="temperature">Temperature</label>
            <div className="slider-group">
              <input
                type="range"
                id="temperature"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature || 0.7}
                onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
              />
              <span className="slider-value">{settings.temperature || 0.7}</span>
            </div>
            <small>Controls randomness: 0 = deterministic, 2 = very random</small>
          </div>

          <div className="setting-group">
            <label htmlFor="contextTokens">Context Window (tokens)</label>
            <input
              type="number"
              id="contextTokens"
              min="1000"
              max="32768"
              value={settings.contextTokens || 8000}
              onChange={(e) => handleSettingChange('contextTokens', parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* UI Settings */}
        <div className="settings-section">
          <h4>Interface</h4>
          <div className="setting-group">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              value={settings.theme || 'dark'}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="setting-group">
            <label htmlFor="fontSize">Font Size</label>
            <select
              id="fontSize"
              value={settings.fontSize || 'medium'}
              onChange={(e) => handleSettingChange('fontSize', e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="setting-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.animations !== false}
                onChange={(e) => handleSettingChange('animations', e.target.checked)}
              />
              Enable animations
            </label>
          </div>

           <div className="setting-group checkbox">
             <label>
               <input
                 type="checkbox"
                 checked={settings.showArchived || false}
                 onChange={(e) => handleSettingChange('showArchived', e.target.checked)}
               />
               Show archived chats
             </label>
           </div>

           <div className="setting-group">
             <label htmlFor="homeModelPreference">Home Page Model</label>
             <select
               id="homeModelPreference"
               value={settings.homeModelPreference || 'recommended'}
               onChange={(e) => handleSettingChange('homeModelPreference', e.target.value)}
             >
               <option value="recommended">Recommended Model</option>
               <option value="default">Default Model</option>
             </select>
             <small>Choose which model to show on the home page chat bar</small>
           </div>
        </div>

        {/* Research Settings */}
        <div className="settings-section">
          <h4>Research</h4>
          <div className="setting-group">
            <label htmlFor="researchDepth">Default Research Depth</label>
            <select
              id="researchDepth"
              value={settings.researchDepth || 'standard'}
              onChange={(e) => handleSettingChange('researchDepth', e.target.value)}
            >
              <option value="quick">Quick (Fast results, basic analysis)</option>
              <option value="standard">Standard (Balanced depth and speed)</option>
              <option value="deep">Deep (Comprehensive analysis, slower)</option>
            </select>
          </div>

          <div className="setting-group">
            <label htmlFor="maxToolCalls">Max Tool Calls per Session</label>
            <input
              type="number"
              id="maxToolCalls"
              min="1"
              max="50"
              value={settings.maxToolCalls || 10}
              onChange={(e) => handleSettingChange('maxToolCalls', parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="settings-section">
          <h4>Advanced</h4>
          <div className="setting-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.enableStreaming !== false}
                onChange={(e) => handleSettingChange('enableStreaming', e.target.checked)}
              />
              Enable streaming responses
            </label>
          </div>

          <div className="setting-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.autoModelSwitch || false}
                onChange={(e) => handleSettingChange('autoModelSwitch', e.target.checked)}
              />
              Auto-switch models based on task
            </label>
          </div>

          <div className="setting-group">
            <label htmlFor="citationFormat">Citation Format</label>
            <select
              id="citationFormat"
              value={settings.citationFormat || 'inline'}
              onChange={(e) => handleSettingChange('citationFormat', e.target.value)}
            >
              <option value="inline">Inline citations</option>
              <option value="footnotes">Footnotes</option>
              <option value="endnotes">Endnotes</option>
            </select>
          </div>

          <div className="setting-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.debugMode || false}
                onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
              />
              Enable debug mode
            </label>
          </div>

          <div className="setting-group">
            <label htmlFor="memoryLimit">Memory Limit (GB)</label>
            <input
              type="number"
              id="memoryLimit"
              min="1"
              max="32"
              value={settings.memoryLimit || 10}
              onChange={(e) => handleSettingChange('memoryLimit', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <style>{`
        .settings-panel {
          background: var(--bg-primary);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px var(--shadow);
          max-width: 800px;
          margin: 20px auto;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border-color);
        }

        .panel-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .save-button {
          padding: 10px 20px;
          background: var(--success);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .save-button:hover:not(:disabled) {
          background: #218838;
        }

        .save-button:disabled {
          background: var(--text-secondary);
          cursor: not-allowed;
        }

        .error-message,
        .success-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }

        .error-message {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid var(--error);
          color: var(--text-primary);
        }

        .success-message {
          background: rgba(40, 167, 69, 0.1);
          border: 1px solid var(--success);
          color: var(--text-primary);
        }

        .settings-sections {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .settings-section h4 {
          margin: 0 0 15px 0;
          color: var(--text-primary);
          font-size: 18px;
          border-bottom: 2px solid var(--accent);
          padding-bottom: 5px;
        }

        .setting-group {
          margin-bottom: 15px;
        }

        .setting-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .setting-group input,
        .setting-group select {
          width: 100%;
          padding: 8px 12px;
          border: 2px solid var(--border-color);
          border-radius: 4px;
          font-size: 14px;
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .setting-group input:focus,
        .setting-group select:focus {
          outline: none;
          border-color: var(--accent);
        }

        .slider-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .slider-group input[type="range"] {
          flex: 1;
        }

        .slider-value {
          min-width: 40px;
          text-align: center;
          font-weight: 600;
          color: var(--accent);
        }

        .setting-group small {
          display: block;
          margin-top: 3px;
          color: var(--text-muted);
          font-size: 12px;
        }

        .checkbox label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: normal;
        }

        .checkbox input[type="checkbox"] {
          width: auto;
          margin: 0;
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
          .settings-panel {
            margin: 10px;
            padding: 15px;
          }

          .panel-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .slider-group {
            flex-direction: column;
            align-items: stretch;
          }

          .settings-sections {
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
});

SettingsPanel.displayName = 'SettingsPanel';

export default SettingsPanel;