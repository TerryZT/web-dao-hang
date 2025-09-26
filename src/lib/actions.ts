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
    if ((error as NodeJS.ErrnoException).code === 'ENOENT' || error instanceof SyntaxError) {
      const defaultData: AppData = {
        settings: {
          id: 1,
          title: '英语全科启蒙网站导航',
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

// --- Auth Actions ---

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

// --- Data Actions ---

export async function saveAllCategories(categories: Category[]) {
    try {
        const data = await readData();
        data.categories = categories;
        await writeData(data);
        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true };
    } catch(e) {
        const error = e as Error;
        return { error: error.message };
    }
}

export async function saveSettings(settings: Settings) {
    try {
        const data = await readData();
        data.settings = settings;
        await writeData(data);
        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true };
    } catch(e) {
        const error = e as Error;
        return { error: error.message };
    }
}
