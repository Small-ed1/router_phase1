import React, { useState, useRef, useEffect } from 'react';
import RichTextMessage from './RichTextMessage';

const DocumentQA = ({ selectedDocuments, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentQuery.trim() || isLoading) return;

    const query = currentQuery.trim();
    setCurrentQuery('');

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/qa/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          document_ids: selectedDocuments,
          max_results: 5,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const data = await response.json();

      // Add AI response
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.answer,
        sources: data.sources || [],
        confidence: data.confidence,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      setError(err.message);

      // Mock response for development
      setTimeout(() => {
        const mockAnswer = `Based on the ${selectedDocuments.length} selected document(s), here's what I found regarding "${query}":

This is a placeholder response. In the full implementation, this would contain actual answers extracted from the uploaded documents using vector similarity search and LLM synthesis.

Key points from the documents:
• Point 1 from document analysis
• Point 2 with source citations
• Point 3 with confidence scoring

Sources: ${selectedDocuments.join(', ')}`;

        const aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: mockAnswer,
          sources: selectedDocuments.map(id => ({ id, relevance: 0.85 })),
          confidence: 0.78,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);
        setError(null);
      }, 2000);

    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message) => {
    if (message.type === 'user') {
      return (
        <div className="message user-message">
          <div className="message-content">
            <p>{message.content}</p>
          </div>
          <div className="message-meta">
            <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="message ai-message">
          <div className="message-header">
            <div className="ai-avatar">🤖</div>
            <div className="ai-info">
              <span className="ai-name">Document Assistant</span>
              {message.confidence && (
                <span className="confidence-score">
                  Confidence: {(message.confidence * 100).toFixed(0)}%
                </span>
              )}
            </div>
          </div>

           <div className="message-content">
             <div className="answer-text">
               <RichTextMessage content={message.content} />
             </div>

            {message.sources && message.sources.length > 0 && (
              <div className="sources-section">
                <h5>Sources:</h5>
                <div className="sources-list">
                  {message.sources.map((source, index) => (
                    <div key={index} className="source-item">
                      <span className="source-id">{source.id}</span>
                      {source.relevance && (
                        <span className="source-relevance">
                          {(source.relevance * 100).toFixed(0)}% relevant
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="message-meta">
            <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="document-qa">
      <div className="qa-header">
        <button onClick={onBack} className="back-button">
          ← Back to Document Selection
        </button>
        <div className="qa-info">
          <h3>Document Q&A</h3>
          <p>Ask questions about your {selectedDocuments.length} selected document(s)</p>
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-area">
          {messages.length === 0 ? (
            isLoading ? (
              <div className="loading-messages">
                <div className="message ai-message">
                  <div className="message-header">
                    <Skeleton width="120px" height="1rem" />
                    <Skeleton width="80px" height="1rem" />
                  </div>
                  <div className="message-content">
                    <SkeletonText lines={3} width="100%" />
                  </div>
                </div>
                <div className="message user-message">
                  <div className="message-content">
                    <SkeletonText lines={2} width="80%" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="welcome-message">
                <div className="welcome-icon">📚</div>
                <h4>Welcome to Document Q&A</h4>
                <p>Ask me anything about your uploaded documents. I'll search through the content and provide relevant answers with source citations.</p>
                <div className="example-questions">
                  <p><strong>Example questions:</strong></p>
                  <ul>
                    <li>"What are the main findings in this research paper?"</li>
                    <li>"Summarize the key points from chapter 3"</li>
                    <li>"What does the document say about machine learning?"</li>
                  </ul>
                </div>
              </div>
            )
          ) : (
            <>
              {messages.map(message => (
                <div key={message.id}>
                  {renderMessage(message)}
                </div>
              ))}

              {isLoading && (
                <div className="message ai-message loading">
                  <div className="message-header">
                    <div className="ai-avatar">🤖</div>
                    <div className="ai-info">
                      <span className="ai-name">Document Assistant</span>
                      <span className="loading-text">Searching documents...</span>
                    </div>
                  </div>
                  <div className="message-content">
                    <div className="loading-indicator">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="dismiss-error">×</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="query-form">
          <div className="query-input-container">
            <textarea
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="query-input"
              rows={1}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              className="submit-button"
              disabled={!currentQuery.trim() || isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <span className="send-icon">➤</span>
              )}
            </button>
          </div>
          <div className="query-help">
            Press Enter to send, Shift+Enter for new line
          </div>
        </form>
      </div>

      <style>{`
        .document-qa {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--bg-primary);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px var(--shadow);
        }

        .qa-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .back-button {
          padding: 8px 16px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .back-button:hover {
          background: #0056b3;
        }

        .qa-info h3 {
          margin: 0 0 5px 0;
          color: var(--text-primary);
        }

        .qa-info p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .welcome-message {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
        }

        .welcome-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .welcome-message h4 {
          color: var(--text-primary);
          margin-bottom: 15px;
        }

        .example-questions {
          margin-top: 20px;
          text-align: left;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .example-questions ul {
          margin: 10px 0 0 0;
          padding-left: 20px;
        }

        .example-questions li {
          margin: 5px 0;
          font-size: 14px;
        }

        .message {
          max-width: 80%;
          animation: fadeIn 0.3s ease-in;
        }

        .user-message {
          align-self: flex-end;
          background: var(--accent);
          color: white;
          border-radius: 18px 18px 4px 18px;
          margin-left: auto;
        }

        .ai-message {
          align-self: flex-start;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 18px 18px 18px 4px;
          color: var(--text-primary);
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .ai-avatar {
          width: 32px;
          height: 32px;
          background: var(--accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .ai-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ai-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .confidence-score {
          font-size: 12px;
          color: var(--success);
          font-weight: 500;
        }

        .loading-text {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .message-content {
          line-height: 1.6;
        }

        .user-message .message-content {
          padding: 12px 16px;
        }

        .ai-message .message-content {
          padding: 0;
        }

        .answer-text p {
          margin: 8px 0;
        }

        .answer-text p:first-child {
          margin-top: 0;
        }

        .answer-text p:last-child {
          margin-bottom: 0;
        }

        .sources-section {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .sources-section h5 {
          margin: 0 0 8px 0;
          color: var(--text-primary);
          font-size: 14px;
        }

        .sources-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .source-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 10px;
          background: var(--bg-tertiary);
          border-radius: 4px;
          font-size: 13px;
        }

        .source-id {
          font-family: monospace;
          color: var(--accent);
        }

        .source-relevance {
          color: var(--text-secondary);
          font-size: 12px;
        }

        .message-meta {
          margin-top: 8px;
          text-align: right;
        }

        .user-message .message-meta {
          text-align: right;
        }

        .ai-message .message-meta {
          text-align: left;
        }

        .timestamp {
          font-size: 11px;
          color: var(--text-muted);
        }

        .loading-indicator {
          display: flex;
          align-items: center;
          padding: 20px;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .typing-dots span {
          width: 8px;
          height: 8px;
          background: var(--text-secondary);
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-dots span:nth-child(1) { animation-delay: 0s; }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(220, 53, 69, 0.1);
          border-top: 1px solid var(--error);
          color: var(--text-primary);
        }

        .dismiss-error {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: var(--error);
        }

        .query-form {
          border-top: 1px solid var(--border-color);
          background: var(--bg-primary);
        }

        .query-input-container {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          padding: 20px;
        }

        .query-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          font-size: 16px;
          font-family: inherit;
          background: var(--bg-primary);
          color: var(--text-primary);
          resize: none;
          min-height: 20px;
          max-height: 120px;
          overflow-y: auto;
        }

        .query-input:focus {
          outline: none;
          border-color: var(--accent);
        }

        .query-input:disabled {
          background: var(--bg-secondary);
          cursor: not-allowed;
        }

        .submit-button {
          padding: 12px 16px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 48px;
          height: 48px;
          transition: background-color 0.2s ease;
        }

        .submit-button:hover:not(:disabled) {
          background: #0056b3;
        }

        .submit-button:disabled {
          background: var(--text-muted);
          cursor: not-allowed;
        }

        .send-icon {
          font-size: 18px;
          transform: rotate(0deg);
          transition: transform 0.2s ease;
        }

        .submit-button:not(:disabled) .send-icon {
          transform: rotate(0deg);
        }

        .query-help {
          padding: 0 20px 12px;
          font-size: 12px;
          color: var(--text-secondary);
          text-align: center;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes typing {
          0%, 60%, 100% { opacity: 0.4; transform: scale(1); }
          30% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .qa-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .messages-area {
            padding: 15px;
          }

          .message {
            max-width: 90%;
          }

          .query-input-container {
            padding: 15px;
            gap: 8px;
          }

          .query-input {
            font-size: 16px; /* Prevents zoom on iOS */
          }

          .submit-button {
            min-width: 44px;
            height: 44px;
          }
        }
      `}</style>
    </div>
  );
};

export default DocumentQA;