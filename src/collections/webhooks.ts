import { APIError, type CollectionConfig } from 'payload'

import { makeN8nWebhookRequest } from '../utilities/make-webhook-request.js'

export const n8nWebhooks: CollectionConfig = {
  slug: 'n8n-webhooks',
  admin: {
    components: {
      edit: {
        beforeDocumentControls: ['@nixperts/n8n-webhooks/client#TestWebhookButton'],
      },
    },
    group: 'n8n',
    useAsTitle: 'title',
  },
  endpoints: [
    {
      handler: async (req) => {
        const webhookPath = req.routeParams?.webhookPath
        if (!webhookPath) {
          throw new APIError('Bad request', 400, null, true)
        }

        const {
          docs: [fullWebhook],
        } = await req.payload.find({
          collection: 'n8n-webhooks',
          where: {
            webhookPath: { equals: webhookPath },
          },
        })
        if (!fullWebhook) {
          throw new APIError('Not found', 404, null, true)
        }

        await makeN8nWebhookRequest({
          body: {},
          payload: req.payload,
          webhook: fullWebhook.id as string,
        })

        // TODO find webhook
        return Response.json({ success: true })
      },
      method: 'post',
      path: '/fire-webhook/:webhookPath',
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'A title for you to recognize the webhook',
        position: 'sidebar',
      },
      required: true,
      unique: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'webhookPath',
          type: 'text',
          admin: {
            description: 'The path of the webhook provided by n8n',
            width: '50%',
          },
          required: true,
          unique: true,
        },
        {
          name: 'method',
          type: 'select',
          admin: {
            description: 'The method expected from n8n for this webhook',
            width: '50%',
          },
          defaultValue: 'get',
          options: ['get', 'post'],
          required: true,
        },
      ],
    },
    {
      name: 'auth',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          admin: {
            description: 'Set authentication if applicable',
            width: '50%',
          },
          defaultValue: 'none',
          label: 'Authentication Method',
          options: [
            {
              label: 'None',
              value: 'none',
            },
            // {
            //   label: 'OAuth2',
            //   value: 'oauth2',
            // },
            {
              label: 'Basic Auth',
              value: 'basic-auth',
            },
          ],
          required: true,
        },
        {
          name: 'credentials',
          type: 'relationship',
          admin: {
            appearance: 'drawer',
            condition: (_, sibling) => sibling.type !== 'none',
            description:
              'Choose which authentication method should be used. You can set up an authentication method once and then re-use it.',
          },
          filterOptions: ({ siblingData }) => {
            const sibling = siblingData as any
            return { type: { equals: sibling.type } }
          },
          hasMany: false,
          relationTo: 'n8n-auth-credentials',
          required: true,
        },
      ],
      label: 'Authentication',
    },
  ],
  labels: {
    plural: 'Webhooks',
    singular: 'Webhook',
  },
}
