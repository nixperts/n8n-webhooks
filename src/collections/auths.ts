import { type CollectionConfig } from 'payload'

export const n8nAuthCredentials: CollectionConfig = {
  slug: 'n8n-auth-credentials',
  admin: {
    group: 'n8n',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'A title for you to recognize the authentication credentials',
        position: 'sidebar',
      },
      required: true,
      unique: true,
    },
    {
      name: 'type',
      type: 'select',
      admin: {
        description: 'The method expected from n8n for this webhook',
      },
      defaultValue: 'basic-auth',
      options: [{ label: 'Basic Auth', value: 'basic-auth' }],
      required: true,
    },
    {
      name: 'basicAuth',
      type: 'group',
      admin: {
        condition: (_, sibling) => sibling.type === 'basic-auth',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'username',
              type: 'text',
              admin: {
                description: 'The username used for basic auth with n8n',
                width: '50%',
              },
              required: true,
            },
            {
              name: 'password',
              type: 'text',
              admin: {
                description: 'The password used for basic auth with n8n',
                width: '50%',
              },
              required: true,
            },
          ],
        },
      ],
      required: true,
    },
  ],
  labels: {
    plural: 'Auth Credential',
    singular: 'Auth Credentials',
  },
}
