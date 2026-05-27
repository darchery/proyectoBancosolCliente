//useAuthHook.jsx
import { useContext } from 'react';
// Hook personalizado para acceder al contexto de autenticación
import { ContextoAuten } from './ContextoAuten';

export const useAuth = () => useContext(ContextoAuten);