import { useMemo } from 'react';
import {
  Background, BackgroundVariant, Controls, MarkerType, ReactFlow,
  type Edge, type EdgeTypes, type NodeTypes,
} from '@xyflow/react';
import { StateNode, type StateFlowNode } from './StateNode';
import { ProbabilityEdge } from './ProbabilityEdge';
import type { HiddenMarkovModel, ViterbiResult } from '../types/hmm';

const nodeTypes: NodeTypes = { state: StateNode };
const edgeTypes: EdgeTypes = { probability: ProbabilityEdge };

interface Props {
  model: HiddenMarkovModel;
  result: ViterbiResult | null;
}

export function HmmFlow({ model, result }: Props) {
  const nodes = useMemo<StateFlowNode[]>(() => model.states.map((state, index) => ({
    id: state.id,
    type: 'state',
    position: { x: 110 + index * 430, y: 235 },
    draggable: false,
    data: {
      label: state.name,
      initialProbability: state.initialProbability,
      active: false,
      onPath: result?.statePath.includes(state.id) ?? false,
      color: index % 2 === 0 ? 'violet' : 'cyan',
    },
  })), [model, result]);

  const edges = useMemo<Edge[]>(() => model.transitions.map((transition) => {
    const isLoop = transition.fromStateId === transition.toStateId;
    const forward = model.states.findIndex(s => s.id === transition.fromStateId)
      < model.states.findIndex(s => s.id === transition.toStateId);
    return {
      id: `${transition.fromStateId}-${transition.toStateId}`,
      source: transition.fromStateId,
      target: transition.toStateId,
      sourceHandle: isLoop ? 'top-source' : forward ? 'right-source' : 'left-source',
      targetHandle: isLoop ? 'top-target' : forward ? 'left-target' : 'right-target',
      type: 'probability',
      label: `${Math.round(transition.probability * 100)}%`,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#506f6b' },
    };
  }), [model]);

  return (
    <div className="graph-canvas">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} fitView fitViewOptions={{ padding: 0.24 }}
        nodesConnectable={false} nodesDraggable={false} elementsSelectable={false} colorMode="light"
        proOptions={{ hideAttribution: true }}>
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="#d8dfdc" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
