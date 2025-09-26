import type { Settings } from "@/lib/types";
import Link from "next/link";

export function MainFooter({ settings }: { settings: Settings }) {
  return (
    <footer className="py-8 mt-auto border-t">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>
          {settings.copyright}
          <Link href="/admin" className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
            后台管理
          </Link>
        </p>
      </div>
    </footer>
  );
}
