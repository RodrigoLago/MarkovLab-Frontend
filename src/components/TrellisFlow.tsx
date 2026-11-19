import { useMemo } from 'react';
import {
  Background, BackgroundVariant, Controls, Handle, MarkerType, Position, ReactFlow,
  type Edge, type Node, type NodeProps, type NodeTypes,
} from '@xyflow/react';
import type { HiddenMarkovModel, ViterbiResult } from '../types/hmm';

type TrellisNodeData = {
  label: string;
  detail: string;
  color: 'violet' | 'cyan' | 'start';
  onPath: boolean;
};

type TrellisNode = Node<TrellisNodeData, 'trellis'>;
type ColumnNode = Node<{ nucleotide: string; position: number; current: boolean }, 'column'>;

function TrellisStateNode({ data }: NodeProps<TrellisNode>) {
  return (
    <div className={`trellis-node ${data.color} ${data.onPath ? 'on-path' : ''}`}>
      <Handle type="target" position={Position.Left} className="flow-handle" />
      <div className="trellis-node-symbol">{data.label}</div>
      <div className="trellis-node-info">
        <strong>{data.detail}</strong>
      </div>
      <Handle type="source" position={Position.Right} className="flow-handle" />
    </div>
  );
}

function ColumnHeader({ data }: NodeProps<ColumnNode>) {
  return <div className={`trellis-column-label ${data.current ? 'current' : ''}`}><small>t = {data.position + 1}</small><strong>{data.nucleotide}</strong></div>;
}

const nodeTypes: NodeTypes = { trellis: TrellisStateNode, column: ColumnHeader };
const COL_GAP = 270;
const ROW_GAP = 175;
const FIRST_X = 250;
const FIRST_Y = 135;

interface Props {
  model: HiddenMarkovModel;
  sequence: string;
  result: ViterbiResult | null;
}

export function TrellisFlow({ model, sequence, result }: Props) {
  const sequenceLength = sequence.length;

  const { nodes, edges } = useMemo(() => {
    const computedNodes: (TrellisNode | ColumnNode)[] = [{
      id: 'start',
      type: 'trellis',
      position: { x: 10, y: FIRST_Y + (model.states.length - 1) * ROW_GAP / 2 },
      draggable: false,
      data: {
        label: '▶', detail: 'Inicio', color: 'start', onPath: false,
      },
    }];
    const computedEdges: Edge[] = [];

    for (let position = 0; position < sequenceLength; position++) {
      computedNodes.push({
        id: `header:${position}`, type: 'column', draggable: false,
        position: { x: FIRST_X + position * COL_GAP + 53, y: 22 },
        selectable: false,
        data: { nucleotide: sequence[position], position, current: false },
      });
      for (let stateIndex = 0; stateIndex < model.states.length; stateIndex++) {
        const state = model.states[stateIndex];
        const id = `${position}:${state.id}`;
        const onPath = result?.statePath[position] === state.id;

        computedNodes.push({
          id, type: 'trellis', draggable: false,
          position: { x: FIRST_X + position * COL_GAP, y: FIRST_Y + stateIndex * ROW_GAP },
          data: {
            label: state.id,
            detail: state.name,
            color: stateIndex % 2 === 0 ? 'violet' : 'cyan',
            onPath,
          },
        });

        if (position === 0) {
          const finalPath = onPath;
          computedEdges.push({
            id: `start-${id}`, source: 'start', target: id, type: 'smoothstep',
            animated: finalPath,
            markerEnd: { type: MarkerType.ArrowClosed, color: finalPath ? '#e77d53' : '#9eaca8' },
            style: { stroke: finalPath ? '#e77d53' : '#9eaca8', strokeWidth: finalPath ? 3.2 : 1.6 },
            zIndex: finalPath ? 10 : 0,
          });
          continue;
        }

        for (const previousState of model.states) {
          const transition = model.transitions.find(t => t.fromStateId === previousState.id && t.toStateId === state.id);
          if (transition === undefined || transition.probability === 0) continue;

          const finalPath = onPath && result?.statePath[position - 1] === previousState.id;
          const highlight = finalPath;

          computedEdges.push({
            id: `${position - 1}:${previousState.id}-${id}`,
            source: `${position - 1}:${previousState.id}`, target: id,
            type: 'straight',
            animated: highlight,
            markerEnd: { type: MarkerType.ArrowClosed, color: highlight ? '#e77d53' : '#aabbb6' },
            style: {
              stroke: highlight ? '#e77d53' : '#aabbb6',
              strokeWidth: highlight ? 3.5 : 1.5,
              opacity: highlight ? 1 : .48,
            },
            zIndex: highlight ? 10 : 0,
          });
        }
      }
    }

    return { nodes: computedNodes, edges: computedEdges };
  }, [model, sequence, sequenceLength, result]);

  return (
    <div className="graph-canvas trellis-canvas">
      <ReactFlow
        nodes={nodes} edges={edges} nodeTypes={nodeTypes}
        defaultViewport={{ x: 100, y: 80, zoom: .75 }}
        minZoom={.2} maxZoom={1.7}
        nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
        colorMode="light" proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="#d8dfdc" />
        <Controls showInteractive={false} />

      </ReactFlow>
    </div>
  );
}
