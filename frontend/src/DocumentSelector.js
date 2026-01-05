import React, { useState, useEffect } from 'react';
import Skeleton, { SkeletonText } from './Skeleton';
import { cachedFetch } from './apiCache';
import VirtualizedList from './VirtualizedList';

const DocumentSelector = React.memo(({ selectedDocuments, onSelectionChange, maxSelections = 5 }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await cachedFetch('/api/documents');
      setDocuments(data.documents || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      // Mock data for development
      setDocuments([
        {
          id: 'doc1',
          filename: 'research_paper.pdf',
          title: 'Advances in Machine Learning',
          type: 'pdf',
          size: 2457600,
          uploadedAt: '2024-01-15T10:30:00Z',
          status: 'processed',
          chunkCount: 45,
        },
        {
          id: 'doc2',
          filename: 'user_manual.docx',
          title: 'System User Manual',
          type: 'docx',
          size: 512000,
          uploadedAt: '2024-01-14T15:20:00Z',
          status: 'processed',
          chunkCount: 23,
        },
        {
          id: 'doc3',
          filename: 'notes.txt',
          title: 'Meeting Notes',
          type: 'txt',
          size: 16384,
          uploadedAt: '2024-01-13T09:15:00Z',
          status: 'processed',
          chunkCount: 8,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentToggle = (documentId) => {
    const newSelection = selectedDocuments.includes(documentId)
      ? selectedDocuments.filter(id => id !== documentId)
      : [...selectedDocuments, documentId];

    if (newSelection.length <= maxSelections) {
      onSelectionChange(newSelection);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.title && doc.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed': return '#28a745';
      case 'processing': return '#ffc107';
      case 'failed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="document-selector">
        <div className="selector-header">
          <Skeleton width="200px" height="1.5rem" />
          <Skeleton width="120px" height="1rem" />
        </div>

        <div className="selector-controls">
          <Skeleton width="100%" height="2.5rem" />
          <Skeleton width="120px" height="2.5rem" />
        </div>

        <div className="documents-list">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="document-item">
              <Skeleton width="20px" height="20px" variant="circular" className="document-checkbox" />
              <div className="document-info">
                <div className="document-header">
                  <Skeleton width="70%" height="1rem" />
                  <div className="document-meta">
                    <Skeleton width="50px" height="1rem" />
                  </div>
                </div>
                <SkeletonText lines={2} width="100%" />
                <Skeleton width="80px" height="0.8rem" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="document-selector">
      <div className="selector-header">
        <h3>Select Documents</h3>
        <span className="selection-count">
          {selectedDocuments.length}/{maxSelections} selected
        </span>
      </div>

      <div className="selector-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <label>
            Type:
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="type-filter"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF</option>
              <option value="docx">Word</option>
              <option value="txt">Text</option>
            </select>
          </label>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="documents-list">
        {filteredDocuments.length === 0 ? (
          <div className="no-documents">
            <p>{searchTerm || filterType !== 'all' ? 'No documents match your search.' : 'No documents uploaded yet.'}</p>
            <p>Upload documents in the Documents tab to get started.</p>
          </div>
        ) : filteredDocuments.length > 20 ? (
          <VirtualizedList
            items={filteredDocuments}
            itemHeight={100}
            containerHeight={400}
            renderItem={(doc, index) => (
              <div
                key={doc.id}
                className={`document-item ${selectedDocuments.includes(doc.id) ? 'selected' : ''}`}
                onClick={() => handleDocumentToggle(doc.id)}
              >
                <div className="document-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.includes(doc.id)}
                    onChange={() => {}}
                    disabled={!selectedDocuments.includes(doc.id) && selectedDocuments.length >= maxSelections}
                  />
                </div>

                <div className="document-info">
                  <div className="document-header">
                    <h4 className="document-title">
                      {doc.title || doc.filename}
                    </h4>
                    <div className="document-meta">
                      <span className="document-type">{doc.type.toUpperCase()}</span>
                      <span className="document-status" style={{ color: getStatusColor(doc.status) }}>
                        ● {doc.status}
                      </span>
                    </div>
                  </div>

                  <div className="document-details">
                    <span className="document-filename">{doc.filename}</span>
                    <span className="document-size">{formatFileSize(doc.size)}</span>
                    {doc.chunkCount && (
                      <span className="document-chunks">{doc.chunkCount} chunks</span>
                    )}
                  </div>

                  <div className="document-date">
                    Uploaded {formatDate(doc.uploadedAt)}
                  </div>
                </div>
              </div>
            )}
          />
        ) : (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className={`document-item ${selectedDocuments.includes(doc.id) ? 'selected' : ''}`}
              onClick={() => handleDocumentToggle(doc.id)}
            >
              <div className="document-checkbox">
                <input
                  type="checkbox"
                  checked={selectedDocuments.includes(doc.id)}
                  onChange={() => {}} // Handled by onClick
                  disabled={!selectedDocuments.includes(doc.id) && selectedDocuments.length >= maxSelections}
                />
              </div>

              <div className="document-info">
                <div className="document-header">
                  <h4 className="document-title">
                    {doc.title || doc.filename}
                  </h4>
                  <div className="document-meta">
                    <span className="document-type">{doc.type.toUpperCase()}</span>
                    <span className="document-status" style={{ color: getStatusColor(doc.status) }}>
                      ● {doc.status}
                    </span>
                  </div>
                </div>

                <div className="document-details">
                  <span className="document-filename">{doc.filename}</span>
                  <span className="document-size">{formatFileSize(doc.size)}</span>
                  {doc.chunkCount && (
                    <span className="document-chunks">{doc.chunkCount} chunks</span>
                  )}
                </div>

                <div className="document-date">
                  Uploaded {formatDate(doc.uploadedAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .document-selector {
          background: var(--bg-primary);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px var(--shadow);
          max-height: 600px;
          display: flex;
          flex-direction: column;
        }

        .selector-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border-color);
        }

        .selector-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .selection-count {
          font-size: 14px;
          color: var(--text-secondary);
          background: var(--bg-tertiary);
          padding: 4px 8px;
          border-radius: 12px;
        }

        .selector-controls {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .search-bar {
          position: relative;
          flex: 1;
          min-width: 250px;
        }

        .search-input {
          width: 100%;
          padding: 10px 40px 10px 15px;
          border: 2px solid var(--border-color);
          border-radius: 6px;
          font-size: 14px;
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--accent);
        }

        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          pointer-events: none;
        }

        .filter-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-controls label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .type-filter {
          padding: 6px 10px;
          border: 2px solid var(--border-color);
          border-radius: 4px;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid var(--error);
          border-radius: 4px;
          color: var(--text-primary);
          margin-bottom: 15px;
        }

        .documents-list {
          flex: 1;
          overflow-y: auto;
          border: 1px solid var(--border-color);
          border-radius: 6px;
        }

        .document-item {
          display: flex;
          align-items: flex-start;
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .document-item:last-child {
          border-bottom: none;
        }

        .document-item:hover {
          background: var(--bg-secondary);
        }

        .document-item.selected {
          background: rgba(0, 123, 255, 0.1);
          border-left: 3px solid var(--accent);
        }

        .document-checkbox {
          margin-right: 15px;
          margin-top: 2px;
        }

        .document-checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .document-info {
          flex: 1;
          min-width: 0;
        }

        .document-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          gap: 10px;
        }

        .document-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .document-meta {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }

        .document-type {
          background: var(--accent);
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 600;
        }

        .document-status {
          font-size: 12px;
          font-weight: 500;
        }

        .document-details {
          display: flex;
          gap: 15px;
          margin-bottom: 6px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .document-date {
          font-size: 12px;
          color: var(--text-muted);
        }

        .no-documents {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }

        .no-documents p {
          margin: 10px 0;
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
          .selector-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .selector-controls {
            flex-direction: column;
            gap: 10px;
          }

          .search-bar {
            min-width: auto;
          }

          .document-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .document-meta {
            width: 100%;
            justify-content: space-between;
          }

          .document-details {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
});

DocumentSelector.displayName = 'DocumentSelector';

export default DocumentSelector;