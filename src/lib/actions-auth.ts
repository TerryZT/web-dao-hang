'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import type { AppData } from './types';
import { z } from 'zod';

const dataPath = path.join(process.cwd(), 'src', 'lib', 'app-data.json');
const sessionCookieName = 'erin-nav-session';

// IMPORTANT: This file now only handles AUTH, which still uses a JSON file
// for the password hash for simplicity. It does NOT interact with the database.

const readAuthData = async (): Promise<{ adminPasswordHash: string }> => {
  try {
    // This file is a fallback and should be created if it doesn't exist.
    await fs.access(dataPath);
  } catch (error) {
     const defaultData: AppData = {
        settings: { id: 1, title: '', logo: '', copyright: '', searchEnabled: true },
        categories: [],
        adminPasswordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // default: 'password'
      };
    await fs.writeFile(dataPath, JSON.stringify(defaultData, null, 2), 'utf-8');
  }

  const fileContent = await fs.readFile(dataPath, 'utf-8');
  const data = JSON.parse(fileContent);
  return { adminPasswordHash: data.adminPasswordHash };
};

const writeAuthData = async (passwordHash: string): Promise<void> => {
  const fileContent = await fs.readFile(dataPath, 'utf-8');
  const data = JSON.parse(fileContent);
  data.adminPasswordHash = passwordHash;
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
};


function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function login(
  prevState: any,
  formData: FormData
): Promise<{ error?: string }> {
  const password = formData.get('password') as string;

  if (!password) {
    return {
      error: '密码不能为空',
    };
  }

  const { adminPasswordHash } = await readAuthData();
  const inputHash = hashPassword(password);

  if (inputHash === adminPasswordHash) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    cookies().set(sessionCookieName, 'loggedIn', { expires, httpOnly: true });
    redirect('/admin');
  } else {
    return {
      error: '密码错误',
    };
  }
}

export async function logout() {
  cookies().delete(sessionCookieName);
  redirect('/admin/login');
}


const passwordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string().min(6, '新密码至少需要6个字符'),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: '新密码和确认密码不匹配',
    path: ['confirmPassword'],
  });

export async function changePassword(
  formData: FormData
): Promise<{ message: string; type: 'success' | 'error' }> {
  const validatedFields = passwordSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return { message: validatedFields.error.errors[0].message, type: 'error' };
  }

  const { currentPassword, newPassword } = validatedFields.data;
  
  const { adminPasswordHash: storedHash } = await readAuthData();
  const currentHash = hashPassword(currentPassword);

  if (currentHash !== storedHash) {
    return { message: '当前密码不正确。', type: 'error' };
  }

  try {
    const newHash = hashPassword(newPassword);
    await writeAuthData(newHash);
    return { message: '密码修改成功！', type: 'success' };
  } catch (e) {
    const error = e as Error;
    return { message: `密码修改失败: ${error.message}`, type: 'error' };
  }
}
