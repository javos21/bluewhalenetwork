import { buildConfig } from 'payload/config';
import path from 'path';

import { FocusAreas }   from './collections/FocusAreas';
import { Faqs }         from './collections/Faqs';
import { Testimonials } from './collections/Testimonials';
import { BlogPosts }    from './collections/BlogPosts';
import { Media }        from './collections/Media';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',

  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— BlueWhale Network CMS',
      favicon: '/favicon.svg',
    },
    css: path.resolve(__dirname, '../src/styles/payload-admin.css'),
  },

  collections: [
    FocusAreas,
    Faqs,
    Testimonials,
    BlogPosts,
    Media,
    // Built-in users collection
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email', group: 'Admin' },
      fields: [
        { name: 'name', type: 'text' },
        { name: 'role', type: 'select', options: ['admin', 'editor'], defaultValue: 'editor' },
      ],
    },
  ],

  globals: [
    {
      slug: 'site-settings',
      label: 'Site Settings',
      admin: { group: 'Settings' },
      fields: [
        { name: 'company_name', type: 'text', defaultValue: 'BlueWhale Network' },
        { name: 'logo_text',    type: 'text', defaultValue: 'BlueWhale' },
        { name: 'email',        type: 'email' },
        { name: 'phone',        type: 'text' },
        { name: 'address',      type: 'text' },
        {
          name: 'social_links',
          type: 'array',
          fields: [
            { name: 'platform', type: 'text' },
            { name: 'url',      type: 'text' },
          ],
        },
      ],
    },
    {
      slug: 'navigation',
      label: 'Navigation',
      admin: { group: 'Settings' },
      fields: [
        {
          name: 'nav_links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'href',  type: 'text' },
          ],
        },
        { name: 'cta_label', type: 'text', defaultValue: 'Book Consultation' },
        { name: 'cta_url',   type: 'text', defaultValue: '#contact' },
      ],
    },
    {
      slug: 'home-page',
      label: 'Home Page',
      admin: { group: 'Settings' },
      fields: [
        // Hero
        { name: 'hero_headline',  type: 'text', admin: { description: 'Use line breaks for the stacked headline' } },
        { name: 'hero_note',      type: 'text' },
        { name: 'hero_cta',       type: 'text', defaultValue: 'Book Appointment' },
        { name: 'hero_image',     type: 'upload', relationTo: 'media' },
        { name: 'hero_image_secondary', type: 'upload', relationTo: 'media' },
        // Who We Are
        { name: 'about_body',     type: 'textarea' },
        {
          name: 'about_stats',
          type: 'array',
          fields: [
            { name: 'value', type: 'text' },
            { name: 'label', type: 'text' },
          ],
        },
        // CTA Banner
        { name: 'cta_headline',   type: 'text' },
        { name: 'cta_subtext',    type: 'text' },
        { name: 'cta_button',     type: 'text', defaultValue: 'Book Appointment' },
        // Newsletter
        { name: 'newsletter_heading',     type: 'text' },
        { name: 'newsletter_placeholder', type: 'text' },
      ],
    },
    {
      slug: 'footer',
      label: 'Footer',
      admin: { group: 'Settings' },
      fields: [
        { name: 'tagline', type: 'text' },
        {
          name: 'social_links',
          type: 'array',
          fields: [
            { name: 'platform', type: 'text' },
            { name: 'href',     type: 'text' },
          ],
        },
        {
          name: 'legal_links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'href',  type: 'text' },
          ],
        },
        { name: 'legal_note', type: 'textarea' },
      ],
    },
  ],

  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },

  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },

  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },

  db: {
    // Using the local adapter for development (SQLite-like)
    // For production swap to: @payloadcms/db-mongodb or @payloadcms/db-postgres
  } as any,
});
