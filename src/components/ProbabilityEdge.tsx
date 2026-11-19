import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from '@xyflow/react';

export function ProbabilityEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, label }: EdgeProps) {
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
    borderRadius: 14,
  });

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} className="probability-edge-path" />
      <EdgeLabelRenderer>
        <div className="probability-edge-label" style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}>
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
