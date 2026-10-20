import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import AuthGuard from "@/components/AuthGuard";

export const metadata = {
  title: "GOTA Voyages | Expert Through Experience",
  description: "Premium Travel Operations System — GOTA International Group",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0a0a0a]">
        <AuthGuard>
          <LayoutShell>{children}</LayoutShell>
        </AuthGuard>
      </body>
    </html>
  );
}
