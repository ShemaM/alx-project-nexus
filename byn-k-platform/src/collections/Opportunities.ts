import { CollectionConfig } from 'payload'

export const Opportunities: CollectionConfig = {
  slug: 'opportunities',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'organization', 'applicationType', 'isVerified'],
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
      hasMany: true,
      required: false, // Made optional
      options: [
        { label: 'Alien Card', value: 'alien_card' },
        { label: 'Convention Travel Document (CTD)', value: 'ctd' },
        { label: 'Passport', value: 'passport' },
        { label: 'Waiting Slip', value: 'waiting_slip' },
        { label: 'Any ID', value: 'any_id' },
        { label: 'Not Specified', value: 'not_specified' },
      ],
      admin: {
        description: 'Which refugee IDs are accepted for this opportunity? (Optional - leave empty if not applicable)',
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
    // Application Method Section
    {
      name: 'applicationType',
      type: 'select',
      label: 'Application Method',
      required: true,
      defaultValue: 'link',
      options: [
        { label: 'Direct Link (Website/Portal)', value: 'link' },
        { label: 'Email Application', value: 'email' },
      ],
      admin: {
        description: 'How should applicants apply for this opportunity?',
      },
    },
    {
      name: 'applyLink',
      type: 'text',
      label: 'Application Link',
      admin: {
        condition: (data) => data?.applicationType === 'link',
        description: 'Direct URL to the application portal or website',
      },
    },
    {
      name: 'applicationEmail',
      type: 'email',
      label: 'Application Email',
      admin: {
        condition: (data) => data?.applicationType === 'email',
        description: 'Email address where applicants should send their applications',
      },
    },
    {
      name: 'emailSubjectLine',
      type: 'text',
      label: 'Email Subject Line',
      admin: {
        condition: (data) => data?.applicationType === 'email',
        description: 'Suggested subject line for the application email (optional)',
      },
    },
    {
      name: 'requiredDocuments',
      type: 'textarea',
      label: 'Required Application Documents',
      admin: {
        condition: (data) => data?.applicationType === 'email',
        description: 'List the documents applicants should attach (e.g., CV, Cover Letter, Certificates)',
      },
    },
    // Description Section
    {
      name: 'descriptionType',
      type: 'select',
      label: 'Description Type',
      required: true,
      defaultValue: 'text',
      options: [
        { label: 'Write Description', value: 'text' },
        { label: 'Upload Document', value: 'document' },
      ],
      admin: {
        description: 'Choose to write a description or upload a document with opportunity details',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      admin: {
        condition: (data) => data?.descriptionType !== 'document',
        description: 'Write the opportunity details here',
      },
    },
    {
      name: 'opportunityDocument',
      type: 'upload',
      relationTo: 'media',
      label: 'Opportunity Document',
      admin: {
        condition: (data) => data?.descriptionType === 'document',
        description: 'Upload a PDF or document containing the full opportunity details',
      },
    },
  ],
}