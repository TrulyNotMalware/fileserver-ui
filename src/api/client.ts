import { useAuthStore } from '@/stores/authStore';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

let refreshPromise: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        return null;
      }
      const { access_token } = await res.json();
      useAuthStore.getState().setToken(access_token);
      return access_token;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function forceLogout() {
  useAuthStore.getState().clearToken();
  window.location.href = '/login';
}

function buildHeaders(
  token: string | null,
  isFormData: boolean,
  extra?: HeadersInit,
) {
  return {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function fetchRaw(
  path: string,
  options?: RequestInit,
): Promise<Response> {
  const token = useAuthStore.getState().accessToken;
  const isFormData = options?.body instanceof FormData;

  return fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: buildHeaders(token, isFormData, options?.headers),
  });
}

// ─── Public API ────────────────────────────────────────────────────────────

/** JSON 요청. 401 시 refresh → 재시도, refresh 도 실패하면 로그아웃 */
export async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  // /auth/* 는 refresh 루프 방지를 위해 그대로 처리
  const isAuthPath = path.startsWith('/auth/');

  let res = await fetchRaw(path, options);

  if (res.status === 401 && !isAuthPath) {
    const newToken = await tryRefresh();
    if (!newToken) {
      forceLogout();
      throw new ApiError(401, 'Session expired');
    }
    // 새 토큰으로 재시도
    res = await fetchRaw(path, options);
  }

  if (res.status === 204) {
    return null as T;
  }
  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

/** 파일 Blob 다운로드. 401 시 동일하게 refresh → 재시도 */
export async function download(
  path: string,
): Promise<{ blob: Blob; filename: string }> {
  const token = useAuthStore.getState().accessToken;

  let res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (res.status === 401) {
    const newToken = await tryRefresh();
    if (!newToken) {
      forceLogout();
      throw new ApiError(401, 'Session expired');
    }
    res = await fetch(`${BASE_URL}${path}`, {
      credentials: 'include',
      headers: { Authorization: `Bearer ${newToken}` },
    });
  }

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, message);
  }

  const disposition = res.headers.get('Content-Disposition') ?? '';
  const match = disposition.match(/filename="?([^"]+)"?/);
  const filename = match?.[1] ?? 'download';
  const blob = await res.blob();

  return { blob, filename };
}
