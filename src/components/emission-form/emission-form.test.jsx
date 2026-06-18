import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EmissionForm from './emission-form';

describe('EmissionForm Component', () => {
  it('calls onSubmit with correct values', () => {
    const mockSubmit = vi.fn();
    render(<EmissionForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Consumo Eléctrico/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Combustible/i), { target: { value: '10' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Calcular Emisiones/i }));
    
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith({
      kwh: 100,
      gallons: 10,
      gas: 0,
      waste: 0,
      flights: 0
    });
  });

  it('shows error if negative values are provided', () => {
    const mockSubmit = vi.fn();
    render(<EmissionForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Consumo Eléctrico/i), { target: { value: '-10' } });
    fireEvent.change(screen.getByLabelText(/Combustible/i), { target: { value: '10' } });
    
    const form = screen.getByRole('button', { name: /Calcular Emisiones/i }).closest('form');
    fireEvent.submit(form);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
