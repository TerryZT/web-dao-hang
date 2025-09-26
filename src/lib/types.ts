export type LinkItem = {
  id: string;
  name: string;
  url: string;
  description: string;
  logoUrl?: string | null; // Allow null
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

export type AdminConfig = {
    id: number;
    adminPasswordHash: string;
}
