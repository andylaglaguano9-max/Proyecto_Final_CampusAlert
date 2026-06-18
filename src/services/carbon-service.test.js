import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateEmissions } from './carbon-service';
import * as dbService from './database-service';

// Mock de fetch global
global.fetch = vi.fn();

// Mock del servicio de base de datos
vi.mock('./database-service', () => ({
  guardarCalculo: vi.fn(),
  obtenerHistorial: vi.fn()
}));

describe('Carbon Service (Lógica Matemática y API)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calcula las emisiones correctamente con fetch exitoso y algoritmo de mitigación', async () => {
    // Simulando que la API devuelve 400 g/kWh -> 0.4 kg/kWh
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [{ intensity: { actual: 400 } }] })
    });
    
    // Simulando retorno de Supabase
    dbService.guardarCalculo.mockImplementation(async (record) => ({ ...record, id: '123' }));

    // kWh = 100, Galones = 10
    // E_total = (100 * 0.4) + (10 * 10.15) = 40 + 101.5 = 141.5
    // Arboles = Ceil(141.5 / 22) = Ceil(6.43) = 7
    const result = await calculateEmissions({ kwh: 100, gallons: 10 });
    
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.totalEmissions).toBeCloseTo(141.5);
    expect(result.treesNeeded).toBe(7);
    expect(dbService.guardarCalculo).toHaveBeenCalledWith({
      kwh: 100,
      gallons: 10,
      gas: 0,
      waste: 0,
      flights: 0,
      totalEmissions: 141.5,
      treesNeeded: 7
    });
  });

  it('usa fallback si fetch falla y calcula árboles con Ceil', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    dbService.guardarCalculo.mockImplementation(async (record) => ({ ...record, id: '124' }));

    // Fallback = 0.45 kg/kWh
    // E_total = (100 * 0.45) + (10 * 10.15) = 45 + 101.5 = 146.5
    // Arboles = Ceil(146.5 / 22) = Ceil(6.65) = 7
    const result = await calculateEmissions({ kwh: 100, gallons: 10 });
    
    expect(result.totalEmissions).toBeCloseTo(146.5);
    expect(result.treesNeeded).toBe(7);
  });
});
