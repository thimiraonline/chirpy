import { cleanup, render, screen } from '@testing-library/react';

import { Alert } from '../alert';

const text = 'This is a test alert';

describe('Alert', () => {
  beforeEach(() => {
    render(<Alert type="warn">{text}</Alert>);
  });

  afterEach(() => {
    jest.resetAllMocks();
    return cleanup();
  });

  it('should render the text', async () => {
    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
