import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WebTabFooter from "@/components/WebTabFooter";
import { AuthProvider } from '@/contexts/AuthContext'
import ProgressBar from "@/components/ProgressBar";
import { Metadata } from 'next';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});







export const metadata= {
  title: 'Investissez et gagnez des gains passifs avec Shopmark',
  description: 'Démarrez votre investissement et générez des revenus quotidiens.',
  openGraph: {
    title: 'Investissez et gagnez des gains passifs avec Shopmark',
    description: 'Démarrez votre investissement et générez des revenus quotidiens.',
    images: [
      {
        url: 'https://shopmark.fr/shopmarkk.jpeg', // Chemin relatif vers votre image dans `/public`
        width: 1200,
        height: 630,
        alt: 'Aperçu Shopmark',
      },
    ],
    type: 'website',
    url: 'https://shopmark.fr',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Investissez et gagnez des gains passifs avec Shopmark',
    description: 'Démarrez votre investissement et générez des revenus quotidiens.',
    images: ['/shopmarkk.jpeg'],
  },
};


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
        {/* <Navbar/>  */}
        {children}

        <WebTabFooter />
        </AuthProvider>
        <ProgressBar />
      </body>
    </html>
  );
}
