// Password gate for the whole site (page, manual, screenshots and chat).
// Set SITE_USERNAME and SITE_PASSWORD in Vercel → Settings → Environment Variables.
// If they are not set, the site is open to anyone with the link.
export const config = { matcher: '/:path*' };

export default function middleware(request) {
  const user = process.env.SITE_USERNAME;
  const pass = process.env.SITE_PASSWORD;
  if (!user || !pass) return; // no gate configured

  const header = request.headers.get('authorization') || '';
  if (header.startsWith('Basic ')) {
    try {
      const [u, ...rest] = atob(header.slice(6)).split(':');
      if (u === user && rest.join(':') === pass) return; // allowed: continue to the page
    } catch (e) { /* fall through */ }
  }
  return new Response('Sign in to use InCred LeadSquared Help.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="InCred LeadSquared Help", charset="UTF-8"' }
  });
}
