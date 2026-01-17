export default defineNuxtConfig({
  compatibilityDate: '2025-12-04',
  devServer: {
    port: 1337,
  },
  devtools: {
    enabled: true,
  },
  app: {
    head: {
      title: 'contribmap',
      link: [
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
      ],
    },
  },
  watch: [
    '../.contribmaprc',
    '../contribmap.config.json',
    '../contribmap.config.yaml',
    '../contribmap.config.yml',
  ],
  modules: ['@nuxt/eslint', '@nuxt/ui'],
  css: ['~/assets/styles/main.css'],
  eslint: {
    config: {
      standalone: false,
    },
  },
  ui: {
    fonts: true,
    colorMode: true,
  },
});
