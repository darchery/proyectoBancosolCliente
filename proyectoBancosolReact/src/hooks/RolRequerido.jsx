import { Navigate, Outlet } from 'react-router-dom';
// Ruta protegida que verifica si el usuario tiene el puesto requerido
import { useAuth } from './useAuthHook';

export function RolRequerido({ roles }) {
    // Obtener la información del usuario autenticado del contexto
    const { usuario } = useAuth();

    console.log('RolRequerido: usuario =', usuario, 'roles =', roles);

    // Si no hay usuario autenticado, redirigir al login
    if (!usuario) return <Navigate to="/" replace />;
    // Si el rol del usuario no está en la lista de roles permitidos, redirigir a unauthorized
    if (!roles.includes(usuario.rol)) return <Navigate to="/unauthorized" replace />;

    // Si el usuario tiene el rol requerido, renderizar el componente hijo (Outlet)
    return <Outlet />;
}