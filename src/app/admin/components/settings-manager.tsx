"use client";

import React, { useState, useReducer } from "react";
import type { Settings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { changePassword } from "@/lib/actions-auth";

function SubmitButton({ isPending, text, pendingText }: { isPending: boolean, text: string, pendingText: string }) {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? pendingText : text}
    </Button>
  );
}

export function SettingsManager({ initialSettings }: { initialSettings: Settings }) {
  const { toast } = useToast();
  const [settings, setSettings] = useState(initialSettings);
  const [isSettingsPending, setIsSettingsPending] = useState(false);
  const [isPasswordPending, setIsPasswordPending] = useState(false);

  const [passwordFormState, passwordFormAction] = useReducer(
    (state: any, payload: { message: string; type: 'success' | 'error' }) => payload,
    { message: '', type: 'success' }
  );

  const handlePasswordSubmit = async (formData: FormData) => {
    setIsPasswordPending(true);
    const result = await changePassword(passwordFormState, formData);
    passwordFormAction(result);
    setIsPasswordPending(false);
    
    if (result?.message) {
      toast({
        title: result.type === 'success' ? "成功" : "错误",
        description: result.message,
        variant: result.type === 'error' ? "destructive" : "default",
      });
      if(result.type === 'success') {
        (document.getElementById('password-form') as HTMLFormElement)?.reset();
      }
    }
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
     if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setSettings(prev => ({...prev, [name]: checked}));
    } else {
        setSettings(prev => ({...prev, [name]: value}));
    }
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSettingsPending(true);
    // Simulate async operation
    setTimeout(() => {
        toast({
            title: "提示",
            description: "操作已在本地应用。刷新页面将重置所有更改。",
        });
        setIsSettingsPending(false);
    }, 500);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>网站设置</CardTitle>
          <CardDescription>管理网站的基本信息和功能。</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md">
                <p className="font-bold">注意：</p>
                <p>设置更改仅在当前会话中有效，刷新页面后将重置。</p>
            </div>
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">网站标题</Label>
              <Input id="title" name="title" value={settings.title} onChange={handleSettingsChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo 文本</Label>
              <Input id="logo" name="logo" value={settings.logo} onChange={handleSettingsChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="copyright">版权信息</Label>
              <Input id="copyright" name="copyright" value={settings.copyright} onChange={handleSettingsChange} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label htmlFor="searchEnabled">启用搜索功能</Label>
                    <p className="text-xs text-muted-foreground">在主页上显示搜索框。</p>
                </div>
                <Switch id="searchEnabled" name="searchEnabled" checked={settings.searchEnabled} onCheckedChange={(checked) => setSettings(prev => ({...prev, searchEnabled: checked}))} />
            </div>
            <SubmitButton isPending={isSettingsPending} text="保存设置" pendingText="保存中..." />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>修改密码</CardTitle>
          <CardDescription>定期更换密码以确保账户安全。此操作会与服务器同步。</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="password-form" action={handlePasswordSubmit} className="space-y-6">
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
            <SubmitButton isPending={isPasswordPending} text="修改密码" pendingText="修改中..." />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
