"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { Category, LinkItem } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Globe } from "lucide-react";

export function LinkGrid({ categories }: { categories: Category[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchTerm) {
      return categories;
    }
    return categories
      .map((category) => {
        const filteredLinks = category.links.filter(
          (link) =>
            link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            link.url.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return { ...category, links: filteredLinks };
      })
      .filter((category) => category.links.length > 0);
  }, [searchTerm, categories]);

  return (
    <div className="space-y-12">
      <div className="relative max-w-lg mx-auto mt-6">
        <Input
          type="search"
          placeholder="搜索..."
          className="w-full pl-4 pr-4 py-6 text-base rounded-lg shadow-sm bg-white dark:bg-card focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredCategories.length > 0 ? (
        <div className="space-y-10">
            {filteredCategories.map((category) => (
              <section key={category.id}>
                <h2 className="font-headline text-4xl font-bold mb-6 text-center">{category.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {category.links.map((link) => (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      key={link.id}
                    >
                      <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full">
                            <div className="w-full h-24 mb-4 relative flex items-center justify-center">
                                {link.logoUrl ? (
                                    <Image src={link.logoUrl} alt={`${link.name} logo`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-contain" />
                                ) : (
                                    <Globe className="h-12 w-12 text-muted-foreground"/>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-semibold text-lg">{link.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 h-[40px]">{link.description}</p>
                            </div>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
              </section>
            ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">没有找到匹配的网站。</p>
        </div>
      )}
    </div>
  );
}
