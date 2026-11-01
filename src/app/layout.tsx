import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "రైతు కవచ్ • వ్యవసాయ విపత్తు పంట నష్టపరిహార పోర్టల్ | Rythu Kavach",
  description: "తెలంగాణ ప్రభుత్వం • వ్యవసాయ & రెవెన్యూ (విపత్తు నిర్వహణ) విభాగం • Agricultural Disaster Crop Loss Relief Scrutiny & Sanction Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="te" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-100 text-slate-900">
        {children}
      </body>
    </html>
  );
}
