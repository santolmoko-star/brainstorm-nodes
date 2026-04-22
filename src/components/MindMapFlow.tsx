import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
} from '@xyflow/react'
import type { Node, Edge } from '@xyflow/react'
import { MindMapNode } from './nodes/MindMapNode'
import type { MindMapNodeData } from '../types'

const nodeTypes = { mindMapNode: MindMapNode }

interface Props {
  nodes: Node<MindMapNodeData>[]
  edges: Edge[]
  onBack: () => void
  topic: string
}

export function MindMapFlow({ nodes: initialNodes, edges: initialEdges, onBack, topic }: Props) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (connection: Connection) => setEdges(eds => addEdge(connection, eds)),
    [setEdges]
  )

  return (
    <div className="w-full h-screen relative">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3 bg-[#0d0d1a]/90 backdrop-blur border-b border-[#2d2d4e]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            New map
          </button>
          <div className="w-px h-4 bg-[#2d2d4e]" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_#7c3aed]" />
            <span className="text-white font-medium text-sm">{topic}</span>
          </div>
        </div>
        <div className="text-xs text-slate-500">
          {nodes.length} nodes · {edges.length} connections
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { strokeWidth: 2 },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#2d2d4e"
        />
        <Controls position="bottom-left" />
        <MiniMap
          position="bottom-right"
          nodeColor={(n) => (n.data as MindMapNodeData).color}
          maskColor="rgba(13,13,26,0.8)"
        />
      </ReactFlow>
    </div>
  )
}
