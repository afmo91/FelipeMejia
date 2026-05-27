import "./globals.css";
import Layout from "@/components/Layout";

export const metadata = { title: "Felipe Mejia | Portfolio", description: "Professional portfolio" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><Layout>{children}</Layout></body></html>;
}
