import { getCategories, getSettings } from "@/lib/data";
import { AdminDashboard } from "./components/admin-dashboard";

export default async function AdminPage() {
  const settings = await getSettings();
  const categories = await getCategories();

  return <AdminDashboard initialSettings={settings} initialCategories={categories} />;
}
