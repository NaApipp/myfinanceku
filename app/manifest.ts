import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MyFinanceKu',
    short_name: 'MyFinanceKu App',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      { src: '/icon/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  }
}