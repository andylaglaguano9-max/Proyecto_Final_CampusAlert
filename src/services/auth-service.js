const BACKEND_URL = 'http://localhost:3001/api';

// Petición de registro de usuario al servidor
export const registerUser = async (username, password) => {
  try {
    const response = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al registrar');
    return data;
  } catch (error) {
    throw error;
  }
};

// Petición de inicio de sesión y validación de credenciales
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al iniciar sesión');
    
    // Almacenamiento de sesión activa en el almacenamiento local del navegador
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (error) {
    throw error;
  }
};

// Eliminación de los datos del almacenamiento local para cierre de sesión
export const logoutUser = () => {
  localStorage.removeItem('user');
};

// Recuperación de los datos del usuario activo si existe una sesión válida
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
