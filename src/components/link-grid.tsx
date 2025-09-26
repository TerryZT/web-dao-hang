"use client";

import { useState, useMemo } from "react";
import type { Category, LinkItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Globe } from "lucide-react";

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
      <div className="relative max-w-2xl mx-auto">
        <div className="gradient-border-bg rounded-full p-px">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="探索..."
              className="w-full pl-14 pr-6 py-8 text-xl rounded-full shadow-lg border-0 bg-card focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {filteredCategories.length > 0 ? (
        <div className="space-y-10">
            {filteredCategories.map((category) => (
              <section key={category.id}>
                <h2 className="font-headline text-2xl font-bold mb-6">{category.name}</h2>
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
                        <CardContent className="p-5 flex flex-col gap-4">
                            <div className="w-14 h-14 flex items-center justify-center bg-muted rounded-xl shadow-sm">
                                <Globe className="h-7 w-7 text-muted-foreground"/>
                            </div>
                            <div>
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
