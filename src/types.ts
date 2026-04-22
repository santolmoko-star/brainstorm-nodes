export type NodeType = 'root' | 'branch' | 'leaf'

export interface AINode {
  id: string
  label: string
  description?: string
  parentId: string | null
}

export interface MindMapJSON {
  nodes: AINode[]
}

export interface MindMapNodeData extends Record<string, unknown> {
  label: string
  description?: string
  nodeType: NodeType
  color: string
  depth: number
}
