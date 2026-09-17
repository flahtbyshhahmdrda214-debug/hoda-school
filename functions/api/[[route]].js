// Cloudflare Pages / Workers Edge API Router
// Automatically handles /api/* requests on Cloudflare Edge

const ADMIN_USERS = [
  { username: 'superadmin', password: 'Admin@Hoda2026!', role: 'SUPERADMIN', fullName: 'مدیر کل سامانه' },
  { username: 'admin', password: 'Admin@Hoda2026!', role: 'SUPERADMIN', fullName: 'مدیر ارشد مجتمع هدی' },
  { username: 'admin_boyselem', password: 'SchoolAdmin@Hoda2026!', role: 'SCHOOL_ADMIN', fullName: 'مدیر دبستان پسرانه' },
  { username: 'editor_user', password: 'Editor@Hoda2026!', role: 'EDITOR', fullName: 'کارشناس تولید محتوا' }
];

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json; charset=utf-8'
  };

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check
  if (path === '/api/health') {
    return new Response(JSON.stringify({
      success: true,
      data: { status: 'ok', service: 'Hoda Cloudflare Edge API', version: '1.0.0' }
    }), { headers: corsHeaders });
  }

  // Auth: Login
  if (path === '/api/v1/auth/login' && method === 'POST') {
    try {
      const body = await request.json();
      const user = ADMIN_USERS.find(u => (u.username === body.username || u.username === body.identifier) && u.password === body.password);
      if (user) {
        return new Response(JSON.stringify({
          success: true,
          data: {
            user: { id: `cf-${user.username}`, username: user.username, role: user.role, fullName: user.fullName },
            token: 'cf-edge-token-' + Date.now()
          },
          meta: 'ورود موفقیت‌آمیز بود'
        }), {
          headers: {
            ...corsHeaders,
            'Set-Cookie': `access_token=cf-session; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
          }
        });
      }
      return new Response(JSON.stringify({ success: false, message: 'نام کاربری یا رمز عبور اشتباه است' }), { status: 401, headers: corsHeaders });
    } catch {
      return new Response(JSON.stringify({ success: false, message: 'اطلاعات ارسالی نامعتبر است' }), { status: 400, headers: corsHeaders });
    }
  }

  // Auth: Me
  if (path === '/api/v1/auth/me') {
    return new Response(JSON.stringify({
      success: true,
      data: { id: 'cf-superadmin', username: 'superadmin', role: 'SUPERADMIN', fullName: 'مدیر کل سامانه' }
    }), { headers: corsHeaders });
  }

  // Auth: Logout
  if (path === '/api/v1/auth/logout') {
    return new Response(JSON.stringify({ success: true, message: 'خروج با موفقیت انجام شد' }), {
      headers: {
        ...corsHeaders,
        'Set-Cookie': 'access_token=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
    });
  }

  return new Response(JSON.stringify({ success: false, message: 'Not Found on Edge' }), { status: 404, headers: corsHeaders });
}
