import React, { useState, useEffect } from 'react';
import RichTextMessage from './RichTextMessage';

const HomePage = ({ onStartChat, onStartResearch, selectedModel, onModelChange, settings }) => {
  const [scrollY, setScrollY] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      onStartChat(message.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const features = [
    {
      icon: '💬',
      title: 'Intelligent Chat',
      description: 'Have natural conversations with AI models. Ask questions, get explanations, and explore ideas.'
    },
    {
      icon: '🔬',
      title: 'Deep Research',
      description: 'Conduct comprehensive research with multi-agent systems. Get detailed analysis and insights.'
    },
    {
      icon: '📚',
      title: 'Document Q&A',
      description: 'Upload documents and ask questions about their content. Perfect for research papers and manuals.'
    },
    {
      icon: '📊',
      title: 'Agent Dashboard',
      description: 'Monitor and manage your AI agents in real-time. See their progress and performance.'
    },
    {
      icon: '⚙️',
      title: 'Advanced Settings',
      description: 'Customize your experience with theme preferences, model selection, and advanced options.'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to Router Phase 1
          </h1>
          <p className="hero-subtitle">
            Advanced AI assistant with research capabilities and tool integration
          </p>

          {/* Chat Bar */}
          <div className="chat-bar">
        <div className="model-indicator">
          <span className="model-label">Model:</span>
          <span className="model-name">
            {settings?.homeModelPreference === 'default' ?
              (selectedModel || 'Select a model') :
              'Recommended Model'
            }
          </span>
        </div>

            <div className="chat-input-container">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything, or start a conversation..."
                rows={1}
                className="chat-input"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="send-button"
              >
                💬
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button
              onClick={() => onStartChat("Hello! I'd like to have a conversation.")}
              className="action-button primary"
            >
              Start Chat
            </button>
            <button
              onClick={onStartResearch}
              className="action-button secondary"
            >
              Deep Research
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <h2 className="section-title">Explore Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorial Section */}
      <section className="tutorial-section">
        <div className="tutorial-content">
          <h2 className="section-title">Getting Started</h2>

          <div className="tutorial-steps">
            <div className="tutorial-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Select Your Model</h3>
                <p>Choose from various AI models in the sidebar. Each model has different strengths for different tasks.</p>
              </div>
            </div>

            <div className="tutorial-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Start a Conversation</h3>
                <p>Use the chat bar above or navigate to the Chat mode. Ask questions, get explanations, or explore ideas.</p>
              </div>
            </div>

            <div className="tutorial-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Try Deep Research</h3>
                <p>For comprehensive analysis, use the Deep Research mode. It uses multiple AI agents to provide thorough insights.</p>
              </div>
            </div>

            <div className="tutorial-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Upload Documents</h3>
                <p>Upload PDFs, documents, or text files and ask questions about their content in the Documents mode.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
        }

        .hero-section {
          padding: clamp(40px, 10vh, 80px) clamp(15px, 5vw, 20px);
          text-align: center;
          background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(74, 144, 226, 0.1)"/><circle cx="80" cy="40" r="1.5" fill="rgba(74, 144, 226, 0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(74, 144, 226, 0.1)"/></svg>');
          opacity: 0.5;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: clamp(2rem, 8vw, 3rem);
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 clamp(15px, 3vh, 20px) 0;
          background: linear-gradient(135deg, var(--accent), #4dabf7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 4vw, 1.25rem);
          color: var(--text-secondary);
          margin: 0 0 clamp(30px, 6vh, 40px) 0;
          line-height: 1.6;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .chat-bar {
          background: var(--bg-primary);
          border-radius: clamp(12px, 3vw, 16px);
          padding: clamp(16px, 4vw, 24px);
          box-shadow: 0 8px 32px var(--shadow);
          border: 1px solid var(--border-color);
          margin: 0 auto clamp(20px, 4vh, 32px) auto;
          max-width: min(600px, 90vw);
          width: 100%;
          box-sizing: border-box;
        }

        .model-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .model-name {
          font-weight: 600;
          color: var(--accent);
        }

        .chat-input-container {
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }

        .chat-input {
          flex: 1;
          padding: clamp(12px, 3vw, 16px);
          border: 2px solid var(--border-color);
          border-radius: clamp(8px, 2vw, 12px);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: clamp(14px, 3vw, 16px);
          font-family: inherit;
          resize: none;
          min-height: 20px;
          max-height: 120px;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }

        .chat-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .send-button {
          padding: clamp(12px, 3vw, 16px);
          background: var(--accent);
          color: white;
          border: none;
          border-radius: clamp(8px, 2vw, 12px);
          cursor: pointer;
          font-size: clamp(14px, 3vw, 16px);
          transition: all 0.2s ease;
          width: clamp(48px, 12vw, 56px);
          height: clamp(48px, 12vw, 56px);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .send-button:hover:not(:disabled) {
          background: #0056b3;
          transform: scale(1.05);
        }

        .send-button:disabled {
          background: var(--text-secondary);
          cursor: not-allowed;
          transform: none;
        }

        .quick-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .action-button {
          padding: 14px 28px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }

        .action-button.primary {
          background: var(--accent);
          color: white;
        }

        .action-button.primary:hover {
          background: #0056b3;
          transform: translateY(-2px);
        }

        .action-button.secondary {
          background: transparent;
          color: var(--accent);
          border-color: var(--accent);
        }

        .action-button.secondary:hover {
          background: var(--accent);
          color: white;
          transform: translateY(-2px);
        }

        .features-section,
        .tutorial-section {
          padding: clamp(40px, 10vh, 80px) clamp(15px, 5vw, 20px);
          background: var(--bg-primary);
        }

        .features-content,
        .tutorial-content {
          max-width: min(1200px, 95vw);
          margin: 0 auto;
        }

        .section-title {
          font-size: clamp(1.8rem, 6vw, 2.5rem);
          font-weight: 700;
          color: var(--text-primary);
          text-align: center;
          margin: 0 0 clamp(30px, 6vh, 60px) 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(clamp(250px, 30vw, 300px), 1fr));
          gap: clamp(20px, 4vw, 32px);
        }

        .feature-card {
          background: var(--bg-secondary);
          border-radius: clamp(12px, 3vw, 16px);
          padding: clamp(20px, 5vw, 32px);
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid var(--border-color);
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px var(--shadow);
        }

        .feature-icon {
          font-size: clamp(2.5rem, 8vw, 3rem);
          margin-bottom: clamp(15px, 4vh, 20px);
        }

        .feature-title {
          font-size: clamp(1.1rem, 4vw, 1.25rem);
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 clamp(8px, 2vh, 12px) 0;
        }

        .feature-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
          font-size: clamp(0.9rem, 2.5vw, 1rem);
        }

        .tutorial-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(clamp(200px, 25vw, 250px), 1fr));
          gap: clamp(20px, 4vw, 32px);
          max-width: min(1000px, 95vw);
          margin: 0 auto;
        }

        .tutorial-step {
          display: flex;
          gap: clamp(15px, 3vw, 20px);
          align-items: flex-start;
        }

        .step-number {
          width: clamp(40px, 8vw, 48px);
          height: clamp(40px, 8vw, 48px);
          border-radius: 50%;
          background: var(--accent);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(16px, 3vw, 18px);
          font-weight: 600;
          flex-shrink: 0;
        }

        .step-content h3 {
          margin: 0 0 clamp(6px, 1.5vh, 8px) 0;
          color: var(--text-primary);
          font-size: clamp(1rem, 3.5vw, 1.125rem);
        }

        .step-content p {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: clamp(0.9rem, 2.5vw, 1rem);
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 40px 20px;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .chat-bar {
            padding: 20px;
          }

          .quick-actions {
            flex-direction: column;
            align-items: center;
          }

          .action-button {
            width: 200px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .tutorial-steps {
            grid-template-columns: 1fr;
          }

          /* Extra small screens (< 480px) */
          @media (max-width: 480px) {
            .hero-section {
              padding: 30px 15px;
            }

            .chat-bar {
              padding: 16px;
              margin-bottom: 24px;
            }

            .quick-actions {
              gap: 12px;
            }

            .action-button {
              padding: 12px 20px;
              font-size: 14px;
            }

            .features-section,
            .tutorial-section {
              padding: 30px 15px;
            }

            .features-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }

            .tutorial-steps {
              grid-template-columns: 1fr;
              gap: 24px;
            }

            .feature-card,
            .tutorial-step {
              text-align: left;
            }

            .feature-card {
              padding: 20px;
            }

            .tutorial-step {
              flex-direction: column;
              gap: 12px;
              text-align: center;
            }

            .step-number {
              align-self: center;
            }
          }

          /* Small screens (481px - 768px) */
          @media (min-width: 481px) and (max-width: 768px) {
            .features-section,
            .tutorial-section {
              padding: 50px 20px;
            }

            .features-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 24px;
            }

            .tutorial-steps {
              grid-template-columns: 1fr;
              gap: 28px;
            }
          }

          /* Medium screens (769px - 1024px) */
          @media (min-width: 769px) and (max-width: 1024px) {
            .features-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          /* Large screens (1025px - 1440px) */
          @media (min-width: 1025px) and (max-width: 1440px) {
            .features-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          /* Extra large screens (> 1440px) */
          @media (min-width: 1441px) {
            .features-grid {
              grid-template-columns: repeat(4, 1fr);
              gap: 40px;
            }

            .tutorial-steps {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;