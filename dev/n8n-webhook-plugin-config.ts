import { n8nWebhooks } from '@nixperts/n8n-webhooks'

export const n8nWebhookPlugin = n8nWebhooks({
  baseUrl: process.env.N8N_BASE_URL ?? 'localhost:5678',
  enabled: true,
  useTestInstance: true,
})
