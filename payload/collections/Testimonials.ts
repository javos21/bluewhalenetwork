import type { CollectionConfig } from 'payload/types';

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'featured'],
    group: 'Content',
  },
  fields: [
    { name: 'name',  type: 'text', required: true },
    { name: 'title', label: 'Role / Job Title', type: 'text' },
    { name: 'quote', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show as the large highlighted story' },
    },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
};
