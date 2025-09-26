"use server";

import "server-only";
import type { Category, LinkItem, Settings, AdminConfig } from "@/lib/types";
import fs from "fs/promises";
import path from "path";

// Path to the JSON file
const dataPath = path.join(process.cwd(), "src", "lib", "app-data.json");

type AppData = {
  settings: Settings;
  categories: Category[];
  adminPasswordHash: string;
};

// Helper function to read data from the JSON file
const readData = async (): Promise<AppData> => {
  try {
    const fileContent = await fs.readFile(dataPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading data file:", error);
    // Return default structure if file doesn't exist or is corrupted
    return {
      settings: {
        id: 1,
        title: "Erin导航",
        logo: "https://pic1.imgdb.cn/item/6817c79a58cb8da5c8dc723f.png",
        copyright: "© 2024 英语全科启蒙. All Rights Reserved.",
        searchEnabled: true,
      },
      categories: [],
      adminPasswordHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8" // default: 'password'
    };
  }
};

// Helper function to write data to the JSON file
const writeData = async (data: AppData): Promise<void> => {
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing data file:", error);
  }
};

export const getSettings = async (): Promise<Settings> => {
  const data = await readData();
  return data.settings;
};

export const getCategories = async (): Promise<Category[]> => {
  const data = await readData();
  // Ensure links are associated with categories
  const categories = data.categories.map(category => ({
    ...category,
    links: category.links || []
  }));
  return categories;
};


export const getAdminPasswordHash = async (): Promise<string> => {
  const data = await readData();
  return data.adminPasswordHash;
};

// --- Data Mutation Functions ---

export const updateSettings = async (newSettings: Omit<Settings, 'id'>): Promise<void> => {
  const data = await readData();
  data.settings = { ...data.settings, ...newSettings };
  await writeData(data);
};

export const updateAdminPassword = async (newPasswordHash: string): Promise<void> => {
  const data = await readData();
  data.adminPasswordHash = newPasswordHash;
  await writeData(data);
};

export const addCategoryDb = async (category: Omit<Category, 'links'>) => {
    const data = await readData();
    data.categories.push({ ...category, links: [] });
    await writeData(data);
}

export const updateCategoryDb = async (id: string, newName: string) => {
    const data = await readData();
    const category = data.categories.find(c => c.id === id);
    if (category) {
        category.name = newName;
        await writeData(data);
    }
}

export const deleteCategoryDb = async (id: string) => {
    const data = await readData();
    data.categories = data.categories.filter(c => c.id !== id);
    await writeData(data);
}

export const addLinkDb = async (newLink: LinkItem) => {
    const data = await readData();
    const category = data.categories.find(c => c.id === newLink.categoryId);
    if (category) {
        if (!category.links) {
            category.links = [];
        }
        category.links.push(newLink);
        await writeData(data);
    }
}

export const updateLinkDb = async (id: string, linkData: Omit<LinkItem, "id" | "categoryId">) => {
    const data = await readData();
    for (const category of data.categories) {
        const link = category.links.find(l => l.id === id);
        if (link) {
            Object.assign(link, linkData);
            await writeData(data);
            return;
        }
    }
}

export const deleteLinkDb = async (id: string) => {
    const data = await readData();
    data.categories.forEach(category => {
        category.links = category.links.filter(l => l.id !== id);
    });
    await writeData(data);
}
