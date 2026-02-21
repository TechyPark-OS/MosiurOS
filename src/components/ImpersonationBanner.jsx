import { AlertCircle, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function ImpersonationBanner() {
  const [isImpersonating, setIsImpersonating] = useState(
    !!localStorage.getItem('impersonationToken')
  );

  const exitImpersonation = async () => {
    try {
      const impToken = localStorage.getItem('impersonationToken');
      const originalToken = localStorage.getItem('originalToken');

      if (impToken && originalToken) {
        // End impersonation session on backend
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/impersonate/end`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${originalToken}`
          },
          body: JSON.stringify({ impersonationToken: impToken })
        });

        // Restore original token
        localStorage.setItem('token', originalToken);
        localStorage.removeItem('impersonationToken');
        localStorage.removeItem('originalToken');

        // Redirect to admin dashboard
        window.location.href = '/dashboard/admin';
      }
    } catch (error) {
      console.error('Error ending impersonation:', error);
      // Force exit anyway
      const originalToken = localStorage.getItem('originalToken');
      if (originalToken) {
        localStorage.setItem('token', originalToken);
        localStorage.removeItem('impersonationToken');
        localStorage.removeItem('originalToken');
        window.location.href = '/dashboard/admin';
      }
    }
  };

  if (!isImpersonating) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-2 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        <span className="font-medium">
          You are currently viewing this account as an administrator
        </span>
      </div>
      <button
        onClick={exitImpersonation}
        className="flex items-center gap-2 px-4 py-1.5 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium"
      >
        <LogOut className="w-4 h-4" />
        Exit Impersonation
      </button>
    </div>
  );
}
