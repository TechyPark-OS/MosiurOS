import { useState, useEffect } from 'react';
import { useAuth } from '../App';

// Default module access by role
const DEFAULT_MODULE_ACCESS = {
  Admin: [
    'funnels_pages', 'store_products', 'courses_members', 'marketing',
    'crm_sales', 'community_content', 'analytics_tools', 'revenue',
    'infrastructure', 'domains_email', 'security', 'storage',
    'monitoring', 'management'
  ],
  Reseller: [
    'funnels_pages', 'store_products', 'courses_members', 'marketing',
    'crm_sales', 'community_content', 'analytics_tools', 'revenue',
    'infrastructure', 'domains_email', 'security', 'storage', 'monitoring'
  ],
  User: [
    'funnels_pages', 'store_products', 'courses_members', 'marketing',
    'crm_sales', 'community_content', 'analytics_tools'
  ],
  Client: [
    'funnels_pages', 'store_products', 'marketing', 'crm_sales'
  ]
};

export function useModules() {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customAccess, setCustomAccess] = useState(null);

  useEffect(() => {
    if (user) {
      loadModules();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadModules = async () => {
    try {
      const sessionToken = localStorage.getItem('techypark_session');
      if (!sessionToken || !user?.id) {
        // Use default role-based access
        const defaultModules = DEFAULT_MODULE_ACCESS[user?.role] || DEFAULT_MODULE_ACCESS.User;
        setModules(defaultModules);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/users/${user.id}/modules`,
        {
          headers: {
            'Authorization': `Bearer ${sessionToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.modules && Array.isArray(data.modules)) {
          // Custom module access from backend
          const enabledModules = data.modules
            .filter(m => m.enabled)
            .map(m => m.id || m.module_id);
          setModules(enabledModules);
          setCustomAccess(true);
        } else {
          // Fallback to role-based access
          const defaultModules = DEFAULT_MODULE_ACCESS[user?.role] || DEFAULT_MODULE_ACCESS.User;
          setModules(defaultModules);
        }
      } else {
        // Fallback to role-based access on error
        const defaultModules = DEFAULT_MODULE_ACCESS[user?.role] || DEFAULT_MODULE_ACCESS.User;
        setModules(defaultModules);
      }
    } catch (error) {
      console.error('Error loading modules:', error);
      // Fallback to role-based access on error
      const defaultModules = DEFAULT_MODULE_ACCESS[user?.role] || DEFAULT_MODULE_ACCESS.User;
      setModules(defaultModules);
    } finally {
      setLoading(false);
    }
  };

  const hasAccess = (moduleId) => {
    // Admin always has access to everything
    if (user?.role === 'Admin') return true;
    
    // Check if module is in the user's enabled modules list
    return modules.includes(moduleId);
  };

  const getEnabledModules = () => {
    return modules;
  };

  const updateModuleAccess = async (moduleId, enabled) => {
    try {
      const sessionToken = localStorage.getItem('techypark_session');
      if (!sessionToken || !user?.id) return false;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/users/${user.id}/modules`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            moduleId,
            enabled
          })
        }
      );

      if (response.ok) {
        // Reload modules after update
        await loadModules();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating module access:', error);
      return false;
    }
  };

  return {
    modules,
    loading,
    hasAccess,
    getEnabledModules,
    updateModuleAccess,
    customAccess,
    defaultAccess: DEFAULT_MODULE_ACCESS
  };
}
