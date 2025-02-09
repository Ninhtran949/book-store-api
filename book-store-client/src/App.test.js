import { render, screen } from '@testing-library/react';
import App from './App';

test('renders auth page', () => {
  render(<App />);
  const authElement = screen.getByTestId('auth-container');
  expect(authElement).toBeInTheDocument();
});
