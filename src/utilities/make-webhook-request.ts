// import { getAuthHeader } from './get-auth-header.js'
import { constructN8nEndpointUrl } from './construct-n8n-endpoint-url.js'
import { type N8NWebhook } from './generated-collection-types.js'
import { getAuthHeader } from './get-auth-header.js'
import { type MakeWebhookRequest } from './types.js'

export async function makeN8nWebhookRequest<T = unknown, E = unknown>({
  body,
  payload,
  webhook,
}: MakeWebhookRequest): Promise<[error: E | null, data: null | T]> {
  if (!webhook) {
    return ['No webhook defined' as E, null]
  }

  const fullWebhook = (
    typeof webhook === 'string'
      ? await payload.findByID({
          id: webhook,
          collection: 'n8n-webhooks',
          depth: 2,
        })
      : webhook
  ) as N8NWebhook

  const authorizationHeader = await getAuthHeader({
    payload,
    webhookAuth: fullWebhook.auth.credentials,
  })

  const requestBody = typeof body === 'string' ? body : JSON.stringify(body)

  const fetchConfiguration = {
    body: requestBody,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(authorizationHeader ?? authorizationHeader),
    },
    method: 'post',
  }

  const endpointUrl = constructN8nEndpointUrl({ path: fullWebhook.webhookPath, payload })

  try {
    const request = new Request(endpointUrl, fetchConfiguration)

    const response = await fetch(request)

    // Clone the response to read it multiple times
    const clonedResponse = response.clone()

    let responseBody
    const contentType = clonedResponse.headers.get('content-type')

    if (contentType && contentType.includes('application/json')) {
      try {
        responseBody = await clonedResponse.json() // Parse as JSON
      } catch (_) {
        responseBody = null
      }
    } else {
      responseBody = await clonedResponse.text() // Parse as text if not JSON
    }

    payload.logger.info(`Executed webhook ${fullWebhook.title}`)

    if (!clonedResponse.ok) {
      payload.logger.warn(
        `Fetch for ${endpointUrl} returned error status: ${clonedResponse.status} - ${clonedResponse.statusText}`,
      )
    }

    return [null, responseBody as T]
  } catch (error) {
    payload.logger.error(`Error occurred during webhook ${fullWebhook.title}`, error)

    return [error as E, null]
  }
}
