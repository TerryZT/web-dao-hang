export type LinkItem = {
  id: string;
  name: string;
  url: string;
  description: string;
  logoUrl?: string | null;
  categoryId: string;
};

export type Category = {
  id: string;
  name: string;
  links: LinkItem[];
};

export type Settings = {
  id: number;
  logo: string;
  title: string;
  copyright: string;
  searchEnabled: boolean;
};

// This type is no longer used for database operations
// but can be kept for reference or other purposes.
export type AppData = {
  settings: Settings;
  categories: Category[];
  adminPasswordHash: string;
};
