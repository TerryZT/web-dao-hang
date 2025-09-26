export type LinkItem = {
  id: string;
  name: string;
  url: string;
  description: string;
  logoUrl?: string;
};

export type Category = {
  id: string;
  name: string;
  links: LinkItem[];
};

export type Settings = {
  logo: string;
  title: string;
  copyright: string;
  searchEnabled: boolean;
};
