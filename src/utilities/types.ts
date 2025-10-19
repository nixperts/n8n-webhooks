import type { CollectionConfig, Endpoint, Payload } from 'payload'

import type { N8NWebhook } from './generated-collection-types.js'

/** Override some of the functionality of the collection */
export interface CollectionOverrides {
  /** Override the access rules of the collection */
  access?: CollectionConfig['access']
  /** Override the admin customizations of the collection */
  admin?: CollectionConfig['admin']
  /** Override the endpoints of the collection */
  endpoints?: Endpoint[]
  /** Override fields or add new fields
   * @param {CollectionConfig['fields']} fields - The original fields of the collection
   * @returns {CollectionCongig['fields']} - The new fields of the collection */
  fields?: (fields: CollectionConfig['fields']) => CollectionConfig['fields']
}

export type MakeWebhookRequest = {
  /** The additional context that can be used when tranforming the request body.
   * Requires to have requestBodyTransformers activated */
  additionalContext?: Record<string, any>
  /** When the fields of the webhooks logs are extended by an additional field, you can pass these the fields and values here */
  additionalLogFields?: Record<string, any>
  /** Provide the body to be used in the webhook request */
  body: any
  /** The instance of payload in your project */
  payload: Payload
  /** The webhookId or fully resolved webhook to execute */
  webhook?: N8NWebhook | null | string | undefined
}
