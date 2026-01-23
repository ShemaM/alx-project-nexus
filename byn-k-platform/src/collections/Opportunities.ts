import { CollectionConfig } from 'payload'

export const Opportunities: CollectionConfig = {
  slug: 'opportunities',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'organization', 'isVerified'],
    group: 'Management',
  },
  access: {
    read: () => true, // Publicly readable for your Next.js frontend
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'partners',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Jobs', value: 'jobs' },
        { label: 'Internships', value: 'internships' },
        { label: 'Scholarships', value: 'scholarships' },
        { label: 'Fellowships', value: 'fellowships' },
      ],
    },
    {
      name: 'documentation',
      label: 'Accepted Documentation',
      type: 'select',
      hasMany: true, // Enables the multi-filter feature
      required: true,
      options: [
        { label: 'Alien Card', value: 'alien_card' },
        { label: 'Convention Travel Document (CTD)', value: 'ctd' },
        { label: 'Passport', value: 'passport' },
        { label: 'Waiting Slip', value: 'waiting_slip' },
      ],
      admin: {
        description: 'Which refugee IDs are accepted for this opportunity?',
      },
    },
    {
      name: 'deadline',
      type: 'date',
      required: true,
    },
    {
      name: 'isVerified',
      type: 'checkbox',
      label: 'Verified by BYN-K Admin',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'applyLink',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
  ],
}