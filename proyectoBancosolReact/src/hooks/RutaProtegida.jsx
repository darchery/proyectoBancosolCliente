import { Navigate, Outlet } from 'react-router-dom';
// Ruta protegida que verifica si el usuario está autenticado
import { useAuth } from './useAuthHook';

export function RutaProtegida() {
    // Obtener el estado de autenticación del contexto
    const { estaAutenticado } = useAuth();

    // Si no está autenticado, redirigir al login
    if (!estaAutenticado) {
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado, renderizar el componente hijo (Outlet)
    return <Outlet />;
}