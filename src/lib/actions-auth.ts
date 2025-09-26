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

const readData = async (): Promise<AppData> => {
  try {
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading data file:', error);
    throw new Error('Could not read app data.');
  }
};

const writeData = async (data: AppData): Promise<void> => {
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data file:', error);
    throw new Error('Could not write app data.');
  }
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

  const data = await readData();
  const storedHash = data.adminPasswordHash;
  const inputHash = hashPassword(password);

  if (inputHash === storedHash) {
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
  prevState: any,
  formData: FormData
): Promise<{ message: string; type: 'success' | 'error' }> {
  const validatedFields = passwordSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return { message: validatedFields.error.errors[0].message, type: 'error' };
  }

  const { currentPassword, newPassword } = validatedFields.data;
  
  const data = await readData();
  const storedHash = data.adminPasswordHash;
  const currentHash = hashPassword(currentPassword);

  if (currentHash !== storedHash) {
    return { message: '当前密码不正确。', type: 'error' };
  }

  try {
    const newHash = hashPassword(newPassword);
    data.adminPasswordHash = newHash;
    await writeData(data);
    return { message: '密码修改成功！', type: 'success' };
  } catch (e) {
    const error = e as Error;
    return { message: `密码修改失败: ${error.message}`, type: 'error' };
  }
}
