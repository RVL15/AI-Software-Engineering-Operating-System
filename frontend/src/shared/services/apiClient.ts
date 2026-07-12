const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("forgemind_token");
  
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${path}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `Request failed with status ${response.status}`);
    }

    return result as ApiResponse<T>;
  } catch (error: any) {
    console.error("API client error:", error);
    return {
      success: false,
      message: error.message || "Network error occurred",
      data: null as any,
      timestamp: new Date().toISOString(),
    };
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestInit) => 
    request<T>(path, { ...options, method: "GET" }),
  
  post: <T>(path: string, body: any, options?: RequestInit) => 
    request<T>(path, { 
      ...options, 
      method: "POST", 
      body: JSON.stringify(body) 
    }),
  
  put: <T>(path: string, body: any, options?: RequestInit) => 
    request<T>(path, { 
      ...options, 
      method: "PUT", 
      body: JSON.stringify(body) 
    }),
  
  delete: <T>(path: string, options?: RequestInit) => 
    request<T>(path, { ...options, method: "DELETE" }),
};
