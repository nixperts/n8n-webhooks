# About

[N8n](https://n8n.io) allows users to create intricate flows and make powerful connections between apps and automation. 

[PayloadCMS](https://payloadcms.com/) is a NextJS-based framework for creating content management systems and other enterprise-grade web applications. 

This plugin bridges the gap, so that PayloadCMS can easily trigger flows in n8n.

# WARNING: Early work in progress
- Don't expect this plugin to cover everything. It is still very early. High-quality issues and PRs are appreciated.
- Things will break, before a stable `1.0.0` is published

# Installation
Depending on your package manager:
``` sh
npm install @nixperts/n8n-webhooks
pnpm add @nixperts/n8n-webhooks
bun add @nixperts/n8n-webhooks
yarn add @nixperts/n8n-webhooks
```

# Plugin Configuration
- In your `payload.config.ts` register the plugin under the `plugins` section

``` ts
import { n8nWebhooks } from '@nixperts/n8n-webhooks'

export default buildConfig({
    // ... your payload config
    plugins: [
        // ... other plugins
        n8nWebhooks({
            // pass the base URL to your n8n instance. It will be used to construct the webhook endpoint
            baseUrl: process.env.N8N_BASE_URL ?? 'http://localhost:5678',
            // set to true to enable the plugin
            enabled: true,
            // if you are testing things out set this to true. It slightly alters the webhook endpoint of n8n
            useTestInstance: true,
        })
    ],
})
```

# Plugin Collections
The plugin installs two new collections in your PayloadCMS instance:
1. **Webhooks**: Register different webhooks from your n8n instance here
2. **Auth Credentials**: Configure authentication credentials used by your webhooks for n8n

![Example of a configured webhook](https://github.com/nixperts/n8n-webhooks/blob/main/docs/webhooks-example.png)

💡 In the detail view of the `Webhooks` collection, you can test the webhooks

# Usage
- The plugin exports the function `makeN8nWebhookRequest()`: 
  - import it with `import {makeN8nWebhookRequest} from "@nixperts/n8n-webhooks"`
  - use in your code to make request to the n8n webhook endpoints
- You can create `relationship` fields in other collections of your PayloadCMS instance which refer to webhooks. This way you can simply provide powerful functionality to your admins.

# Roadmap 
-   What does the plugin do
-   Installation
-   Configuration
-   Usage
-   Getting started
