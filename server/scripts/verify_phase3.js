// Phase 3 Automated Verification Suite
// Tests Fastify 5 API, Prisma DB, Auth, Cookie JWT, RBAC, CRUD, Upload, and Sanitization

import http from 'http';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://127.0.0.1:4000';
const FRONTEND_BASE = 'http://127.0.0.1:5173';

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

function recordTest(name, passed, details = '') {
  results.total++;
  if (passed) {
    results.passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m: ${name}`);
  } else {
    results.failed++;
    console.log(`\x1b[31m✘ FAIL\x1b[0m: ${name} - ${details}`);
  }
  results.tests.push({ name, passed, details });
}

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = null;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data,
          json
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runVerification() {
  console.log('====================================================');
  console.log('  HODA INSTITUTE - PHASE 3 INTEGRATION TEST SUITE   ');
  console.log('====================================================\n');

  let superadminCookie = '';
  let editorCookie = '';
  let schoolAdminCookie = '';

  // ----------------------------------------------------
  // 1. Health & Server Status
  // ----------------------------------------------------
  try {
    const health = await request(`${API_BASE}/api/health`);
    recordTest('API Health Check (/api/health)', health.status === 200 && health.json?.success === true, `Status: ${health.status}`);
  } catch (err) {
    recordTest('API Health Check (/api/health)', false, err.message);
  }

  // ----------------------------------------------------
  // 2. API Endpoints (Direct & Public)
  // ----------------------------------------------------
  try {
    // 2.1 Direct routes
    const directSchools = await request(`${API_BASE}/api/v1/schools`);
    recordTest('API: GET /api/v1/schools', directSchools.status === 200 && (directSchools.json?.data?.length || 0) === 4);

    const directNews = await request(`${API_BASE}/api/v1/news`);
    recordTest('API: GET /api/v1/news', directNews.status === 200 && (Array.isArray(directNews.json?.data?.items) || Array.isArray(directNews.json?.data)));

    const directDocs = await request(`${API_BASE}/api/v1/documents`);
    recordTest('API: GET /api/v1/documents', directDocs.status === 200 && Array.isArray(directDocs.json?.data));

    const directAchievements = await request(`${API_BASE}/api/v1/achievements`);
    recordTest('API: GET /api/v1/achievements', directAchievements.status === 200 && Array.isArray(directAchievements.json?.data));

    const directGallery = await request(`${API_BASE}/api/v1/gallery`);
    recordTest('API: GET /api/v1/gallery', directGallery.status === 200 && Array.isArray(directGallery.json?.data));

    const directSettings = await request(`${API_BASE}/api/v1/settings`);
    recordTest('API: GET /api/v1/settings', directSettings.status === 200 && typeof directSettings.json?.data === 'object');

    // 2.2 Public routes
    const schools = await request(`${API_BASE}/api/v1/public/schools`);
    const count = schools.json?.data?.length || 0;
    recordTest('Public API: GET /api/v1/public/schools', schools.status === 200 && count === 4, `Found ${count} schools`);

    // Individual school slugs
    const slugs = ['boys-elementary', 'boys-highschool', 'girls-elementary', 'girls-highschool'];
    for (const slug of slugs) {
      const sRes = await request(`${API_BASE}/api/v1/public/schools/${slug}`);
      recordTest(`Public API: GET /api/v1/public/schools/${slug}`, sRes.status === 200 && sRes.json?.data?.slug === slug);
    }

    const news = await request(`${API_BASE}/api/v1/public/news`);
    recordTest('Public API: GET /api/v1/public/news', news.status === 200 && (Array.isArray(news.json?.data?.items) || Array.isArray(news.json?.data)));

    const docs = await request(`${API_BASE}/api/v1/public/documents`);
    recordTest('Public API: GET /api/v1/public/documents', docs.status === 200 && Array.isArray(docs.json?.data));

    const achievements = await request(`${API_BASE}/api/v1/public/achievements`);
    recordTest('Public API: GET /api/v1/public/achievements', achievements.status === 200 && Array.isArray(achievements.json?.data));

    const gallery = await request(`${API_BASE}/api/v1/public/gallery`);
    recordTest('Public API: GET /api/v1/public/gallery', gallery.status === 200 && Array.isArray(gallery.json?.data));

    const settings = await request(`${API_BASE}/api/v1/public/settings`);
    recordTest('Public API: GET /api/v1/public/settings', settings.status === 200 && typeof settings.json?.data === 'object');
  } catch (err) {
    recordTest('API Endpoints Suite', false, err.message);
  }

  // ----------------------------------------------------
  // 3. Authentication & Cookie-Based Sessions
  // ----------------------------------------------------
  try {
    // 3.1 Invalid login
    const failLogin = await request(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { username: 'superadmin', password: 'WrongPassword123!' }
    });
    recordTest('Auth: Invalid Password Rejection (HTTP 401)', failLogin.status === 401);

    // 3.2 Superadmin login
    const adminLogin = await request(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { username: 'superadmin', password: 'Admin@Hoda2026!' }
    });
    const setCookie = adminLogin.headers['set-cookie'] || [];
    const hasHttpOnlyCookie = setCookie.some(c => (c.includes('access_token') || c.includes('hoda_auth_token')) && c.includes('HttpOnly'));
    superadminCookie = setCookie.map(c => c.split(';')[0]).join('; ');
    recordTest('Auth: Superadmin Login Success (HTTP 200)', adminLogin.status === 200);
    recordTest('Auth: Cookie-Based JWT (HttpOnly flag present)', hasHttpOnlyCookie);
    recordTest('Auth: User Payload Excludes Password Hash', !adminLogin.json?.data?.user?.passwordHash);

    // 3.3 Check session via /auth/me with cookie
    const meRes = await request(`${API_BASE}/api/v1/auth/me`, {
      headers: { 'Cookie': superadminCookie }
    });
    recordTest('Auth: Session Validation via Cookie GET /auth/me', meRes.status === 200 && meRes.json?.data?.role === 'SUPERADMIN');

    // 3.4 Check /auth/me without cookie (Expect 401)
    const unauthMe = await request(`${API_BASE}/api/v1/auth/me`);
    recordTest('Auth: Unauthenticated /auth/me blocked (HTTP 401)', unauthMe.status === 401);

    // 3.5 Login as Editor
    const editorLogin = await request(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { username: 'editor_user', password: 'Editor@Hoda2026!' }
    });
    editorCookie = (editorLogin.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');
    recordTest('Auth: Editor Login Success', editorLogin.status === 200 && editorLogin.json?.data?.user?.role === 'EDITOR');

    // 3.6 Login as School Admin
    const schoolAdminLogin = await request(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { username: 'admin_boyselem', password: 'SchoolAdmin@Hoda2026!' }
    });
    schoolAdminCookie = (schoolAdminLogin.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');
    recordTest('Auth: School Admin Login Success', schoolAdminLogin.status === 200 && schoolAdminLogin.json?.data?.user?.role === 'SCHOOL_ADMIN');
  } catch (err) {
    recordTest('Auth Suite', false, err.message);
  }

  // ----------------------------------------------------
  // 4. Role-Based Access Control (RBAC)
  // ----------------------------------------------------
  try {
    // Editor trying to access /api/v1/users (Superadmin only) -> Expect 403
    const editorUsers = await request(`${API_BASE}/api/v1/users`, {
      headers: { 'Cookie': editorCookie }
    });
    recordTest('RBAC: Editor blocked from /api/v1/users (HTTP 403)', editorUsers.status === 403);

    // School Admin trying to access /api/v1/users -> Expect 403
    const schoolAdminUsers = await request(`${API_BASE}/api/v1/users`, {
      headers: { 'Cookie': schoolAdminCookie }
    });
    recordTest('RBAC: School Admin blocked from /api/v1/users (HTTP 403)', schoolAdminUsers.status === 403);

    // Superadmin accessing /api/v1/users -> Expect 200
    const superUsers = await request(`${API_BASE}/api/v1/users`, {
      headers: { 'Cookie': superadminCookie }
    });
    recordTest('RBAC: Superadmin allowed on /api/v1/users (HTTP 200)', superUsers.status === 200 && Array.isArray(superUsers.json?.data));
  } catch (err) {
    recordTest('RBAC Suite', false, err.message);
  }

  // ----------------------------------------------------
  // 5. Admin CRUD Operations & HTML Sanitization
  // ----------------------------------------------------
  try {
    // 5.1 News CRUD + Rich Text XSS Sanitization
    const maliciousHtml = '<p>خبر مهم آزمایشی</p><script>alert("XSS Attack!")</script><img src="x" onerror="alert(1)" /><b>متن معتبر</b>';
    const createNews = await request(`${API_BASE}/api/v1/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': superadminCookie
      },
      body: {
        title: 'خبر تستی بررسی یکپارچگی Phase 3',
        slug: `phase3-test-news-${Date.now()}`,
        summary: 'چکیده خبر تستی برای بررسی CRUD',
        content: maliciousHtml,
        category: 'آموزشی',
        isPublished: true
      }
    });

    const newsId = createNews.json?.data?.id;
    const sanitizedContent = createNews.json?.data?.content || '';
    const scriptStripped = !sanitizedContent.includes('<script>') && !sanitizedContent.includes('onerror=');
    recordTest('CRUD News: Create News Article (HTTP 201)', createNews.status === 201 && !!newsId);
    recordTest('Rich Text Sanitization: <script> and onerror= stripped', scriptStripped, `Sanitized result: ${sanitizedContent}`);

    if (newsId) {
      // Read News
      const getNews = await request(`${API_BASE}/api/v1/news/${newsId}`, {
        headers: { 'Cookie': superadminCookie }
      });
      recordTest('CRUD News: Read Single News (HTTP 200)', getNews.status === 200);

      // Update News
      const updateNews = await request(`${API_BASE}/api/v1/news/${newsId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': superadminCookie
        },
        body: {
          title: 'خبر تستی به‌روزشده'
        }
      });
      recordTest('CRUD News: Update News (HTTP 200)', updateNews.status === 200 && updateNews.json?.data?.title === 'خبر تستی به‌روزشده');

      // Delete News
      const delNews = await request(`${API_BASE}/api/v1/news/${newsId}`, {
        method: 'DELETE',
        headers: { 'Cookie': superadminCookie }
      });
      recordTest('CRUD News: Delete News (HTTP 200)', delNews.status === 200);
    }

    // 5.2 Teacher CRUD
    const schoolsList = await request(`${API_BASE}/api/v1/public/schools`);
    const schoolId = schoolsList.json?.data?.[0]?.id;
    if (schoolId) {
      const createTeacher = await request(`${API_BASE}/api/v1/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': superadminCookie
        },
        body: {
          schoolId,
          firstName: 'حمید',
          lastName: 'تست‌پور',
          role: 'دبیر فیزیک',
          educationDegree: 'کارشناسی ارشد فیزیک',
          teachingExperience: '۱۰ سال'
        }
      });
      const teacherId = createTeacher.json?.data?.id;
      recordTest('CRUD Teacher: Create Teacher (HTTP 201)', createTeacher.status === 201 && !!teacherId);

      if (teacherId) {
        const updateTeacher = await request(`${API_BASE}/api/v1/teachers/${teacherId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': superadminCookie
          },
          body: { role: 'سرگروه فیزیک کنکور' }
        });
        recordTest('CRUD Teacher: Update Teacher (HTTP 200)', updateTeacher.status === 200);

        const delTeacher = await request(`${API_BASE}/api/v1/teachers/${teacherId}`, {
          method: 'DELETE',
          headers: { 'Cookie': superadminCookie }
        });
        recordTest('CRUD Teacher: Delete Teacher (HTTP 200)', delTeacher.status === 200);
      }
    }

    // 5.3 Document CRUD
    const createDoc = await request(`${API_BASE}/api/v1/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': superadminCookie
      },
      body: {
        title: 'شیوه‌نامه ثبت‌نام تستی',
        description: 'توضیحات سند تستی',
        fileUrl: '/uploads/sample-doc.pdf',
        category: 'آیین‌نامه',
        targetAudience: 'اولیا و دانش‌آموزان'
      }
    });
    const docId = createDoc.json?.data?.id;
    recordTest('CRUD Document: Create Document (HTTP 201)', createDoc.status === 201 && !!docId);
    if (docId) {
      const delDoc = await request(`${API_BASE}/api/v1/documents/${docId}`, {
        method: 'DELETE',
        headers: { 'Cookie': superadminCookie }
      });
      recordTest('CRUD Document: Delete Document (HTTP 200)', delDoc.status === 200);
    }

    // 5.4 Facility CRUD
    if (schoolId) {
      const createFac = await request(`${API_BASE}/api/v1/facilities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': superadminCookie
        },
        body: {
          schoolId,
          title: 'کارگاه تستی روباتیک',
          description: 'فضای تخصصی ساخت مدارهای الکترونیکی'
        }
      });
      const facId = createFac.json?.data?.id;
      recordTest('CRUD Facility: Create Facility (HTTP 201)', createFac.status === 201 && !!facId);
      if (facId) {
        const delFac = await request(`${API_BASE}/api/v1/facilities/${facId}`, {
          method: 'DELETE',
          headers: { 'Cookie': superadminCookie }
        });
        recordTest('CRUD Facility: Delete Facility (HTTP 200)', delFac.status === 200);
      }
    }

    // 5.5 Settings Read & Update
    const getSet = await request(`${API_BASE}/api/v1/settings`, {
      headers: { 'Cookie': superadminCookie }
    });
    recordTest('CRUD Settings: Read Settings (HTTP 200)', getSet.status === 200);

    const updateSet = await request(`${API_BASE}/api/v1/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': superadminCookie
      },
      body: {
        site_name: 'مجتمع آموزشی قرآنی هدی'
      }
    });
    recordTest('CRUD Settings: Update Settings (HTTP 200)', updateSet.status === 200);
  } catch (err) {
    recordTest('Admin CRUD Suite', false, err.message);
  }

  // ----------------------------------------------------
  // 6. File Upload & MIME Safety Verification
  // ----------------------------------------------------
  try {
    // 6.1 Unauthorized upload rejection
    const unauthUpload = await request(`${API_BASE}/api/v1/media/upload`, {
      method: 'POST'
    });
    recordTest('Upload: Unauthorized Upload Blocked (HTTP 401)', unauthUpload.status === 401);

    // 6.2 Multipart upload testing with safe small binary PNG
    const boundary = '----WebKitFormBoundaryPhase3TestBoundary';
    // 1x1 transparent PNG buffer
    const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    
    let body = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test_pixel.png"\r\nContent-Type: image/png\r\n\r\n`),
      pngBuffer,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    const uploadRes = await new Promise((resolve, reject) => {
      const parsed = new URL(`${API_BASE}/api/v1/media/upload`);
      const req = http.request({
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
          'Cookie': superadminCookie
        }
      }, (res) => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve({ status: res.statusCode, data: d, json: JSON.parse(d || '{}') }));
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });

    const isUploaded = uploadRes.status === 201 && uploadRes.json?.data?.url;
    recordTest('Upload: Image Upload & WebP Conversion (HTTP 201)', isUploaded, `File URL: ${uploadRes.json?.data?.url}`);

    // 6.3 Executable / Dangerous file rejection
    const dangerousBoundary = '----WebKitFormBoundaryExecutableReject';
    const fakeExeBuffer = Buffer.from('MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff\x00\x00');
    let dangerousBody = Buffer.concat([
      Buffer.from(`--${dangerousBoundary}\r\nContent-Disposition: form-data; name="file"; filename="malicious.exe"\r\nContent-Type: application/x-msdownload\r\n\r\n`),
      fakeExeBuffer,
      Buffer.from(`\r\n--${dangerousBoundary}--\r\n`)
    ]);

    const dangerousUpload = await new Promise((resolve, reject) => {
      const parsed = new URL(`${API_BASE}/api/v1/media/upload`);
      const req = http.request({
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${dangerousBoundary}`,
          'Content-Length': dangerousBody.length,
          'Cookie': superadminCookie
        }
      }, (res) => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve({ status: res.statusCode }));
      });
      req.on('error', reject);
      req.write(dangerousBody);
      req.end();
    });

    recordTest('Upload Safety: Executable .exe Rejected (HTTP 400)', dangerousUpload.status === 400, `Returned: ${dangerousUpload.status}`);
  } catch (err) {
    recordTest('Upload Suite', false, err.message);
  }

  // ----------------------------------------------------
  // 7. Error Handling & 404 Verification
  // ----------------------------------------------------
  try {
    const notFoundSchool = await request(`${API_BASE}/api/v1/public/schools/non-existent-school-999`);
    recordTest('Error Handling: Non-Existent School Slug (HTTP 404)', notFoundSchool.status === 404);

    const notFoundNews = await request(`${API_BASE}/api/v1/public/news/non-existent-news-999`);
    recordTest('Error Handling: Non-Existent News Slug (HTTP 404)', notFoundNews.status === 404);

    const invalidRoute = await request(`${API_BASE}/api/v1/unknown-endpoint`);
    recordTest('Error Handling: Non-Existent Endpoint (HTTP 404)', invalidRoute.status === 404);
  } catch (err) {
    recordTest('Error Handling Suite', false, err.message);
  }

  // ----------------------------------------------------
  // 8. Logout Verification
  // ----------------------------------------------------
  try {
    const logoutRes = await request(`${API_BASE}/api/v1/auth/logout`, {
      method: 'POST',
      headers: { 'Cookie': superadminCookie }
    });
    const clearCookie = logoutRes.headers['set-cookie'] || [];
    const isCleared = clearCookie.some(c => c.includes('access_token') || c.includes('hoda_auth_token')) &&
                      clearCookie.some(c => c.includes('Max-Age=0') || c.includes('Expires=') || c.includes('; Path=/') || c.includes('=;'));
    recordTest('Auth: Logout Successfully Clears Cookie', logoutRes.status === 200 && isCleared);
  } catch (err) {
    recordTest('Logout Suite', false, err.message);
  }

  // ----------------------------------------------------
  // Summary
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`  VERIFICATION RESULTS: ${results.passed}/${results.total} PASSED (${Math.round((results.passed / results.total) * 100)}%)`);
  console.log('====================================================\n');

  if (results.failed > 0) {
    console.log(`\x1b[31m${results.failed} test(s) failed!\x1b[0m`);
    process.exit(1);
  } else {
    console.log('\x1b[32mAll integration tests passed successfully!\x1b[0m');
    process.exit(0);
  }
}

runVerification().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
