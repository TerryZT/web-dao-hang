import { getSettings } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

export default async function HealthCheckPage() {
  let dbStatus: "connected" | "error" = "connected";
  let errorMessage: string | null = null;

  try {
    // Attempt a simple query to check the connection
    await getSettings();
  } catch (error) {
    dbStatus = "error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "An unknown error occurred.";
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">系统健康检查</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <h3 className="text-lg font-medium">数据库连接</h3>
            {dbStatus === "connected" ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-6 w-6" />
                <span className="font-semibold">成功</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="h-6 w-6" />
                <span className="font-semibold">失败</span>
              </div>
            )}
          </div>
          {errorMessage && (
            <div className="mt-4 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
              <strong>错误详情:</strong>
              <p className="mt-2 font-mono">{errorMessage}</p>
            </div>
          )}
           {dbStatus === "connected" && (
             <div className="mt-4 p-4 rounded-lg bg-green-600/10 text-green-700 text-sm text-center">
                <p>应用已成功连接到您的 Neon 数据库！</p>
             </div>
           )}
        </CardContent>
      </Card>
    </main>
  );
}