import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(3).optional(),
  username: z.string().min(3).optional(),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
}).refine(data => data.identifier || data.username, {
  message: 'نام کاربری یا ایمیل الزامی است',
  path: ['identifier']
}).transform(data => ({
  identifier: (data.identifier || data.username).trim(),
  password: data.password
}));

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'رمز عبور فعلی الزامی است'),
  newPassword: z.string().min(8, 'رمز عبور جدید باید حداقل ۸ کاراکتر باشد'),
});

export const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email('فرمت ایمیل نامعتبر است'),
  password: z.string().min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
  fullName: z.string().min(2),
  role: z.enum(['SUPERADMIN', 'SCHOOL_ADMIN', 'EDITOR']).default('EDITOR'),
  schoolId: z.string().uuid().optional().nullable(),
});
