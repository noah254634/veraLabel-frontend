export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  const backendBase = env.AZURE_BACKEND_URL;
  if (!backendBase) {
    return new Response("Missing Backend Configuration", { status: 500 });
  }
  
  const targetUrl = new URL(url.pathname + url.search, backendBase);
  const headers = new Headers(request.headers);
  
  const proxyRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: "manual"
  });
  
  return fetch(proxyRequest);
}
