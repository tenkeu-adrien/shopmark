// app/layout.js (VERSION CORRIGÉE)
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WebTabFooter from "@/components/WebTabFooter";
import { AuthProvider } from '@/contexts/AuthContext'
import ProgressBar from "@/components/ProgressBar";
import { Metadata } from 'next';
import { defaultMetadata } from "./default-metadata";
import TeamCacheProvider from '@/components/TeamCacheProvider';
import AppCacheProvider from "@/components/AppCacheProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Configuration propre et simple
export const metadata = {
  title: 'Investissez et gagnez des gains passifs avec Shopmark',
  description: 'Démarrez votre investissement et générez des revenus quotidiens.',
  ...defaultMetadata, // Tout Open Graph/Twitter vient d'ici
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
           <TeamCacheProvider />
            <AppCacheProvider />
          {children}
          <WebTabFooter />
        </AuthProvider>
        <ProgressBar />
      </body>
    </html>
  );
}