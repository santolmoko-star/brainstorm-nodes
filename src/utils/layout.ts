import type { Node, Edge } from '@xyflow/react'
import type { AINode, MindMapNodeData } from '../types'

const BRANCH_COLORS = [
  '#7c3aed',
  '#2563eb',
  '#0891b2',
  '#059669',
  '#d97706',
  '#dc2626',
  '#db2777',
]

const H_GAP = 320
const V_GAP = 110

interface TreeNode {
  data: AINode
  children: TreeNode[]
  depth: number
  color: string
  x: number
  y: number
  subtreeHeight: number
}

function buildTree(nodes: AINode[]): TreeNode | null {
  const root = nodes.find(n => n.parentId === null)
  if (!root) return null

  const map = new Map<string, TreeNode>()
  nodes.forEach(n => map.set(n.id, {
    data: n,
    children: [],
    depth: 0,
    color: '#7c3aed',
    x: 0,
    y: 0,
    subtreeHeight: 1,
  }))

  nodes.forEach(n => {
    if (n.parentId && map.has(n.parentId)) {
      map.get(n.parentId)!.children.push(map.get(n.id)!)
    }
  })

  const rootNode = map.get(root.id)!

  // Assign depth and colors
  const queue: [TreeNode, number, string][] = [[rootNode, 0, '#7c3aed']]
  rootNode.children.forEach((child, i) => {
    queue.push([child, 1, BRANCH_COLORS[i % BRANCH_COLORS.length]])
  })

  // BFS to assign depth & color
  const visited = new Set<string>()
  const bfsQueue: [TreeNode, number, string][] = [[rootNode, 0, '#7c3aed']]
  while (bfsQueue.length) {
    const [node, depth, color] = bfsQueue.shift()!
    if (visited.has(node.data.id)) continue
    visited.add(node.data.id)
    node.depth = depth
    node.color = depth === 0 ? '#7c3aed' : color
    node.children.forEach((child, i) => {
      const childColor = depth === 0 ? BRANCH_COLORS[i % BRANCH_COLORS.length] : color
      bfsQueue.push([child, depth + 1, childColor])
    })
  }

  return rootNode
}

function calcSubtreeHeight(node: TreeNode): number {
  if (node.children.length === 0) {
    node.subtreeHeight = 1
    return 1
  }
  const total = node.children.reduce((sum, c) => sum + calcSubtreeHeight(c), 0)
  node.subtreeHeight = total
  return total
}

function assignPositions(node: TreeNode, x: number, yStart: number): void {
  const totalHeight = node.subtreeHeight * V_GAP
  node.x = x
  node.y = yStart + totalHeight / 2 - V_GAP / 2

  let currentY = yStart
  node.children.forEach(child => {
    const childHeight = child.subtreeHeight * V_GAP
    assignPositions(child, x + H_GAP, currentY)
    currentY += childHeight
  })
}

function flattenTree(node: TreeNode, result: TreeNode[] = []): TreeNode[] {
  result.push(node)
  node.children.forEach(c => flattenTree(c, result))
  return result
}

export function buildFlowGraph(aiNodes: AINode[]): { nodes: Node<MindMapNodeData>[]; edges: Edge[] } {
  const tree = buildTree(aiNodes)
  if (!tree) return { nodes: [], edges: [] }

  calcSubtreeHeight(tree)
  assignPositions(tree, 0, 0)

  const flat = flattenTree(tree)

  const nodes: Node<MindMapNodeData>[] = flat.map(t => ({
    id: t.data.id,
    type: 'mindMapNode',
    position: { x: t.x, y: t.y },
    data: {
      label: t.data.label,
      description: t.data.description,
      nodeType: t.depth === 0 ? 'root' : t.children.length > 0 ? 'branch' : 'leaf',
      color: t.color,
      depth: t.depth,
    },
  }))

  const edges: Edge[] = aiNodes
    .filter(n => n.parentId !== null)
    .map(n => {
      const parentNode = flat.find(t => t.data.id === n.parentId)
      return {
        id: `e-${n.parentId}-${n.id}`,
        source: n.parentId!,
        target: n.id,
        type: 'smoothstep',
        style: {
          stroke: parentNode?.color ?? '#7c3aed',
          strokeWidth: 2,
          opacity: 0.7,
        },
        animated: false,
      }
    })

  return { nodes, edges }
}
