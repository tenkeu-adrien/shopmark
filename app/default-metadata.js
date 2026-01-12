// app/default-metadata.js
import { Metadata } from 'next';

export const defaultMetadata = {
    metadataBase: new URL('https://shopmark.fr'),
  openGraph: {
    title: 'Investissez et gagnez des gains passifs avec Shopmark',
    description: 'Démarrez votre investissement et générez des revenus quotidiens.',
    images: [
      {
        url: '/opengraph-image.jpg',
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
    images: ['/opengraph-image.jpg'],
  },
};