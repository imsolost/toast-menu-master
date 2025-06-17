const TOAST_API_BASE_URL = process.env.TOAST_API_BASE_URL || "https://ws-sandbox-api.eng.toasttab.com";
const TOAST_CLIENT_ID = process.env.TOAST_CLIENT_ID;
const TOAST_CLIENT_SECRET = process.env.TOAST_CLIENT_SECRET;

// OAuth token storage (in production, use Redis or database)
let accessToken: string | null = null;
let tokenExpiry: number = 0;

export async function getAccessToken(): Promise<string> {
  const now = Date.now();

  // Use cached token if still valid (with 1 minute buffer)
  if (accessToken && tokenExpiry && now < tokenExpiry - 60_000) {
    return accessToken;
  }

  if (!TOAST_CLIENT_ID || !TOAST_CLIENT_SECRET) {
    throw new Error("Toast OAuth credentials missing. Please check TOAST_CLIENT_ID and TOAST_CLIENT_SECRET environment variables.");
  }

  try {
    const tokenResponse = await fetch(`${TOAST_API_BASE_URL}/authentication/v1/authentication/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId: TOAST_CLIENT_ID,
        clientSecret: TOAST_CLIENT_SECRET,
        userAccessType: 'TOAST_MACHINE_CLIENT',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      throw new Error(`Toast OAuth error: ${tokenResponse.status} ${tokenResponse.statusText}. ${JSON.stringify(errorData)}`);
    }

    const response = await tokenResponse.json();
    const { accessToken: newToken, expiresIn } = response.token;
    
    accessToken = newToken;
    tokenExpiry = now + expiresIn * 1000;
    
    return accessToken;
  } catch (error) {
    console.error('Failed to fetch auth token:', error);
    throw error;
  }
}

export async function toastRequest(method: string, endpoint: string, data: any = null) {
  const token = await getAccessToken();
  const restaurantGuid = process.env.RESTAURANT_GUID;
  
  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Toast-Restaurant-External-ID': restaurantGuid || '',
      'Toast-Environment': 'sandbox'
    }
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${TOAST_API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Toast API error: ${response.status} ${response.statusText}. ${errorText}`);
  }

  return {
    data: await response.json(),
    status: response.status
  };
}