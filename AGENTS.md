# AGENTS.md - Router Phase 1 Development Guide

This document provides essential information for agentic coding agents working in this repository.

## Build, Lint, and Test Commands

### Frontend (React + Parcel)

```bash
# Development server
npm start
# or
cd frontend && npm start

# Production build
npm run build
# or
cd frontend && npm run build

# Run all tests
npm test
# or
cd frontend && npm test

# Run tests in watch mode
npm run test:watch
# or
cd frontend && npm run test:watch

# Run a single test file
npm test -- ResearchControls.test.js
# or
cd frontend && npm test -- ResearchControls.test.js

# Run tests with coverage
npm test -- --coverage
# or
cd frontend && npm test -- --coverage
```

### Backend (Python + FastAPI)

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000

# Run tests
python -m pytest tests/ -v

# Run a single test file
python -m pytest tests/test_specific.py -v

# Run tests with coverage
python -m pytest tests/ --cov=backend --cov-report=html

# Type checking
mypy backend/ --ignore-missing-imports

# Code formatting
black backend/
isort backend/

# Lint with flake8 (if configured)
flake8 backend/
```

### Full Stack Development

```bash
# Start backend
cd backend && uvicorn app:app --reload --host 0.0.0.0 --port 8000

# Start frontend (in another terminal)
cd frontend && npm start

# Run full test suite
cd backend && python -m pytest tests/
cd frontend && npm test
```

## Code Style Guidelines

### JavaScript/React (Frontend)

#### Imports
```javascript
// React imports first
import React, { useState, useEffect } from 'react';

// Third-party libraries
import { motion } from 'framer-motion';

// Local imports (relative)
import { cachedFetch } from './apiCache';
import RichTextMessage from './RichTextMessage';

// Lazy imports for code splitting
const LazyComponent = lazy(() => import('./LazyComponent'));
```

#### Component Structure
```javascript
import React, { useState, useEffect } from 'react';

const MyComponent = React.memo(({
  prop1,
  prop2,
  onAction
}) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects here
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  const handleAction = () => {
    // Handler logic
  };

  return (
    <div className="my-component">
      {/* JSX content */}
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;
```

#### Naming Conventions
- **Components**: PascalCase (`MyComponent`)
- **Functions**: camelCase (`handleClick`, `formatDate`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Files**: PascalCase for components (`MyComponent.js`), camelCase for utilities (`apiCache.js`)
- **CSS Classes**: kebab-case (`my-component`, `sidebar-header`)
- **CSS Variables**: kebab-case (`--bg-primary`, `--text-secondary`)

#### CSS-in-JS Patterns
```javascript
// Use CSS variables for theming
const styles = `
  .component {
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }
`;

// Responsive design with clamp()
padding: clamp(8px, 2vw, 16px);
font-size: clamp(14px, 2.5vw, 18px);

// Grid layouts
display: grid;
grid-template-columns: repeat(auto-fit, minmax(clamp(250px, 30vw, 300px), 1fr));
```

#### Error Handling
```javascript
const MyComponent = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsyncOperation = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await someAsyncCall();
      // Handle success
    } catch (err) {
      console.error('Operation failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    // Component JSX
  );
};
```

#### Testing Patterns
```javascript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  test('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent onAction={mockFn} />);

    await user.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### Python (Backend)

#### Imports
```python
# Standard library
from __future__ import annotations
import json
from typing import Any, Optional, List, Dict
from pathlib import Path

# Third-party
import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Local imports
from .utils import helper_function
```

#### Type Hints
```python
def process_data(data: Dict[str, Any]) -> Optional[List[str]]:
    """Process input data and return results."""
    if not data:
        return None

    results: List[str] = []
    for key, value in data.items():
        if isinstance(value, str):
            results.append(value.upper())

    return results

class UserRequest(BaseModel):
    name: str
    email: str
    age: Optional[int] = None
```

#### Error Handling
```python
async def api_endpoint(request: UserRequest):
    try:
        # Validate input
        if not request.name:
            raise HTTPException(status_code=400, detail="Name is required")

        # Process request
        result = await process_user_request(request)

        return {"status": "success", "data": result}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")
```

#### Naming Conventions
- **Classes**: PascalCase (`UserManager`, `APIClient`)
- **Functions/Methods**: snake_case (`process_data`, `get_user_by_id`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_TIMEOUT`, `MAX_RETRIES`)
- **Files**: snake_case (`user_manager.py`, `api_client.py`)
- **Variables**: snake_case (`user_data`, `api_response`)

#### Async Patterns
```python
import asyncio
from typing import AsyncGenerator

async def stream_response() -> AsyncGenerator[str, None]:
    """Stream response data."""
    for i in range(10):
        yield f"Chunk {i}"
        await asyncio.sleep(0.1)

@app.get("/stream")
async def stream_endpoint():
    return StreamingResponse(
        stream_response(),
        media_type="text/plain"
    )
```

#### Testing Patterns
```python
import pytest
from fastapi.testclient import TestClient
from backend.app import app

client = TestClient(app)

def test_api_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

@pytest.mark.asyncio
async def test_async_function():
    result = await async_function()
    assert result is not None

def test_error_handling():
    with pytest.raises(HTTPException) as exc_info:
        invalid_operation()
    assert exc_info.value.status_code == 400
```

### General Guidelines

#### File Organization
```
frontend/src/
├── components/          # Reusable components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── api/                # API client functions
├── styles/             # Global styles/CSS
└── __tests__/          # Test files

backend/
├── routes/             # API route handlers
├── models/             # Pydantic models
├── utils/              # Utility functions
├── services/           # Business logic
└── tests/              # Test files
```

#### Commit Messages
```
feat: add user authentication
fix: resolve memory leak in chat sessions
docs: update API documentation
style: format code with black
refactor: simplify component state management
test: add unit tests for user validation
```

#### Documentation
```python
def complex_function(
    param1: str,
    param2: Optional[int] = None,
    param3: bool = False
) -> Dict[str, Any]:
    """
    Process complex data with multiple parameters.

    Args:
        param1: Required string parameter
        param2: Optional integer parameter
        param3: Boolean flag for special processing

    Returns:
        Dictionary containing processed results

    Raises:
        ValueError: If param1 is invalid
        HTTPException: For API-related errors

    Example:
        >>> result = complex_function("test", param3=True)
        >>> result["status"]
        "success"
    """
```

#### Security Considerations
- Validate all user inputs
- Use parameterized queries for database operations
- Implement proper authentication/authorization
- Sanitize HTML content in React components
- Use HTTPS in production
- Log security-relevant events

#### Performance Guidelines
- Use React.memo for expensive components
- Implement proper loading states
- Cache API responses appropriately
- Use lazy loading for route components
- Optimize bundle size with code splitting
- Monitor memory usage in long-running operations

This guide ensures consistency across the codebase and helps agents produce high-quality, maintainable code.