/**
 * Centralized API Client for Locora.
 * Handles typed HTTP requests, baseUrl configuration, error formatting,
 * and seamless fallback to mock services when VITE_USE_MOCK_API is active.
 */

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  public status: number;
  public details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// Configurable through Vite environment variables
const API_BASE_URL = (import.meta as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL || '/api';
const USE_MOCK_API = (import.meta as { env?: { VITE_USE_MOCK_API?: string } }).env?.VITE_USE_MOCK_API === 'true';

export const isDemoMode = (): boolean => USE_MOCK_API;
export const getApiBaseUrl = (): string => API_BASE_URL;

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${cleanPath}`, window.location.origin);

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          url.searchParams.append(key, String(val));
        }
      });
    }

    return url.toString();
  }

  public async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers = {}, ...customConfig } = options;
    const url = this.buildUrl(path, params);

    const token = localStorage.getItem('locora_auth_token');
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    };

    try {
      const response = await fetch(url, {
        headers: defaultHeaders,
        ...customConfig,
      });

      if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        let details: unknown;
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.message || errorMessage;
          details = errorBody;
        } catch {
          // Response body was not JSON
        }
        throw new ApiError(errorMessage, response.status, details);
      }

      if (response.status === 204) {
        return null as unknown as T;
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(err instanceof Error ? err.message : 'Network request failed', 0, err);
    }
  }

  public get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(path, { method: 'GET', params });
  }

  public post<T>(path: string, body?: unknown, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      params,
    });
  }

  public patch<T>(path: string, body?: unknown, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      params,
    });
  }

  public delete<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(path, { method: 'DELETE', params });
  }
}

export const apiClient = new ApiClient();
