"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  getAdminPasswordHash,
  getCategories,
  getSettings,
  updateAdminPassword,
  updateSettings,
  addCategoryDb,
  updateCategoryDb,
  deleteCategoryDb,
  addLinkDb,
  updateLinkDb,
  deleteLinkDb,
} from "./data";
import type { Category, LinkItem, Settings } from "./types";
import crypto from "crypto";

const sessionCookieName = "erin-nav-session";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const loginSchema = z.object({
  password: z.string().min(1, "密码不能为空"),
});

export async function login(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors[0].message,
    };
  }
  
  const { password } = validatedFields.data;
  const storedHash = await getAdminPasswordHash();
  const inputHash = hashPassword(password);

  if (inputHash === storedHash) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    cookies().set(sessionCookieName, "loggedIn", { expires, httpOnly: true });
    return { success: true };
  } else {
    return {
      error: "密码错误",
    };
  }
}

export async function logout() {
  cookies().delete(sessionCookieName);
  redirect("/admin/login");
}

const settingsSchema = z.object({
  title: z.string().min(1, "网站标题不能为空"),
  logo: z.string().min(1, "Logo文本不能为空"),
  copyright: z.string().min(1, "版权信息不能为空"),
  searchEnabled: z.preprocess((val) => val === "on", z.boolean()),
});

export async function saveSettings(
  formData: FormData
): Promise<{ message: string, type: 'success' | 'error' } | undefined> {
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
    await updateSettings(validatedFields.data);
    revalidatePath('/');
    revalidatePath('/admin');
    return { message: "设置已成功保存！", type: 'success' };
  } catch (e) {
    return { message: "保存设置失败。", type: 'error' };
  }
}


const passwordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(6, "新密码至少需要6个字符"),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "新密码和确认密码不匹配",
    path: ["confirmPassword"],
});


export async function changePassword(
  prevState: { message: string, type: 'success' | 'error' } | undefined,
  formData: FormData
) {
    const validatedFields = passwordSchema.safeParse(Object.fromEntries(formData.entries()));

    if(!validatedFields.success) {
        return { message: validatedFields.error.errors[0].message, type: 'error' };
    }
    
    const { currentPassword, newPassword } = validatedFields.data;
    
    const storedHash = await getAdminPasswordHash();
    const currentHash = hashPassword(currentPassword);

    if (currentHash !== storedHash) {
        return { message: "当前密码不正确。", type: 'error' };
    }

    try {
        const newHash = hashPassword(newPassword);
        await updateAdminPassword(newHash);
        return { message: "密码修改成功！", type: 'success' };
    } catch (e) {
        return { message: "密码修改失败。", type: 'error' };
    }
}


// Category Actions
export async function addCategory(name: string) {
  const newCategory = {
    id: `cat-${Date.now()}`,
    name,
  };
  await addCategoryDb(newCategory);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateCategory(id: string, newName: string) {
  await updateCategoryDb(id, newName);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteCategory(id: string) {
  await deleteCategoryDb(id);
  revalidatePath("/");
  revalidatePath("/admin");
}

// Link Actions
export async function addLink(categoryId: string, linkData: Omit<LinkItem, "id">) {
  const newLink: LinkItem = { ...linkData, id: `link-${Date.now()}`, categoryId };
  await addLinkDb(newLink);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateLink(linkId: string, linkData: Omit<LinkItem, "id">) {
  await updateLinkDb(linkId, linkData);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteLink(linkId: string) {
  await deleteLinkDb(linkId);
  revalidatePath("/");
  revalidatePath("/admin");
}
