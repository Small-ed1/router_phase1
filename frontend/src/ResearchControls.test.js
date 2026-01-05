import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResearchControls from './ResearchControls';

describe('ResearchControls', () => {
  const mockOnStartResearch = jest.fn();
  const mockOnStopResearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders research controls header', () => {
    render(
      <ResearchControls
        onStartResearch={mockOnStartResearch}
        onStopResearch={mockOnStopResearch}
        currentTask={null}
        isResearching={false}
      />
    );

    expect(screen.getByText('Research Controls')).toBeInTheDocument();
  });

  test('renders form when not researching', () => {
    render(
      <ResearchControls
        onStartResearch={mockOnStartResearch}
        onStopResearch={mockOnStopResearch}
        currentTask={null}
        isResearching={false}
      />
    );

    expect(screen.getByLabelText(/research topic/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/research depth/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start research/i })).toBeInTheDocument();
  });

  test('renders active research UI when researching', () => {
    render(
      <ResearchControls
        onStartResearch={mockOnStartResearch}
        onStopResearch={mockOnStopResearch}
        currentTask="research_123"
        isResearching={true}
      />
    );

    expect(screen.getByText('Research in progress...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /stop research/i })).toBeInTheDocument();
  });

  test('shows current session when task is active', () => {
    render(
      <ResearchControls
        onStartResearch={mockOnStartResearch}
        onStopResearch={mockOnStopResearch}
        currentTask="research_123"
        isResearching={false}
      />
    );

    expect(screen.getByText('Active Session:')).toBeInTheDocument();
    expect(screen.getByText('research_123')).toBeInTheDocument();
  });

  test('start button is disabled when topic is empty', () => {
    render(
      <ResearchControls
        onStartResearch={mockOnStartResearch}
        onStopResearch={mockOnStopResearch}
        currentTask={null}
        isResearching={false}
      />
    );

    const startButton = screen.getByRole('button', { name: /start research/i });
    expect(startButton).toBeDisabled();
  });

  test('start button is enabled when topic is entered', async () => {
    const user = userEvent.setup();

    render(
      <ResearchControls
        onStartResearch={mockOnStartResearch}
        onStopResearch={mockOnStopResearch}
        currentTask={null}
        isResearching={false}
      />
    );

    const topicInput = screen.getByLabelText(/research topic/i);
    const startButton = screen.getByRole('button', { name: /start research/i });

    await user.type(topicInput, 'Test research topic');
    expect(startButton).not.toBeDisabled();
  });

  test('calls onStartResearch with correct parameters on form submit', async () => {
    const user = userEvent.setup();
    mockOnStartResearch.mockResolvedValueOnce();

    render(
      <ResearchControls
        onStartResearch={mockOnStartResearch}
        onStopResearch={mockOnStopResearch}
        currentTask={null}
        isResearching={false}
      />
    );

    const topicInput = screen.getByLabelText(/research topic/i);
    const depthSelect = screen.getByLabelText(/research depth/i);
    const startButton = screen.getByRole('button', { name: /start research/i });

    await user.type(topicInput, 'AI Ethics');
    await user.selectOptions(depthSelect, 'deep');
    await user.click(startButton);

    await waitFor(() => {
      expect(mockOnStartResearch).toHaveBeenCalledWith('AI Ethics', 'deep');
    });
  });

  test('clears topic input after successful start', async () => {
    const user = userEvent.setup();
    mockOnStartResearch.mockResolvedValueOnce();

    render(
      <ResearchControls
        onStartResearch={mockOnStartResearch}
        onStopResearch={mockOnStopResearch}
        currentTask={null}
        isResearching={false}
      />
    );

    const topicInput = screen.getByLabelText(/research topic/i);
    await user.type(topicInput, 'Test topic');
    await user.click(screen.getByRole('button', { name: /start research/i }));

    await waitFor(() => {
      expect(topicInput.value).toBe('');
    });
  });

  test('shows loading state during start', async () => {
    const user = userEvent.setup();
    mockOnStartResearch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <ResearchControls
        onStartResearch={mockOnStartResearch}
        onStopResearch={mockOnStopResearch}
        currentTask={null}
        isResearching={false}
      />
    );

    const topicInput = screen.getByLabelText(/research topic/i);
    await user.type(topicInput, 'Test topic');
    await user.click(screen.getByRole('button', { name: /start research/i }));

    expect(screen.getByText('Starting Research...')).toBeInTheDocument();
  });

  test('calls onStopResearch when stop button is clicked', async () => {
    const user = userEvent.setup();
    mockOnStopResearch.mockResolvedValueOnce();

    render(
      <ResearchControls
        onStartResearch={mockOnStartResearch}
        onStopResearch={mockOnStopResearch}
        currentTask="research_123"
        isResearching={true}
      />
    );

    const stopButton = screen.getByRole('button', { name: /stop research/i });
    await user.click(stopButton);

    await waitFor(() => {
      expect(mockOnStopResearch).toHaveBeenCalledWith('research_123');
    });
  });

  test('handles start research error gracefully', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockOnStartResearch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <ResearchControls
        onStartResearch={mockOnStartResearch}
        onStopResearch={mockOnStopResearch}
        currentTask={null}
        isResearching={false}
      />
    );

    const topicInput = screen.getByLabelText(/research topic/i);
    await user.type(topicInput, 'Test topic');
    await user.click(screen.getByRole('button', { name: /start research/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to start research:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test('handles stop research error gracefully', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockOnStopResearch.mockRejectedValueOnce(new Error('Stop error'));

    render(
      <ResearchControls
        onStartResearch={mockOnStartResearch}
        onStopResearch={mockOnStopResearch}
        currentTask="research_123"
        isResearching={true}
      />
    );

    const stopButton = screen.getByRole('button', { name: /stop research/i });
    await user.click(stopButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to stop research:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test('form inputs are disabled during starting state', async () => {
    const user = userEvent.setup();
    mockOnStartResearch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <ResearchControls
        onStartResearch={mockOnStartResearch}
        onStopResearch={mockOnStopResearch}
        currentTask={null}
        isResearching={false}
      />
    );

    const topicInput = screen.getByLabelText(/research topic/i);
    const depthSelect = screen.getByLabelText(/research depth/i);

    await user.type(topicInput, 'Test topic');
    await user.click(screen.getByRole('button', { name: /start research/i }));

    expect(topicInput).toBeDisabled();
    expect(depthSelect).toBeDisabled();
  });
});