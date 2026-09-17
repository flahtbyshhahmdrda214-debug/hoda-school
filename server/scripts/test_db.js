import { prisma } from '../src/services/prisma.service.js';

async function run() {
  const counts = {
    users: await prisma.user.count(),
    schools: await prisma.school.count(),
    teachers: await prisma.teacher.count(),
    staff: await prisma.staff.count(),
    facilities: await prisma.facility.count(),
    news: await prisma.news.count(),
    achievements: await prisma.achievement.count(),
    documents: await prisma.document.count(),
    gallery: await prisma.gallery.count(),
    settings: await prisma.setting.count(),
  };
  console.log('RECORD_COUNTS:', JSON.stringify(counts));
  const admin = await prisma.user.findFirst({ where: { role: 'SUPERADMIN' }, select: { id: true, username: true, role: true, fullName: true, email: true } });
  console.log('SUPERADMIN:', JSON.stringify(admin));
  await prisma.();
}
run();
