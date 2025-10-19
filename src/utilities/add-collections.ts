import type { CollectionConfig, Config, Endpoint } from 'payload'
import type { N8nWebhooksConfig } from 'src/index.js'

import type { CollectionOverrides } from './types.js'

import { n8nAuthCredentials } from '../collections/auths.js'
import { n8nWebhooks } from '../collections/webhooks.js'

export function addPluginCollections(pluginOptions: N8nWebhooksConfig, config: Config) {
  if (!config.collections) {
    config.collections = []
  }

  // --- Add the webhook collection to the payload config
  const webhookCollection = overrideCollection({
    collection: n8nWebhooks,
    overrides: pluginOptions.n8nWebhookOverrides,
  })

  const webhookAuthCollection = overrideCollection({
    collection: n8nAuthCredentials,
    overrides: pluginOptions.n8nAuthCredentialOverrides,
  })

  // const webhookLogsCollection = overrideCollection({
  //   collection: WebhookLogs,
  //   overrides: pluginOptions.webhookLogOverrides,
  // })

  const webhookNativeCollections = [
    webhookCollection,
    webhookAuthCollection,
    // webhookLogsCollection
  ]

  // if (typeof pluginOptions.collectionsWrapperFn === 'function') {
  //   const wrappedCollections = pluginOptions.collectionsWrapperFn(webhookNativeCollections)
  //   config.collections.push(...wrappedCollections)
  // } else {
  //   config.collections.push(...webhookNativeCollections)
  // }
  config.collections.push(...webhookNativeCollections)
  return config
}

interface OverrideCollection {
  collection: CollectionConfig
  overrides?: CollectionOverrides
}

function overrideCollection({ collection, overrides }: OverrideCollection): CollectionConfig {
  const newCollection = {
    ...collection,
    access: {
      ...collection.access,
      ...overrides?.access,
    },
    admin: {
      ...collection.admin,
      ...overrides?.admin,
    },
    endpoints: [],
  }

  if (overrides?.endpoints?.length) {
    ;(newCollection.endpoints as Endpoint[]).push(...overrides.endpoints)
  } else if (collection.endpoints && collection.endpoints?.length) {
    ;(newCollection.endpoints as Endpoint[]).push(...collection.endpoints)
  }

  newCollection.fields =
    typeof overrides?.fields === 'function'
      ? overrides.fields(collection.fields)
      : collection.fields

  return newCollection
}
