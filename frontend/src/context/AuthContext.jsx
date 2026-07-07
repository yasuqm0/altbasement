import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Cargar el perfil del usuario si hay un token guardado
  const fetchProfile = async () => {
    try {
      const response = await api.get('accounts/perfil/');
      setUser(response.data);
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await api.post('accounts/login/', { username, password });
      const { access } = response.data;
      localStorage.setItem('token', access);
      setToken(access);
      
      // Obtener el perfil inmediatamente con el nuevo token
      const profileResponse = await api.get('accounts/perfil/', {
        headers: { Authorization: `Bearer ${access}` }
      });
      setUser(profileResponse.data);
      return { success: true };
    } catch (error) {
      console.error('Error de login:', error);
      const errMsg = error.response?.data?.detail || 'Credenciales inválidas o error de conexión';
      return { success: false, error: errMsg };
    }
  };

  const register = async (username, email, password) => {
    try {
      await api.post('accounts/register/', { username, email, password });
      // Iniciar sesión automáticamente tras el registro exitoso
      return await login(username, password);
    } catch (error) {
      console.error('Error de registro:', error);
      let errMsg = 'Ocurrió un error en el registro';
      if (error.response?.data) {
        const data = error.response.data;
        if (data.username) {
          errMsg = `Usuario: ${Array.isArray(data.username) ? data.username.join(', ') : data.username}`;
        } else if (data.email) {
          errMsg = `Email: ${Array.isArray(data.email) ? data.email.join(', ') : data.email}`;
        } else if (data.password) {
          errMsg = `Contraseña: ${Array.isArray(data.password) ? data.password.join(', ') : data.password}`;
        } else if (data.detail) {
          errMsg = data.detail;
        }
      }
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
