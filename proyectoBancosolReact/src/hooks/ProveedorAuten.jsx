import { useState } from 'react';
// Hook personalizado para acceder al contexto de autenticación
import { ContextoAuten } from './ContextoAuten';

export function ProveedorAuten({ children }) {
  // Estado para almacenar la información del usuario autenticado
  const [usuario, setUsuario] = useState(() => {
    // Refrescar desde almacenamiento local al cargar la página
    const guardado = sessionStorage.getItem('user');
    return guardado ? JSON.parse(guardado) : null;
  });

  // Función para manejar el inicio de sesión
  const login = (userData, token) => {
    console.log('Login called with:', { userData, token });
    // Guardar en sessionStorage para persistencia durante la sesión y actualizar el estado
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('token', token);
    setUsuario(userData);
  };

  // Función para manejar el cierre de sesión
  const logout = () => {
    console.log('Logout called');
    // Eliminar del sessionStorage y actualizar el estado
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUsuario(null);
  };

  return (
    <ContextoAuten.Provider value={{ usuario, estaAutenticado: !!usuario, login, logout }}>
      {children}
    </ContextoAuten.Provider>
  );
}