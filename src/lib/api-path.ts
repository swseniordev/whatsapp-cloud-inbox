const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// URL for this app's own /api routes, called from the browser. It adds the
// Next.js basePath (fetch doesn't add it on its own) and forwards the
// ?instance= the admin opened the inbox with, since every gateway call is
// scoped to that Evolution instance.
export function apiPath(path: string): string {
  const url = new URL(`${BASE_PATH}${path}`, window.location.origin);
  const instance = new URLSearchParams(window.location.search).get('instance');

  if (instance) {
    url.searchParams.set('instance', instance);
  }

  return `${url.pathname}${url.search}`;
}
