import React from 'react';

const RichTextMessage = React.memo(({
  content,
  isEditable = false,
  onChange,
  placeholder = "Type your message..."
}) => {
  // Convert markdown-like syntax to HTML for display
  const convertMarkdownToHtml = (text) => {
    if (!text) return '';

    return text
      // Code blocks (must come first)
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Lists (convert to proper HTML)
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr>')
      // Wrap in paragraphs if not already wrapped
      .replace(/^([^<].*?)(<|$)/gm, '<p>$1</p>$2');
  };

  // For display mode, convert markdown and render as HTML
  if (!isEditable) {
    const htmlContent = convertMarkdownToHtml(content);
    return (
      <div
        className="rich-text-display"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  // For editing mode, use simple textarea for now
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="rich-text-editor"
      rows={4}
    />
  );
});

RichTextMessage.displayName = 'RichTextMessage';

export default RichTextMessage;