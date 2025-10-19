export interface N8NWebhook {
  auth: {
    /**
     * Choose which authentication method should be used. You can set up an authentication method once and then re-use it.
     */
    credentials?: N8NAuthCredential | (null | string)
    /**
     * Set authentication if applicable
     */
    type: 'basic-auth' | 'none'
  }
  createdAt: string
  id: string
  /**
   * The method expected from n8n for this webhook
   */
  method: 'get' | 'post'
  /**
   * A title for you to recognize the webhook
   */
  title?: null | string
  updatedAt: string
  /**
   * The path of the webhook provided by n8n
   */
  webhookPath: string
}

export interface N8NAuthCredential {
  basicAuth?: {
    /**
     * The password used for basic auth with n8n
     */
    password: string
    /**
     * The username used for basic auth with n8n
     */
    username: string
  }
  createdAt: string
  id: string
  /**
   * A title for you to recognize the authentication credentials
   */
  title: string
  /**
   * The method expected from n8n for this webhook
   */
  type: 'basic-auth'
  updatedAt: string
}
