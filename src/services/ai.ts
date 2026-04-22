import Anthropic from '@anthropic-ai/sdk'
import type { MindMapJSON } from '../types'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

const SYSTEM_PROMPT = `You are a mind map generator. When given a topic, return ONLY valid JSON with no markdown, no code blocks, no explanation.

The JSON format must be exactly:
{
  "nodes": [
    {"id": "root", "label": "...", "description": "one sentence", "parentId": null},
    {"id": "n1", "label": "...", "description": "one sentence", "parentId": "root"},
    {"id": "n2", "label": "...", "description": "one sentence", "parentId": "root"},
    {"id": "n1_1", "label": "...", "description": "one sentence", "parentId": "n1"}
  ]
}

Rules:
- Root node: parentId must be null, label is the main topic
- 5-7 main branches from root (parentId: "root")
- 2-3 sub-nodes per branch
- Labels: concise, 2-4 words max
- descriptions: single short sentence
- IDs: simple unique strings (n1, n2, n1_1, n1_2, etc.)
- Total nodes: 20-30
- Return ONLY the JSON object, nothing else`

export async function generateMindMap(topic: string): Promise<MindMapJSON> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: `Create a mind map for: ${topic}` }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const json = JSON.parse(text.trim()) as MindMapJSON
    return json
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0]) as MindMapJSON
    throw new Error('Failed to parse AI response as JSON')
  }
}
