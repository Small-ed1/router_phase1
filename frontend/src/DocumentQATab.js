import React, { useState } from 'react';
import DocumentSelector from './DocumentSelector';
import DocumentQA from './DocumentQA';

const DocumentQATab = () => {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [currentView, setCurrentView] = useState('selector'); // 'selector' or 'qa'

  const handleDocumentSelection = (documents) => {
    setSelectedDocuments(documents);
    if (documents.length > 0) {
      setCurrentView('qa');
    }
  };

  const handleBackToSelector = () => {
    setCurrentView('selector');
  };

  return (
    <div className="document-qa-tab">
      {currentView === 'selector' ? (
        <DocumentSelector
          selectedDocuments={selectedDocuments}
          onSelectionChange={handleDocumentSelection}
          maxSelections={5}
        />
      ) : (
        <DocumentQA
          selectedDocuments={selectedDocuments}
          onBack={handleBackToSelector}
        />
      )}
    </div>
  );
};

export default DocumentQATab;