const BASE_URL = import.meta.env.VITE_API_URL;

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

interface HttpOptions extends RequestInit {
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function saveTokens(
  accessToken: string,
  refreshToken: string,
) {
  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    accessToken,
  );

  localStorage.setItem(
    REFRESH_TOKEN_KEY,
    refreshToken,
  );
}

function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  const response = await fetch(
    `${BASE_URL}/auth/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
      }),
    },
  );

  if (!response.ok) {
    clearTokens();

    return null;
  }

  const data =
    (await response.json()) as RefreshResponse;

  saveTokens(
    data.accessToken,
    data.refreshToken,
  );

  return data.accessToken;
}

export async function http<T>(
  path: string,
  options: HttpOptions = {},
): Promise<T> {
  const {
    skipAuth = false,
    skipRefresh = false,
    ...requestOptions
  } = options;

  const headers = new Headers(
    requestOptions.headers,
  );

  headers.set(
    "Content-Type",
    "application/json",
  );

  const accessToken = getAccessToken();

  if (!skipAuth && accessToken) {
    headers.set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }

  let response = await fetch(
    `${BASE_URL}${path}`,
    {
      ...requestOptions,
      headers,
    },
  );

  if (
    response.status === 401 &&
    !skipRefresh
  ) {
    const newAccessToken =
      await refreshAccessToken();

    if (newAccessToken) {
      headers.set(
        "Authorization",
        `Bearer ${newAccessToken}`,
      );

      response = await fetch(
        `${BASE_URL}${path}`,
        {
          ...requestOptions,
          headers,
        },
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}