import type { Config } from 'payload'

import type { CollectionOverrides } from './utilities/types.js'

import { addPluginCollections } from './utilities/add-collections.js'

export type N8nWebhooksConfig = {
  /** The baseURL for your n8n instance */
  baseUrl: string
  /** Set the plugin to be used or not */
  enabled?: boolean
  /** Override and customize the n8n-auth-credentials collection */
  n8nAuthCredentialOverrides?: CollectionOverrides
  /** Override and customize the n8n-webhooks collection */
  n8nWebhookOverrides?: CollectionOverrides
  /** Set to true if you are using the test webhook functionality of n8n
   * Will suffix the baseUrl with /test-webhook/ instead of /webhook */
  useTestInstance?: boolean
}

export const n8nWebhooks =
  (pluginOptions: N8nWebhooksConfig) =>
  (config: Config): Config => {
    if (!config.collections) {
      config.collections = []
    }

    config = addPluginCollections(pluginOptions, config)

    /**
     * If the plugin is disabled, we still want to keep added collections/fields so the database schema is consistent which is important for migrations.
     * If your plugin heavily modifies the database schema, you may want to remove this property.
     */
    if (!pluginOptions.enabled) {
      return config
    }

    if (!config.endpoints) {
      config.endpoints = []
    }

    if (!config.admin) {
      config.admin = {}
    }

    // if (!config.admin.components) {
    //   config.admin.components = {}
    // }

    // if (!config.admin.components.beforeDashboard) {
    //   config.admin.components.beforeDashboard = []
    // }

    // config.admin.components.beforeDashboard.push(`n8n-webhooks/client#BeforeDashboardClient`)
    // config.admin.components.beforeDashboard.push(`n8n-webhooks/rsc#BeforeDashboardServer`)

    // config.endpoints.push({
    //   handler: customEndpointHandler,
    //   method: 'get',
    //   path: '/my-plugin-endpoint',
    // })

    if (!config.custom) {
      config.custom = {}
    }

    if (!config.custom.n8nWebhookPlugin) {
      config.custom.n8nWebhookPlugin = {
        baseUrl: pluginOptions.baseUrl,
        useTestInstance: pluginOptions.useTestInstance ?? false,
      }
    }

    const incomingOnInit = config.onInit

    config.onInit = async (payload) => {
      // Ensure we are executing any existing onInit functions before running our own.
      if (incomingOnInit) {
        await incomingOnInit(payload)
      }
    }

    return config
  }
