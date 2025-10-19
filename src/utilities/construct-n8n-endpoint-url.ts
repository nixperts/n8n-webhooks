import { type Payload } from 'payload'

export function constructN8nEndpointUrl({ path, payload }: { path: string; payload: Payload }) {
  const { baseUrl, useTestInstance } = payload.config.custom.n8nWebhookPlugin

  if (useTestInstance) {
    return `${baseUrl}/webhook-test/${path}`
  }
  return `${baseUrl}/webhook/${path}`
}
