import type { Category, Settings } from './types';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'app-data.json');

type AppData = {
  settings: Settings;
  categories: Category[];
  adminPasswordHash: string;
};

const defaultData: AppData = {
  settings: {
    logo: 'E',
    title: 'Erin导航',
    copyright: `© ${new Date().getFullYear()} Erin导航. All Rights Reserved.`,
    searchEnabled: true,
  },
  categories: [
    {
      id: 'cat-1',
      name: '常用工具',
      links: [
        { id: 'link-1-1', name: 'Google', url: 'https://google.com', description: '全球最大的搜索引擎' },
        { id: 'link-1-2', name: 'GitHub', url: 'https://github.com', description: '代码托管与协作平台' },
        { id: 'link-1-3', name: 'Vercel', url: 'https://vercel.com', description: '前端应用部署平台' },
        { id: 'link-1-4', name: 'ChatGPT', url: 'https://chat.openai.com', description: '人工智能聊天机器人' },
      ],
    },
    {
      id: 'cat-2',
      name: '设计资源',
      links: [
        { id: 'link-2-1', name: 'Figma', url: 'https://figma.com', description: '协作式界面设计工具' },
        { id: 'link-2-2', name: 'Dribbble', url: 'https://dribbble.com', description: '设计师作品分享平台' },
        { id: 'link-2-3', name: 'Unsplash', url: 'https://unsplash.com', description: '免费高质量图片库' },
        { id: 'link-2-4', name: 'Icons8', url: 'https://icons8.com', description: '海量免费图标和插图' },
      ],
    },
     {
      id: 'cat-3',
      name: '开发者社区',
      links: [
        { id: 'link-3-1', name: 'Stack Overflow', url: 'https://stackoverflow.com', description: '程序员问答社区' },
        { id: 'link-3-2', name: 'Medium', url: 'https://medium.com', description: '技术文章和博客平台' },
        { id: 'link-3-3', name: 'Dev.to', url: 'https://dev.to', description: '开发者交流社区' },
      ],
    },
  ],
  adminPasswordHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", // Default password: "password"
};

async function readData(): Promise<AppData> {
  try {
    await fs.access(dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // File doesn't exist or is invalid, write default data and return it
    await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
}

async function writeData(data: AppData): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export const getSettings = async (): Promise<Settings> => {
  const data = await readData();
  return data.settings;
};

export const getCategories = async (): Promise<Category[]> => {
  const data = await readData();
  return data.categories;
};

export const getAdminPasswordHash = async (): Promise<string> => {
    const data = await readData();
    return data.adminPasswordHash;
}

export const updateSettings = async (newSettings: Settings): Promise<Settings> => {
    const data = await readData();
    data.settings = newSettings;
    await writeData(data);
    return data.settings;
}

export const updateCategories = async (newCategories: Category[]): Promise<Category[]> => {
    const data = await readData();
    data.categories = newCategories;
    await writeData(data);
    return data.categories;
}

export const updateAdminPassword = async (newPasswordHash: string): Promise<void> => {
    const data = await readData();
    data.adminPasswordHash = newPasswordHash;
    await writeData(data);
}
