import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Home from './home';

describe('Home Component', () => {
  it('renders the main hero title correctly', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    const titleElement = screen.getByText(/CampusAlert/i, { exact: false });
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the report button', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    const reportButton = screen.getByRole('link', { name: /Reportar Incidente/i });
    expect(reportButton).toBeInTheDocument();
    expect(reportButton).toHaveAttribute('href', '/reportar');
  });
});
