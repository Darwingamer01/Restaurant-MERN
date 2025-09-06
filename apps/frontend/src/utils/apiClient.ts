// apps/frontend/src/utils/apiClient.ts
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

// Core function
async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  let token = localStorage.getItem("accessToken") || undefined;

  const makeRequest = async (t?: string) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: t ? `Bearer ${t}` : "",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  };

  let response = await makeRequest(token);

  if (response.status === 401) {
    // Try refresh
    const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem("accessToken", data.data.accessToken);
      token = data.data.accessToken;
      response = await makeRequest(token); // retry
    } else {
      localStorage.removeItem("accessToken");
    }
  }

  return response;
}

export { fetchWithAuth };

