import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Header from './header';

// Suite de pruebas para el componente Header
describe('Header Component', () => {
  // Verificación del renderizado del título del encabezado
  it('renders the header title via props', () => {
    render(
      <BrowserRouter>
        <Header title="EcoTest" />
      </BrowserRouter>
    );
    expect(screen.getByText(/EcoTest/i)).toBeInTheDocument();
  });

  // Comprobación de enlaces de navegación según estado de autenticación
  it('renders navigation links depending on auth state', () => {
    const { rerender } = render(
      <MemoryRouter>
        <Header title="EcoMetrics" />
      </MemoryRouter>
    );
    expect(screen.getByText(/Inicio/i)).toBeInTheDocument();
    expect(screen.queryByText(/Calculadora/i)).not.toBeInTheDocument();

    // Simulación de navegación con usuario autenticado
    rerender(
      <MemoryRouter>
        <Header title="EcoMetrics" user={{ username: 'testuser' }} setAuth={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Calculadora/i)).toBeInTheDocument();
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
  });
});
