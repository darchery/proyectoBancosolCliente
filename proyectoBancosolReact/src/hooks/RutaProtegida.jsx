import { Navigate, Outlet } from 'react-router';
// Ruta protegida que verifica si el usuario está autenticado
import { useAuth } from './useAuth';

export function ProtectedRoute() {
    // Obtener el estado de autenticación del contexto
    const { estaAutenticado } = useAuth();

    // Si no está autenticado, redirigir al login
    if (!estaAutenticado) {
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado, renderizar el componente hijo (Outlet)
    return <Outlet />;
}