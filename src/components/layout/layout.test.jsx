import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Layout from './layout';

describe('Layout Component', () => {
  it('renders header, footer and children content', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div data-testid="child-content">Contenido de prueba</div>
        </Layout>
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getAllByText(/EcoMetrics/i).length).toBeGreaterThan(0);
  });
});
