'use client'
import React, { useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls
} from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';
 
const initialNodes = [
  { id: '1', position: { x: 100, y: 0 }, data: { label: 'A' } }, // If this is a cobegin the x value is the middle of the childrens
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'B' } },// Mantains the same y as the basic
  { id: '3', position: {x:200, y: 100}, data: {label: 'C'}},
  { id: '4', position: {x:100, y: 200}, data: {label: 'D'}} // same as the first
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' }, 
  {id: 'e1-3', source:'1', target: '3'},
  {id: '2-4', source:'2', target: '4'},
  {id: '3-4', source:'3', target: '4'}
];
 
export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback(
    (params: any) => setEdges((eds :any) => addEdge(params, eds)),
    [setEdges],
  );
 
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactFlow
        colorMode="dark"
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}