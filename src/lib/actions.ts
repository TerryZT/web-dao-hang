'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import type { LinkItem, Settings, Category, AppData } from './types';

const dataPath = path.join(process.cwd(), 'src', 'lib', 'app-data.json');
const sessionCookieName = 'erin-nav-session';

// Helper function to read data from the JSON file
const readData = async (): Promise<AppData> => {
  try {
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // If file doesn't exist or is empty, create it with default data
    if (error.code === 'ENOENT' || error.message.includes('Unexpected end of JSON input')) {
      const defaultData: AppData = {
        settings: {
          id: 1,
          title: 'Erin导航',
          logo: 'https://pic1.imgdb.cn/item/6817c79a58cb8da5c8dc723f.png',
          copyright: '© 2024 英语全科启蒙. All Rights Reserved.',
          searchEnabled: true,
        },
        categories: [],
        adminPasswordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // default: 'password'
      };
      await writeData(defaultData);
      return defaultData;
    }
    console.error('Error reading data file:', error);
    // For other errors, throw to indicate a problem
    throw new Error('Could not read app data.');
  }
};

// Helper function to write data to the JSON file
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
): Promise<{ error?: string; success?: boolean }> {
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

const settingsSchema = z.object({
  title: z.string().min(1, '网站标题不能为空'),
  logo: z.string().url('请输入有效的图片URL').or(z.literal('')),
  copyright: z.string().min(1, '版权信息不能为空'),
  searchEnabled: z.preprocess(val => val === 'on', z.boolean()),
});

export async function saveSettings(
  formData: FormData
): Promise<{ message: string; type: 'success' | 'error' }> {
  const validatedFields = settingsSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validatedFields.success) {
    return {
      message: validatedFields.error.errors[0].message,
      type: 'error',
    };
  }

  try {
    const data = await readData();
    data.settings = { ...data.settings, ...validatedFields.data };
    await writeData(data);
    return { message: '设置已成功保存！', type: 'success' };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : '保存设置失败。';
    return { message: errorMessage, type: 'error' };
  }
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
    return { message: '密码修改失败。', type: 'error' };
  }
}

// Category Actions
export async function addCategory(name: string) {
  const data = await readData();
  const newCategory: Category = {
    id: `cat-${Date.now()}`,
    name,
    links: [],
  };
  data.categories.push(newCategory);
  await writeData(data);
}

export async function updateCategory(id: string, newName: string) {
  const data = await readData();
  const category = data.categories.find(c => c.id === id);
  if (category) {
    category.name = newName;
    await writeData(data);
  }
}

export async function deleteCategory(id: string) {
  const data = await readData();
  data.categories = data.categories.filter(c => c.id !== id);
  await writeData(data);
}

// Link Actions
export async function addLink(
  categoryId: string,
  linkData: Omit<LinkItem, 'id' | 'categoryId'>
) {
  const data = await readData();
  const category = data.categories.find(c => c.id === categoryId);
  if (category) {
    const newLink: LinkItem = { ...linkData, id: `link-${Date.now()}`, categoryId };
    if (!category.links) {
      category.links = [];
    }
    category.links.push(newLink);
    await writeData(data);
  }
}

export async function updateLink(
  linkId: string,
  linkData: Omit<LinkItem, 'id' | 'categoryId'>
) {
  const data = await readData();
  for (const category of data.categories) {
    const linkIndex = category.links.findIndex(l => l.id === linkId);
    if (linkIndex !== -1) {
      category.links[linkIndex] = { ...category.links[linkIndex], ...linkData };
      await writeData(data);
      return;
    }
  }
}

export async function deleteLink(linkId: string) {
  const data = await readData();
  data.categories.forEach(category => {
    if (category.links) {
        category.links = category.links.filter(l => l.id !== linkId);
    }
  });
  await writeData(data);
}
