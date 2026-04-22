import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { MindMapNodeData } from '../../types'

export function MindMapNode({ data, selected }: NodeProps<MindMapNodeData>) {
  const isRoot = data.nodeType === 'root'

  return (
    <div
      style={{
        borderLeft: `3px solid ${data.color}`,
        boxShadow: selected
          ? `0 0 0 2px ${data.color}55, 0 8px 32px rgba(0,0,0,0.5)`
          : '0 4px 20px rgba(0,0,0,0.4)',
      }}
      className={`
        relative rounded-lg bg-[#1a1a2e] border border-[#2d2d4e]
        transition-all duration-200 hover:border-[#3d3d6e] hover:shadow-xl
        ${isRoot ? 'min-w-[160px] px-5 py-4' : 'min-w-[140px] px-4 py-3'}
      `}
    >
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            background: data.color,
            border: 'none',
            width: 8,
            height: 8,
            left: -4,
          }}
        />
      )}

      <div className="flex items-start gap-2">
        {isRoot && (
          <div
            className="mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: data.color, boxShadow: `0 0 8px ${data.color}` }}
          />
        )}
        <div>
          <p
            className={`font-semibold leading-tight ${isRoot ? 'text-base text-white' : 'text-sm text-slate-200'}`}
          >
            {data.label}
          </p>
          {data.description && (
            <p className="text-xs text-slate-500 mt-1 leading-snug max-w-[180px]">
              {data.description}
            </p>
          )}
        </div>
      </div>

      {data.nodeType !== 'leaf' && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: data.color,
            border: 'none',
            width: 8,
            height: 8,
            right: -4,
          }}
        />
      )}
    </div>
  )
}
