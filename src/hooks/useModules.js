import { useState, useEffect } from 'react';
import { useAuth } from '../App';

export function useModules() {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadModules();
    }
  }, [user]);

  const loadModules = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/users/${user.id}/modules`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setModules(data.modules || []);
      }
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasAccess = (moduleId) => {
    // Admin has access to everything
    if (user?.role === 'Admin') return true;
    
    // Check if module is enabled for user
    const module = modules.find(m => m.id === moduleId);
    return module ? module.enabled : false;
  };

  const getEnabledModules = () => {
    return modules.filter(m => m.enabled);
  };

  return {
    modules,
    loading,
    hasAccess,
    getEnabledModules
  };
}
