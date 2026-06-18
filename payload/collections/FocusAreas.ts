import type { CollectionConfig } from 'payload/types';

// "Take Control Of Your Financial Future" carousel cards.
export const FocusAreas: CollectionConfig = {
  slug: 'focus-areas',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'tag', 'featured', 'order'],
    group: 'Content',
  },
  fields: [
    { name: 'tag',         type: 'text', required: true, admin: { description: 'e.g. Investment Planning' } },
    { name: 'title',       type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'image',       type: 'upload', relationTo: 'media' },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Render as the filled blue (highlighted) card' },
    },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
};
