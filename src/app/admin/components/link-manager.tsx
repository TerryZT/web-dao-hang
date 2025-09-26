"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Category, LinkItem } from "@/lib/types";
import { saveAllCategories } from "@/lib/actions";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash, GripVertical, PlusCircle, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const linkSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  url: z.string().url("请输入有效的URL"),
  description: z.string().min(1, "描述不能为空"),
  logoUrl: z.string().url("请输入有效的图片URL").optional().or(z.literal('')),
});

type LinkFormData = z.infer<typeof linkSchema>;

export function LinkManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [openDialog, setOpenDialog] = useState<
    | { type: "add-cat" }
    | { type: "edit-cat"; category: Category }
    | { type: "add-link"; categoryId: string }
    | { type: "edit-link"; link: LinkItem; categoryId: string }
    | null
  >(null);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkFormData>();
  
  const handleSaveChanges = () => {
    startTransition(async () => {
        const result = await saveAllCategories(categories);
        if (result?.error) {
            toast({ title: "错误", description: `保存失败: ${result.error}`, variant: "destructive" });
        } else {
            toast({ title: "成功", description: "所有更改已成功保存到服务器！" });
            router.refresh();
        }
    });
  }

  const handleOpenDialog = (dialog: NonNullable<typeof openDialog>) => {
    reset();
    if(dialog.type === 'edit-link') {
        reset(dialog.link)
    }
    setOpenDialog(dialog);
  };
  
  const handleCategorySubmit = (data: { name: string }) => {
    if (!openDialog) return;
    
    if (openDialog.type === "add-cat") {
        const newCategory: Category = {
          id: `cat-${Date.now()}`,
          name: data.name,
          links: [],
        };
        setCategories(prev => [...prev, newCategory]);
    } else if (openDialog.type === "edit-cat") {
        setCategories(prev => prev.map(c =>
            c.id === openDialog.category.id ? { ...c, name: data.name } : c
        ));
    }
    setOpenDialog(null);
  };
  
  const handleDeleteCategory = (categoryId: string) => {
     setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const handleLinkSubmit = (data: LinkFormData) => {
    if (!openDialog) return;
    
     if (openDialog.type === "add-link") {
        setCategories(prev => prev.map(c => {
            if (c.id === openDialog.categoryId) {
              const newLink: LinkItem = {
                ...data,
                id: `link-${Date.now()}`,
                categoryId: openDialog.categoryId,
              };
              return { ...c, links: [...c.links, newLink] };
            }
            return c;
        }));
    } else if (openDialog.type === "edit-link") {
        setCategories(prev => prev.map(c => {
            if (c.id === openDialog.categoryId) {
                return {
                    ...c,
                    links: c.links.map(l =>
                    l.id === openDialog.link.id ? { ...l, ...data } : l
                    ),
                };
            }
            return c;
        }));
    }
    setOpenDialog(null);
  };
  
   const handleDeleteLink = (linkId: string, categoryId: string) => {
    setCategories(prev => prev.map(c => {
        if (c.id === categoryId) {
          return { ...c, links: c.links.filter(l => l.id !== linkId) };
        }
        return c;
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>分类和链接</CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={() => handleOpenDialog({ type: "add-cat" })}>
                <PlusCircle className="mr-2 h-4 w-4" /> 添加分类
            </Button>
            <Button onClick={handleSaveChanges} disabled={isPending}>
                <Save className="mr-2 h-4 w-4" />
                {isPending ? '保存中...' : '保存所有更改'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full space-y-4">
          {categories.map((category) => (
            <AccordionItem value={category.id} key={category.id} className="border-b-0 rounded-lg border bg-background">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{category.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="flex items-center justify-end gap-2 mb-4 border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog({ type: "edit-cat", category })}
                  >
                    <Edit className="mr-2 h-3 w-3" /> 编辑名称
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash className="mr-2 h-3 w-3" /> 删除分类
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认删除？</AlertDialogTitle>
                        <AlertDialogDescription>
                          这将永久删除 “{category.name}” 分类及其所有链接。此操作在点击“保存所有更改”后生效。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>
                          确认
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button size="sm" onClick={() => handleOpenDialog({ type: "add-link", categoryId: category.id })}>
                    <Plus className="mr-2 h-4 w-4" /> 添加链接
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>名称</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>描述</TableHead>
                      <TableHead>Logo URL</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.links.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell className="font-medium">{link.name}</TableCell>
                        <TableCell className="text-muted-foreground truncate max-w-xs">{link.url}</TableCell>
                        <TableCell className="text-muted-foreground truncate max-w-xs">{link.description}</TableCell>
                        <TableCell className="text-muted-foreground truncate max-w-xs">{link.logoUrl}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog({ type: 'edit-link', link, categoryId: category.id })}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>确认删除？</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    这将永久删除 “{link.name}” 链接。此操作在点击“保存所有更改”后生效。
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteLink(link.id, category.id)}>
                                    确认
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                 {category.links.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">此分类下暂无链接。</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {categories.length === 0 && (
            <div className="text-center py-16 border rounded-lg">
                <p className="text-muted-foreground">还没有任何分类。</p>
                <Button className="mt-4" onClick={() => handleOpenDialog({ type: "add-cat" })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> 创建第一个分类
                </Button>
            </div>
        )}

      </CardContent>

      {/* Dialog for adding/editing categories */}
      <Dialog open={openDialog?.type === 'add-cat' || openDialog?.type === 'edit-cat'} onOpenChange={(isOpen) => !isOpen && setOpenDialog(null)}>
        <DialogContent>
          <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleCategorySubmit({ name: formData.get('name') as string });
          }}>
            <DialogHeader>
              <DialogTitle>{openDialog?.type === 'add-cat' ? '添加新分类' : '编辑分类名称'}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="category-name">分类名称</Label>
              <Input id="category-name" name="name" defaultValue={openDialog?.type === 'edit-cat' ? openDialog.category.name : ''} required />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost">取消</Button>
                </DialogClose>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for adding/editing links */}
      <Dialog open={openDialog?.type === 'add-link' || openDialog?.type === 'edit-link'} onOpenChange={(isOpen) => !isOpen && setOpenDialog(null)}>
        <DialogContent>
          <form onSubmit={handleSubmit(handleLinkSubmit)}>
            <DialogHeader>
              <DialogTitle>{openDialog?.type === 'add-link' ? '添加新链接' : '编辑链接'}</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="link-name">名称</Label>
                <Input id="link-name" {...register("name")} />
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="link-url">URL</Label>
                <Input id="link-url" {...register("url")} />
                {errors.url && <p className="text-destructive text-sm mt-1">{errors.url.message}</p>}
              </div>
              <div>
                <Label htmlFor="link-desc">描述</Label>
                <Textarea id="link-desc" {...register("description")} />
                {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
              </div>
              <div>
                <Label htmlFor="link-logo">Logo 图片地址</Label>
                <Input id="link-logo" {...register("logoUrl")} placeholder="https://example.com/logo.png"/>
                {errors.logoUrl && <p className="text-destructive text-sm mt-1">{errors.logoUrl.message}</p>}
              </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost">取消</Button>
                </DialogClose>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
