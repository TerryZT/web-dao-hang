"use client";

import { useActionState, useEffect, useTransition } from "react";
import type { Settings } from "@/lib/types";
import { saveSettings, changePassword } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export function SettingsManager({ initialSettings }: { initialSettings: Settings }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSaveSettings = (formData: FormData) => {
    startTransition(async () => {
      const result = await saveSettings(undefined, formData);
      if (result?.message) {
        toast({
          title: result.type === 'success' ? "成功" : "错误",
          description: result.message,
          variant: result.type === 'error' ? "destructive" : "default",
        });
      }
    });
  };

  const [passwordState, passwordFormAction] = useActionState(changePassword, undefined);

  useEffect(() => {
    if (passwordState?.message) {
      toast({
        title: passwordState.type === 'success' ? "成功" : "错误",
        description: passwordState.message,
        variant: passwordState.type === 'error' ? "destructive" : "default",
      });
      if(passwordState.type === 'success') {
        (document.getElementById('password-form') as HTMLFormElement)?.reset();
      }
    }
  }, [passwordState, toast]);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>网站设置</CardTitle>
          <CardDescription>管理网站的基本信息和功能。</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSaveSettings} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">网站标题</Label>
              <Input id="title" name="title" defaultValue={initialSettings.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo 文本</Label>
              <Input id="logo" name="logo" defaultValue={initialSettings.logo} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="copyright">版权信息</Label>
              <Input id="copyright" name="copyright" defaultValue={initialSettings.copyright} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label>启用搜索功能</Label>
                    <p className="text-xs text-muted-foreground">在主页上显示搜索框。</p>
                </div>
                <Switch id="searchEnabled" name="searchEnabled" defaultChecked={initialSettings.searchEnabled} />
            </div>
            <Button type="submit" disabled={isPending}>{isPending ? "保存中..." : "保存设置"}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>修改密码</CardTitle>
          <CardDescription>定期更换密码以确保账户安全。</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="password-form" action={passwordFormAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">当前密码</Label>
              <Input id="currentPassword" name="currentPassword" type="password" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input id="newPassword" name="newPassword" type="password" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认新密码</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
            <Button type="submit">修改密码</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
