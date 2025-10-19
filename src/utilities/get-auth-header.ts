import type { Payload } from 'payload'

import type { N8NAuthCredential } from './generated-collection-types.js'

type AuthInput = N8NAuthCredential | null | string | undefined

interface GetAuthHeader {
  payload: Payload
  webhookAuth: AuthInput
}

export async function getAuthHeader({ payload, webhookAuth }: GetAuthHeader) {
  if (!webhookAuth) {
    return null
  }

  const fullWebhookAuth = (
    typeof webhookAuth === 'string'
      ? await payload.findByID({
          id: webhookAuth,
          collection: 'n8n-auth-credentials',
        })
      : webhookAuth
  ) as N8NAuthCredential | undefined

  if (!fullWebhookAuth) {
    return null
  }

  if (fullWebhookAuth.type === 'basic-auth') {
    const { password, username } = fullWebhookAuth.basicAuth!
    const credentials = Buffer.from(`${username}:${password}`).toString('base64')
    return { Authorization: `Basic ${credentials}` }
  }

  // if (fullWebhookAuth.type === 'oauth2') {
  //   const { clientId, clientSecret, scope, tokenUrl } = fullWebhookAuth.oauth2!
  //   const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  //   const params = new URLSearchParams({ grant_type: 'client_credentials' })
  //   if (scope) {
  //     params.append('scope', scope)
  //   }

  //   const response = await fetch(tokenUrl, {
  //     body: params.toString(),
  //     headers: {
  //       Accept: 'application/x-www-form-urlencoded, application/json',
  //       Authorization: `Basic ${credentials}`,
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     method: 'POST',
  //   })

  //   if (!response.ok) {
  //     throw new APIError(
  //       `Could not fetch access token for ${fullWebhookAuth.title}`,
  //       500,
  //       null,
  //       true,
  //     )
  //   }

  //   const data = await response.json()

  //   return { Authorization: `Bearer ${data.access_token}` }
  // }

  return null
}
