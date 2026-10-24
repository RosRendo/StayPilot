const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('staypilot_token') : null;
  const hotelId = typeof window !== 'undefined' ? localStorage.getItem('staypilot_hotel_id') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (hotelId) {
    headers['x-hotel-id'] = hotelId;
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${res.statusText}`);
    }

    return await res.json();
  } catch (error: any) {
    console.warn(`API call failed to ${endpoint}, falling back or throwing`, error.message);
    throw error;
  }
}
