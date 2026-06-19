const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");

export const getApiBaseUrl = () => {
  const override = typeof window !== 'undefined' ? localStorage.getItem("API_URL_OVERRIDE")?.trim() : null;
  if (override) {
    return `${normalizeBaseUrl(override)}/api/v1`;
  }

  if (import.meta.env.PROD) {
    return "/api/v1";
  }

  const configuredBase = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!configuredBase) {
    return "/api/v1";
  }

  return `${normalizeBaseUrl(configuredBase)}/api/v1`;
};

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
};