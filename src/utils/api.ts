/// <reference types="vite/client" />

export interface ApiResponse<T = any> {
  status_code: number;
  msg: string;
  data: T;
  pagination?: {
    page: number;
    page_size: number;
    total: number;
    total_page: number;
  };
}

export class ApiError extends Error {
  status_code: number;
  data?: any;

  constructor(message: string, status_code: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status_code = status_code;
    this.data = data;
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = localStorage.getItem('token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const locale = localStorage.getItem('locale');
  if (locale) {
    headers.set('X-Lang', locale);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const responseText = await response.text();
  let data: any;
  try {
    data = JSON.parse(responseText);
  } catch (err) {
    console.error('Failed to parse response as JSON:', responseText);
    throw new Error(`Failed to parse server response from ${url}. Status: ${response.status}`);
  }

  if (data.status_code !== 0) {
    if (data.status_code === 401) {
      localStorage.removeItem('token');
    }
    throw new ApiError(data.msg || 'An error occurred', data.status_code, data.data);
  }

  return data as ApiResponse<T>;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, body?: any, options?: RequestInit) => 
    request<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
    
  put: <T>(endpoint: string, body?: any, options?: RequestInit) => 
    request<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
    
  patch: <T>(endpoint: string, body?: any, options?: RequestInit) => 
    request<T>(endpoint, { 
      ...options, 
      method: 'PATCH', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
    
  delete: <T>(endpoint: string, options?: RequestInit) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
