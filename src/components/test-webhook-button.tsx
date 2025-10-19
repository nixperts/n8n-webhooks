'use client'

import { Button, toast, useDocumentInfo } from '@payloadcms/ui'
import { APIError } from 'payload'

export function TestWebhookButton() {
  const { data } = useDocumentInfo()

  async function handleClick() {
    const webhookPath = data?.webhookPath
    if (!webhookPath) {
      throw new APIError(
        `Webhook path is missing! Please fill out the webhook before testing`,
        400,
        null,
        true,
      )
    }

    const response = await fetch(`/api/n8n-webhooks/fire-webhook/${webhookPath}`, {
      method: 'post',
    })
    if (!response.ok) {
      return toast('☠️ Failed to executed webhook')
    }

    toast('✅ Successfully executed webhook')
  }
  return (
    <Button buttonStyle="secondary" onClick={handleClick}>
      Trigger webhook
    </Button>
  )
}
