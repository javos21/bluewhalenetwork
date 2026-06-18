import type { CollectionConfig } from 'payload/types';

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'order'],
    group: 'Content',
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer',   type: 'textarea', required: true },
    { name: 'order',    type: 'number', defaultValue: 0 },
  ],
};
