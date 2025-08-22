export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`,
      ...(init?.headers || {}) 
    },
    ...init,
  });
  if (!res.ok) {
    let message = 'Request failed';
    try {
      const data = await res.json();
      message = (data && (data.message || data.error)) || message;
    } catch {
      try {
        message = await res.text();
      } catch {}
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}


