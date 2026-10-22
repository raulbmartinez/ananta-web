// La web se abre por defecto en inglés: la primera visita a una página en español redirige
// a su versión en inglés, una sola vez por visitante (se recuerda con la cookie ananta_lang)
// y sin afectar a buscadores. El enlace "ES" añade ?intl=es, que guarda la preferencia por
// el español (ver assets/js/main.js) para que no vuelva a redirigir.
const ES_TO_EN = {
  '/': '/en/index.html',
  '/index.html': '/en/index.html',
  '/compania.html': '/en/compania.html',
  '/negocio.html': '/en/negocio.html',
  '/productos.html': '/en/productos.html',
  '/blog.html': '/en/blog.html',
  '/contacto.html': '/en/contacto.html',
  '/area-privada.html': '/en/area-privada.html',
  '/blog-post.html': '/en/blog-post.html',
};

const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|preview|lighthouse|pingdom|uptime/i;

export const config = {
  matcher: [
    '/',
    '/index.html',
    '/compania.html',
    '/negocio.html',
    '/productos.html',
    '/blog.html',
    '/contacto.html',
    '/area-privada.html',
    '/blog-post.html',
  ],
};

export default function middleware(request) {
  const url = new URL(request.url);

  if (url.searchParams.get('intl') === 'es') return;

  const cookieHeader = request.headers.get('cookie') || '';
  if (/(?:^|;\s*)ananta_lang=/.test(cookieHeader)) return;

  const ua = request.headers.get('user-agent') || '';
  if (BOT_RE.test(ua)) return;

  const target = ES_TO_EN[url.pathname];
  if (!target) return;

  const redirectUrl = new URL(target, url.origin);
  redirectUrl.search = url.search;

  return new Response(null, {
    status: 307,
    headers: {
      Location: redirectUrl.toString(),
      'Set-Cookie': 'ananta_lang=en; Path=/; Max-Age=31536000; SameSite=Lax',
    },
  });
}
