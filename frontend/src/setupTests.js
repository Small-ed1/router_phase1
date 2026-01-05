require('@testing-library/jest-dom');

// Polyfill fetch for tests
global.fetch = require('jest-fetch-mock');

// Mock styled-jsx
require('styled-jsx/css').default = {
  global: () => '',
  resolve: () => ({ styles: '', className: '' })
};