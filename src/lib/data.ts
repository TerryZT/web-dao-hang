"use server";

import "server-only";
import type { Category, LinkItem, Settings, AppData } from "@/lib/types";
import fs from "fs/promises";
import path from "path";

// Path to the JSON file
const dataPath = path.join(process.cwd(), "src", "lib", "app-data.json");


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
