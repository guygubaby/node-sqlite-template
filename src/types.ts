import type { ChatCompletionMessageParam } from 'openai/resources/chat'

export interface IRequestProps {
  messages: ChatCompletionMessageParam[]
  max_tokens?: number
  temperature?: number
  top_p?: number
  frequency_penalty?: number
  stop?: null
  // stream?: boolean
}
