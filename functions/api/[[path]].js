export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Fallback to VITE_API_BASE_URL since it might already be configured in Cloudflare
  const backendBase = env.AZURE_BACKEND_URL || env.VITE_API_BASE_URL;
  if (!backendBase) {
    return new Response("Missing Backend Configuration - Please set AZURE_BACKEND_URL or VITE_API_BASE_URL in Cloudflare Pages", { status: 500 });
  }

  const targetUrl = new URL(url.pathname + url.search, backendBase);
  const headers = new Headers(request.headers);

  if (request.cf) {
    headers.set('x-cloudflare-country', request.cf.country || '');
    headers.set('x-cloudflare-city', request.cf.city || '');
  }
  headers.set('x-cloudflare-ip', request.headers.get('cf-connecting-ip') || '');

  const proxyRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: "manual"
  });

  return fetch(proxyRequest);
}
