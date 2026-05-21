import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

interface Props {
  children: ReactNode;
}

// AuthHydrator runs once at app boot to silently restore a session via
// /auth/refresh (which uses the HttpOnly cookie). Children render only after
// the attempt completes so ProtectedRoute does not bounce a returning user to
// /login during the flicker between mount and refresh resolution.
export function AuthHydrator({ children }: Props) {
  // Subscribe to individual fields so callers don't re-render on unrelated
  // store updates (rerender-defer-reads).
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const setToken = useAuthStore((s) => s.setToken);
  const clearToken = useAuthStore((s) => s.clearToken);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { access_token } = await authApi.refresh();
        if (!cancelled) {
          setToken(access_token);
        }
      } catch {
        if (!cancelled) {
          clearToken();
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setToken, clearToken]);

  if (!isHydrated) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <Loader2 size={20} className='animate-spin text-gray-400' />
      </div>
    );
  }
  return <>{children}</>;
}
