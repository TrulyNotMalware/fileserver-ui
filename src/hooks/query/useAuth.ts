import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const authKeys = {
  publicKey: ['auth', 'public-key'] as const,
};

async function encryptPassword(
  password: string,
  pemPublicKey: string,
): Promise<string> {
  const pem = pemPublicKey.replace(/-----.*?-----/g, '').replace(/\s/g, '');
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    'spki',
    der,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt'],
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    key,
    new TextEncoder().encode(password),
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

export function usePublicKey() {
  return useQuery({
    queryKey: authKeys.publicKey,
    queryFn: authApi.getPublicKey,
    staleTime: Infinity,
  });
}

export function useLogin() {
  const { setToken } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const { public_key } = await authApi.getPublicKey();
      const encryptedPassword = await encryptPassword(password, public_key);
      return authApi.login({ username, password: encryptedPassword });
    },
    onSuccess: ({ access_token }) => {
      setToken(access_token);
    },
  });
}

export function useLogout() {
  const { clearToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearToken();
      queryClient.clear();
    },
  });
}

export function useRefresh() {
  const { setToken } = useAuthStore();

  return useMutation({
    mutationFn: authApi.refresh,
    onSuccess: ({ access_token }) => {
      setToken(access_token);
    },
  });
}
