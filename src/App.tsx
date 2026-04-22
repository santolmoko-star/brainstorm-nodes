import { useState } from 'react'
import type { Node, Edge } from '@xyflow/react'
import { HomePage } from './components/HomePage'
import { MindMapFlow } from './components/MindMapFlow'
import { generateMindMap } from './services/ai'
import { buildFlowGraph } from './utils/layout'
import type { MindMapNodeData } from './types'

type View = 'home' | 'map'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [topic, setTopic] = useState('')
  const [nodes, setNodes] = useState<Node<MindMapNodeData>[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  const handleGenerate = async (inputTopic: string) => {
    setLoading(true)
    setError(undefined)
    setTopic(inputTopic)

    try {
      const mindMapJSON = await generateMindMap(inputTopic)
      const { nodes: flowNodes, edges: flowEdges } = buildFlowGraph(mindMapJSON.nodes)
      setNodes(flowNodes)
      setEdges(flowEdges)
      setView('map')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      if (msg.toLowerCase().includes('api key') || msg.toLowerCase().includes('auth')) {
        setError('Missing or invalid API key. Add VITE_ANTHROPIC_API_KEY to your .env file.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  if (view === 'map') {
    return (
      <MindMapFlow
        nodes={nodes}
        edges={edges}
        topic={topic}
        onBack={() => setView('home')}
      />
    )
  }

  return <HomePage onSubmit={handleGenerate} loading={loading} error={error} />
}
