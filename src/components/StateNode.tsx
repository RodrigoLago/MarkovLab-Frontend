import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

export type StateNodeData = {
  label: string;
  initialProbability: number;
  active: boolean;
  onPath: boolean;
  color: 'violet' | 'cyan';
};
export type StateFlowNode = Node<StateNodeData, 'state'>;

export function StateNode({ data }: NodeProps<StateFlowNode>) {
  return (
    <div className={`state-node ${data.color} ${data.active ? 'active' : ''} ${data.onPath ? 'on-path' : ''}`}>
      <Handle type="source" id="right-source" position={Position.Right} style={{ top: '35%' }} className="flow-handle" />
      <Handle type="target" id="right-target" position={Position.Right} style={{ top: '70%' }} className="flow-handle" />
      <Handle type="source" id="left-source" position={Position.Left} style={{ top: '70%' }} className="flow-handle" />
      <Handle type="target" id="left-target" position={Position.Left} style={{ top: '35%' }} className="flow-handle" />
      <Handle type="source" id="top-source" position={Position.Top} style={{ left: '35%' }} className="flow-handle" />
      <Handle type="target" id="top-target" position={Position.Top} style={{ left: '65%' }} className="flow-handle" />
      <div className="node-orbit" />
      <div className="node-icon">{data.label.slice(0, 1)}</div>
      <div className="node-name">{data.label}</div>
      <div className="node-meta">p = {data.initialProbability.toFixed(2)}</div>
      <span className="node-status">{data.active ? 'CALCULANDO' : data.onPath ? 'CAMINO ÓPTIMO' : 'ESTADO OCULTO'}</span>
    </div>
  );
}
