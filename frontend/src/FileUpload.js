import React, { useState, useCallback } from 'react';

const FileUpload = ({ onFileUpload, acceptedTypes = ".pdf,.txt,.md,.doc,.docx", maxSizeMB = 10 }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const validateFile = (file) => {
    // Check file type
    const allowedExtensions = acceptedTypes.split(',').map(ext => ext.trim().toLowerCase());
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error(`File type ${fileExtension} is not supported. Allowed types: ${acceptedTypes}`);
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum allowed size (${maxSizeMB}MB)`);
    }

    return true;
  };

  const processFile = async (file) => {
    try {
      validateFile(file);

      setUploading(true);
      setError(null);

      // For now, just simulate upload and store file info
      // In Phase 5, this will actually upload to the backend
      const fileInfo = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        status: 'uploaded'
      };

      setUploadedFiles(prev => [...prev, fileInfo]);

      if (onFileUpload) {
        await onFileUpload(file, fileInfo);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      await processFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      await processFile(file);
    }
    // Clear the input
    e.target.value = '';
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-upload">
      <div className="upload-header">
        <h3>Document Upload</h3>
        <p>Upload documents for Q&A (Phase 5 preparation)</p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="dismiss-error">×</button>
        </div>
      )}

      <div
        className={`upload-zone ${isDragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="upload-content">
          <div className="upload-icon">📁</div>
          <div className="upload-text">
            {uploading ? (
              <div className="uploading-indicator">
                <div className="spinner"></div>
                <p>Uploading...</p>
              </div>
            ) : (
              <>
                <p>Drag and drop files here, or <label className="file-input-label">browse</label></p>
                <p className="upload-hint">Supported formats: {acceptedTypes} (max {maxSizeMB}MB each)</p>
                <input
                  type="file"
                  multiple
                  accept={acceptedTypes}
                  onChange={handleFileSelect}
                  className="file-input"
                  id="file-input"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h4>Uploaded Files ({uploadedFiles.length})</h4>
          <div className="files-list">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="file-item">
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-meta">
                    {formatFileSize(file.size)} • Uploaded {new Date(file.uploadedAt).toLocaleTimeString()}
                  </div>
                </div>
                <div className="file-actions">
                  <button
                    onClick={() => removeFile(file.id)}
                    className="remove-file"
                    title="Remove file"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .file-upload {
          background: var(--bg-primary);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px var(--shadow);
          margin: 20px 0;
        }

        .upload-header h3 {
          margin: 0 0 5px 0;
          color: var(--text-primary);
        }

        .upload-header p {
          margin: 0;
          color: var(--text-secondary);
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

        .dismiss-error {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: var(--text-primary);
        }

        .upload-zone {
          border: 2px dashed var(--border-color);
          border-radius: 8px;
          padding: 40px 20px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          background: var(--bg-secondary);
        }

        .upload-zone:hover,
        .upload-zone.drag-over {
          border-color: var(--accent);
          background: rgba(0, 123, 255, 0.05);
        }

        .upload-zone.uploading {
          pointer-events: none;
          opacity: 0.7;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .upload-icon {
          font-size: 48px;
          opacity: 0.6;
        }

        .upload-text p {
          margin: 5px 0;
          color: var(--text-primary);
        }

        .file-input-label {
          color: var(--accent);
          cursor: pointer;
          font-weight: 500;
          text-decoration: underline;
        }

        .file-input {
          display: none;
        }

        .upload-hint {
          font-size: 12px;
          color: var(--text-muted) !important;
          margin-top: 5px !important;
        }

        .uploading-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid var(--border-color);
          border-top: 3px solid var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }

        .uploaded-files {
          margin-top: 20px;
        }

        .uploaded-files h4 {
          margin: 0 0 15px 0;
          color: var(--text-primary);
          font-size: 16px;
        }

        .files-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: var(--bg-secondary);
          border-radius: 6px;
          border: 1px solid var(--border-color);
        }

        .file-info {
          flex: 1;
        }

        .file-name {
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .file-meta {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .file-actions {
          margin-left: 10px;
        }

        .remove-file {
          background: var(--error);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: background-color 0.2s ease;
        }

        .remove-file:hover {
          background: #c82333;
        }

        @media (max-width: 768px) {
          .file-upload {
            margin: 10px;
            padding: 15px;
          }

          .upload-zone {
            padding: 30px 15px;
          }

          .file-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .file-actions {
            align-self: flex-end;
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FileUpload;