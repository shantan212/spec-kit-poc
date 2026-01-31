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
