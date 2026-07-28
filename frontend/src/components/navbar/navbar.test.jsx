import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Navbar from './navbar';

describe('Navbar Component', () => {
  it('renders the logo correctly', () => {
    render(
      <BrowserRouter>
        <Navbar isAuthenticated={false} setIsAuthenticated={() => {}} />
      </BrowserRouter>
    );
    
    const logoText = screen.getByText(/CampusAlert/i);
    expect(logoText).toBeInTheDocument();
  });

  it('shows Login button when not authenticated', () => {
    render(
      <BrowserRouter>
        <Navbar isAuthenticated={false} setIsAuthenticated={() => {}} />
      </BrowserRouter>
    );
    
    const loginButton = screen.getByRole('link', { name: /Iniciar Sesión/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('shows Logout button when authenticated', async () => {
    render(
      <BrowserRouter>
        <Navbar isAuthenticated={true} setIsAuthenticated={() => {}} />
      </BrowserRouter>
    );
    
    // First, open the dropdown
    const userButton = screen.getByRole('button', { name: /Usuario/i });
    fireEvent.click(userButton);
    
    const logoutButton = await screen.findByRole('button', { name: /Cerrar sesión/i });
    expect(logoutButton).toBeInTheDocument();
  });
});
