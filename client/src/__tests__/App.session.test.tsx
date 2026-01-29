import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

jest.mock('../api/client', () => ({
  createSession: jest.fn(),
  roll: jest.fn(),
  cashout: jest.fn(),
}));

describe('App session behaviour', () => {
  const mockCreateSession = jest.requireMock('../api/client')
    .createSession as jest.Mock;

  beforeEach(() => {
    jest.useRealTimers();
    mockCreateSession.mockReset();
  });

  it('creates a session and displays credits from server', async () => {
    mockCreateSession.mockResolvedValue({
      sessionId: '11111111-1111-1111-1111-111111111111',
      credits: 10,
    });

    render(<App />);

    const startButton = screen.getByRole('button', { name: /start game/i });
    await userEvent.click(startButton);

    await waitFor(() => {
      const creditsLabel = screen.getByText(/credits:/i);
      const container = creditsLabel.parentElement;
      expect(container).toHaveTextContent('Credits: 10');
    });
  });
});

