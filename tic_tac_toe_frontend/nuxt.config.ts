/**
 * Nuxt configuration for Tic Tac Toe - Ocean Professional theme.
 * Enables devtools, CORS headers, and sets basic app metadata.
 */
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Tic Tac Toe • Ocean Professional',
      meta: [
        { name: 'description', content: 'Play a modern, responsive Tic Tac Toe game built with Nuxt 3.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#2563EB' },
      ],
      link: [
        { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%232563EB%22/><text x=%2250%22 y=%2258%22 text-anchor=%22middle%22 font-size=%2254%22 fill=%22white%22 font-family=%22Arial%22>X</text></svg>' }
      ]
    }
  },
  nitro: {
    routeRules: {
      "/**": {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    },
  },
  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
      port: 3000,
    }
  },
});
