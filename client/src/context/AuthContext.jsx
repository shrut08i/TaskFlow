import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    setUser(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const startSessionTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const loginTime = parseInt(localStorage.getItem('loginTime') || '0', 10);
    const elapsed = Date.now() - loginTime;
    const remaining = SESSION_TIMEOUT - elapsed;

    if (remaining <= 0) {
      logout();
      return;
    }

    timerRef.current = setTimeout(() => {
      alert('Session expired. You will be logged out.');
      logout();
      window.location.href = '/login';
    }, remaining);
  }, [logout]);

  const resetActivity = useCallback(() => {
    localStorage.setItem('loginTime', Date.now().toString());
    startSessionTimer();
  }, [startSessionTimer]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const loginTime = parseInt(localStorage.getItem('loginTime') || '0', 10);
      if (loginTime && Date.now() - loginTime > SESSION_TIMEOUT) {
        logout();
        setLoading(false);
        return;
      }

      API.get('/auth/me')
        .then(({ data }) => {
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
          startSessionTimer();
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetActivity));

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, resetActivity]);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('loginTime', Date.now().toString());
    setUser(data.user);
    startSessionTimer();
    return data;
  };

  const signup = async (name, email, password, role) => {
    const { data } = await API.post('/auth/signup', { name, email, password, role });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('loginTime', Date.now().toString());
    setUser(data.user);
    startSessionTimer();
    return data;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
