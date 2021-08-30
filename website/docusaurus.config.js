const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Re.Pack',
  tagline:
    'A Webpack-based toolkit to build your React Native application with full support of Webpack ecosystem.',
  url: 'https://re-pack.netlify.app/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Callstack',
  projectName: 'Re.Pack',
  themeConfig: {
    navbar: {
      logo: {
        alt: 'Re.Pack Logo',
        src: 'img/logo_light.svg',
        srcDark: 'img/logo_dark.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'getting-started',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'doc',
          docId: 'configuration/webpack-config',
          position: 'left',
          label: 'Configuration',
        },
        {
          type: 'doc',
          docId: 'api/index',
          position: 'left',
          label: 'API',
        },
        // {
        //   to: '/blog',
        //   label: 'Blog',
        //   position: 'left'
        // },
        {
          href: 'https://github.com/callstack/repack',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started/installation',
            },
            {
              label: 'Configuration',
              to: '/docs/configuration/webpack-config',
            },
            {
              label: 'API',
              to: '/docs/api/index',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            // {
            //   label: 'Blog',
            //   to: '/blog',
            // },
            {
              label: 'GitHub',
              href: 'https://github.com/callstack/repack',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/repack_rn',
            },
            {
              label: 'Callstack',
              href: 'https://callstack.com',
            },
          ],
        },
        {
          title: 'Built with',
          items: [
            {
              label: 'Docusaurus',
              href: 'https://docusaurus.io/',
            },
            {
              label: 'Netlify',
              href: 'https://www.netlify.com/',
            },
          ],
        },
      ],
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/callstack/repack/edit/main/website/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/callstack/repack/edit/main/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
