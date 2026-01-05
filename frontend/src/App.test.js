import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Router Phase 1 title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Router Phase 1 - AI Research Dashboard/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders research description', () => {
  render(<App />);
  const messageElement = screen.getByText(/Advanced research and analysis powered by local LLMs/i);
  expect(messageElement).toBeInTheDocument();
});

test('renders research controls', () => {
  render(<App />);
  const controlsElement = screen.getByText(/Research Controls/i);
  expect(controlsElement).toBeInTheDocument();
});

test('renders settings tab', () => {
  render(<App />);
  const settingsTab = screen.getByText(/Settings/i);
  expect(settingsTab).toBeInTheDocument();
});

test('renders sessions tab', () => {
  render(<App />);
  const sessionsTabs = screen.getAllByText(/Sessions/i);
  expect(sessionsTabs.length).toBeGreaterThan(0);
});

test('renders documents tab', () => {
  render(<App />);
  const documentsTab = screen.getByText(/Documents/i);
  expect(documentsTab).toBeInTheDocument();
});