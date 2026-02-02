import { getApiBaseUrl } from './config';

export type ApiError = {
  code: string;
  message: string;
  correlationId?: string | null;
};

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${getApiBaseUrl()}${path}`);
  if (res.ok) {
    return (await res.json()) as T;
  }

  try {
    const body = await res.json();
    const err = body?.error;
    throw new Error(err?.message ?? 'Request failed');
  } catch {
    throw new Error('Request failed');
  }
}

export async function apiPost<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    return (await res.json()) as T;
  }

  const body = await res.json();
  const error = new Error(body?.error?.message ?? 'Request failed') as Error & {
    response?: { status: number; data: unknown };
  };
  error.response = { status: res.status, data: body };
  throw error;
}
