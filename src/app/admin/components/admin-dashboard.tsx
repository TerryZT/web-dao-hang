"use client";

import type { Category, Settings } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkManager } from "./link-manager";
import { SettingsManager } from "./settings-manager";

interface AdminDashboardProps {
  initialSettings: Settings;
  initialCategories: Category[];
}

export function AdminDashboard({ initialSettings, initialCategories }: AdminDashboardProps) {
  return (
    <Tabs defaultValue="links" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
        <TabsTrigger value="links">链接管理</TabsTrigger>
        <TabsTrigger value="settings">网站设置</TabsTrigger>
      </TabsList>
      <TabsContent value="links">
        <LinkManager initialCategories={initialCategories} />
      </TabsContent>
      <TabsContent value="settings">
        <SettingsManager initialSettings={initialSettings} />
      </TabsContent>
    </Tabs>
  );
}
