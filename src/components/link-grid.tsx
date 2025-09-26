"use client";

import { useState, useMemo } from "react";
import type { Category } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Link as LinkIcon } from "lucide-react";

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
    <div className="space-y-8">
      <div className="relative max-w-lg mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="搜索网站..."
          className="w-full pl-10 py-6 text-lg rounded-full shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredCategories.length > 0 ? (
        <div className="space-y-10">
          <TooltipProvider>
            {filteredCategories.map((category) => (
              <section key={category.id}>
                <h2 className="font-headline text-2xl font-bold mb-4 border-l-4 border-primary pl-4">{category.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {category.links.map((link) => (
                    <Tooltip key={link.id}>
                      <TooltipTrigger asChild>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                        >
                          <Card className="h-full hover:shadow-lg hover:border-primary transition-all duration-200">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-2 bg-muted rounded-lg">
                                    <LinkIcon className="h-5 w-5 text-muted-foreground"/>
                                </div>
                                <span className="font-semibold truncate">{link.name}</span>
                            </CardContent>
                          </Card>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{link.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </section>
            ))}
          </TooltipProvider>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">没有找到匹配的网站。</p>
        </div>
      )}
    </div>
  );
}
