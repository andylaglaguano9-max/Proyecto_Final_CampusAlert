import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './footer';

describe('Footer Component', () => {
  it('renders footer text via props', () => {
    render(<Footer text="EcoTest Footer" />);
    expect(screen.getByText(/EcoTest Footer/i)).toBeInTheDocument();
  });

  it('renders academic project subtext', () => {
    render(<Footer text="EcoMetrics" />);
    expect(screen.getByText(/Proyecto Académico - 6to Nivel TI/i)).toBeInTheDocument();
  });
});
