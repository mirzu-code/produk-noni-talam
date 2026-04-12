import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Noni Talam',
        short_name: 'Noni Talam',
        description: 'Premium Traditional Delicacies Store',
        theme_color: '#154D35',
        background_color: '#F8FAF8',
        display: 'standalone',
        icons: [
          {
            src: '/qr-code.jpg', // Temporarily using the QR code as the app icon so it compiles cleanly
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'any maskable'
          },
          {
            src: '/qr-code.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
