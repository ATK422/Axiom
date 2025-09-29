import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Axiom & Seek Docs',
  description: 'Official documentation for the Axiom robotics framework and Seek interface.',
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Guides',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started/' },
          { text: 'Install Axiom', link: '/guide/axiom-install' },
          { text: 'Install Seek', link: '/guide/seek-install' }
        ]
      },
      { text: 'Features', link: '/features/' },
      { text: 'Examples', link: '/reference/examples' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/guide/getting-started/' },
            { text: 'Command Groups', link: '/guide/getting-started/command-groups' },
            { text: 'Driver Controls', link: '/guide/getting-started/controls' }
          ]
        },
        {
          text: 'Install',
          collapsed: false,
          items: [
            { text: 'Install Axiom', link: '/guide/axiom-install' },
            { text: 'Install Seek', link: '/guide/seek-install' }
          ]
        }
      ],
      '/features/': [
        {
          text: 'Feature Overview',
          collapsed: false,
          items: [
            { text: 'Axiom Capabilities', link: '/features/' },
            { text: 'Seek Capabilities', link: '/features/seek' }
          ]
        }
      ],
      '/reference/': [
        {
          text: 'Code Samples',
          items: [
            { text: 'Examples', link: '/reference/examples' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/bionictigers/axiom' }
    ],
    footer: {
      message: 'Released under the Apache-2.0 License.',
      copyright: 'Copyright © ' + new Date().getFullYear() + ' Bionic Tigers'
    }
  }
})
