import React, { useState, useRef, useCallback, useEffect, useReducer } from 'react';
import {
  Trash2, ZoomIn, ZoomOut, MousePointer, Copy, Clipboard, Undo2, Redo2,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Grid, Download,
  Maximize2, Minimize2, Link2, Scissors, RotateCcw, Hand
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';

// ─── Shape library ────────────────────────────────────────────────────────────
export const SHAPES = {
  rect:         { label: 'Rectangle',    w: 120, h: 60,  fill: '#dbeafe', stroke: '#3b82f6' },
  class:        { label: 'Class',        w: 150, h: 90,  fill: '#ede9fe', stroke: '#7c3aed' },
  actor:        { label: 'Actor',        w: 60,  h: 80,  fill: '#dcfce7', stroke: '#16a34a' },
  diamond:      { label: 'Decision',     w: 110, h: 65,  fill: '#fef3c7', stroke: '#d97706' },
  cylinder:     { label: 'Database',     w: 100, h: 70,  fill: '#fce7f3', stroke: '#db2777' },
  parallelogram:{ label: 'Input/Output', w: 130, h: 55,  fill: '#e0f2fe', stroke: '#0284c7' },
  hexagon:      { label: 'Hexagon',      w: 120, h: 65,  fill: '#f0fdf4', stroke: '#15803d' },
  rounded:      { label: 'Rounded Rect', w: 130, h: 55,  fill: '#fff7ed', stroke: '#ea580c' },
  note:         { label: 'Note',         w: 130, h: 70,  fill: '#fefce8', stroke: '#ca8a04' },
  swimlane:     { label: 'Swimlane',     w: 200, h: 120, fill: '#f1f5f9', stroke: '#475569' },
  text:         { label: 'Text',         w: 100, h: 30,  fill: 'none',    stroke: 'none'    },
  umlStart:     { label: 'Start',        w: 30,  h: 30,  fill: '#1e293b', stroke: '#1e293b' },
  umlEnd:       { label: 'End',          w: 34,  h: 34,  fill: 'none',    stroke: '#1e293b' },
  usecase:      { label: 'Use Case',     w: 140, h: 55,  fill: '#ede9fe', stroke: '#7c3aed' },
  component:    { label: 'Component',    w: 130, h: 60,  fill: '#dbeafe', stroke: '#2563eb' },
  interface:    { label: 'Interface',    w: 120, h: 80,  fill: '#f0f9ff', stroke: '#0ea5e9' },
};

// ─── All draw.io-style edge/connector types ───────────────────────────────────
export const EDGE_TYPES = [
  { id: 'association',     label: 'Association',        dash: '',        startArrow: 'none',    endArrow: 'open'          },
  { id: 'dependency',      label: 'Dependency',         dash: '6,3',     startArrow: 'none',    endArrow: 'open'          },
  { id: 'generalization',  label: 'Generalization',     dash: '',        startArrow: 'none',    endArrow: 'triangle'      },
  { id: 'realization',     label: 'Realization',        dash: '6,3',     startArrow: 'none',    endArrow: 'triangle'      },
  { id: 'aggregation',     label: 'Aggregation',        dash: '',        startArrow: 'diamond', endArrow: 'none'          },
  { id: 'composition',     label: 'Composition',        dash: '',        startArrow: 'diamond-filled', endArrow: 'none'   },
  { id: 'directed',        label: 'Directed Assoc.',    dash: '',        startArrow: 'none',    endArrow: 'open'          },
  { id: 'bidirectional',   label: 'Bidirectional',      dash: '',        startArrow: 'open',    endArrow: 'open'          },
  { id: 'include',         label: 'Include (<<include>>)',dash:'6,3',    startArrow: 'none',    endArrow: 'open',  labelFixed:'<<include>>' },
  { id: 'extend',          label: 'Extend (<<extend>>)', dash:'6,3',     startArrow: 'none',    endArrow: 'open',  labelFixed:'<<extend>>'  },
  { id: 'sequence',        label: 'Sequence Message',   dash: '',        startArrow: 'none',    endArrow: 'open'          },
  { id: 'return',          label: 'Return Message',     dash: '6,3',     startArrow: 'none',    endArrow: 'open'          },
  { id: 'create',          label: 'Create Message',     dash: '6,3',     startArrow: 'none',    endArrow: 'triangle'      },
  { id: 'destroy',         label: 'Destroy Message',    dash: '',        startArrow: 'none',    endArrow: 'x'             },
  { id: 'self',            label: 'Self Message',       dash: '',        startArrow: 'none',    endArrow: 'open'          },
  { id: 'uses',            label: 'Uses / Calls',       dash: '',        startArrow: 'none',    endArrow: 'open'          },
  { id: 'nary',            label: 'N-ary Association',  dash: '',        startArrow: 'none',    endArrow: 'none'          },
  { id: 'line',            label: 'Plain Line',         dash: '',        startArrow: 'none',    endArrow: 'none'          },
];

let _id = Date.now();
const uid = () => `e${_id++}`;

// ─── Undo/Redo ────────────────────────────────────────────────────────────────
function historyReducer(state, action) {
  switch (action.type) {
    case 'COMMIT': {
      const past = [...state.past, state.present].slice(-50);
      return { past, present: action.payload, future: [] };
    }
    case 'UNDO': {
      if (!state.past.length) return state;
      return { past: state.past.slice(0,-1), present: state.past[state.past.length-1], future: [state.present, ...state.future] };
    }
    case 'REDO': {
      if (!state.future.length) return state;
      const [next, ...future] = state.future;
      return { past: [...state.past, state.present], present: next, future };
    }
    default: return state;
  }
}

// ─── Port helpers ─────────────────────────────────────────────────────────────
function getPortPoint(node, side) {
  const cx = node.x + node.w/2, cy = node.y + node.h/2;
  if (side === 'top')    return { x: cx,        y: node.y          };
  if (side === 'bottom') return { x: cx,        y: node.y + node.h };
  if (side === 'left')   return { x: node.x,    y: cy              };
  if (side === 'right')  return { x: node.x + node.w, y: cy        };
  return { x: cx, y: cy };
}

function getClosestPort(fromNode, toNode) {
  if (!fromNode || !toNode) return { from:{x:0,y:0}, to:{x:0,y:0} };
  const fcx = fromNode.x+fromNode.w/2, fcy = fromNode.y+fromNode.h/2;
  const tcx = toNode.x+toNode.w/2,    tcy = toNode.y+toNode.h/2;
  const dx = tcx-fcx, dy = tcy-fcy;
  let fromSide, toSide;
  if (Math.abs(dx) > Math.abs(dy)) {
    fromSide = dx>0 ? 'right' : 'left'; toSide = dx>0 ? 'left' : 'right';
  } else {
    fromSide = dy>0 ? 'bottom' : 'top'; toSide = dy>0 ? 'top' : 'bottom';
  }
  return { from: getPortPoint(fromNode,fromSide), to: getPortPoint(toNode,toSide) };
}

// ─── Arrow marker path ────────────────────────────────────────────────────────
function arrowPath(type) {
  if (type === 'open')           return 'M0,0 L8,4 L0,8';
  if (type === 'triangle')       return 'M0,0 L10,5 L0,10 Z';
  if (type === 'diamond')        return 'M0,4 L6,0 L12,4 L6,8 Z';
  if (type === 'diamond-filled') return 'M0,4 L6,0 L12,4 L6,8 Z';
  if (type === 'x')              return 'M0,0 L8,8 M0,8 L8,0';
  return null;
}
function arrowFill(type, color) {
  if (type === 'triangle' || type === 'diamond-filled') return color;
  return 'none';
}

// ─── NodeShape ────────────────────────────────────────────────────────────────
function NodeShape({ node, selected, multiSelected }) {
  const { type, x, y, w, h, label, style={} } = node;
  const fill   = style.fill   || SHAPES[type]?.fill   || '#dbeafe';
  const stroke = style.stroke || SHAPES[type]?.stroke || '#3b82f6';
  const sw = selected || multiSelected ? 2 : 1.5;
  const selStroke = selected ? '#6366f1' : multiSelected ? '#a78bfa' : stroke;
  const fontSize = style.fontSize || 12;
  const fontWeight = style.bold ? 'bold' : 'normal';
  const fontStyle  = style.italic ? 'italic' : 'normal';
  const textAnchor = style.align==='left' ? 'start' : style.align==='right' ? 'end' : 'middle';
  const textX = style.align==='left' ? x+8 : style.align==='right' ? x+w-8 : x+w/2;
  const txtColor = style.textColor || '#1e293b';

  const textEl = (label||'').split('\n').map((line,i,arr) => (
    <text key={i}
      x={type==='swimlane' ? x+w/2 : textX}
      y={type==='class' ? y+14+i*14 : type==='swimlane' ? y+18 : y+h/2+(i-(arr.length-1)/2)*(fontSize+3)}
      textAnchor={type==='swimlane'?'middle':textAnchor}
      dominantBaseline="middle"
      fontSize={type==='class'&&i===0 ? fontSize+1 : fontSize}
      fontWeight={type==='class'&&i===0 ? 'bold' : fontWeight}
      fontStyle={fontStyle}
      fill={type==='class'&&i===0 ? '#fff' : txtColor}
      style={{userSelect:'none',pointerEvents:'none'}}
    >{line}</text>
  ));

  const sh = { fill, stroke:selStroke, strokeWidth:sw };

  if (type==='rect')         return <g><rect x={x} y={y} width={w} height={h} rx={2} {...sh}/>{textEl}</g>;
  if (type==='component')    return <g><rect x={x} y={y} width={w} height={h} rx={2} {...sh}/><rect x={x-8} y={y+14} width={16} height={10} fill={fill} stroke={selStroke} strokeWidth={sw-0.5}/><rect x={x-8} y={y+30} width={16} height={10} fill={fill} stroke={selStroke} strokeWidth={sw-0.5}/>{textEl}</g>;
  if (type==='rounded')      return <g><rect x={x} y={y} width={w} height={h} rx={h/2} {...sh}/>{textEl}</g>;
  if (type==='usecase')      return <g><ellipse cx={x+w/2} cy={y+h/2} rx={w/2} ry={h/2} {...sh}/>{textEl}</g>;
  if (type==='umlStart')     return <g><circle cx={x+w/2} cy={y+h/2} r={w/2} fill="#1e293b" stroke={selStroke} strokeWidth={sw}/></g>;
  if (type==='umlEnd')       return <g><circle cx={x+w/2} cy={y+h/2} r={w/2} fill="none" stroke={selStroke} strokeWidth={sw}/><circle cx={x+w/2} cy={y+h/2} r={w/2-5} fill="#1e293b"/></g>;

  if (type==='actor') {
    const cx=x+w/2, r=12;
    return <g>
      <circle cx={cx} cy={y+r} r={r} fill={fill} stroke={selStroke} strokeWidth={sw}/>
      <line x1={cx} y1={y+r*2} x2={cx} y2={y+h-14} stroke={selStroke} strokeWidth={sw}/>
      <line x1={cx-18} y1={y+r*2+10} x2={cx+18} y2={y+r*2+10} stroke={selStroke} strokeWidth={sw}/>
      <line x1={cx} y1={y+h-14} x2={cx-14} y2={y+h} stroke={selStroke} strokeWidth={sw}/>
      <line x1={cx} y1={y+h-14} x2={cx+14} y2={y+h} stroke={selStroke} strokeWidth={sw}/>
      <text x={cx} y={y+h+12} textAnchor="middle" fontSize={fontSize} fontWeight={fontWeight} fontStyle={fontStyle} fill={txtColor} style={{userSelect:'none',pointerEvents:'none'}}>{label}</text>
    </g>;
  }
  if (type==='diamond') {
    const cx=x+w/2, cy=y+h/2;
    return <g><polygon points={`${cx},${y} ${x+w},${cy} ${cx},${y+h} ${x},${cy}`} {...sh}/>{textEl}</g>;
  }
  if (type==='cylinder') {
    const ry=10;
    return <g>
      <path d={`M ${x},${y+ry} a ${w/2},${ry} 0 0 1 ${w},0 l 0,${h-ry*2} a ${w/2},${ry} 0 0 1 ${-w},0 Z`} {...sh}/>
      <ellipse cx={x+w/2} cy={y+ry} rx={w/2} ry={ry} fill={fill} stroke={selStroke} strokeWidth={sw}/>
      {textEl}
    </g>;
  }
  if (type==='parallelogram') {
    const sk=16;
    return <g><polygon points={`${x+sk},${y} ${x+w},${y} ${x+w-sk},${y+h} ${x},${y+h}`} {...sh}/>{textEl}</g>;
  }
  if (type==='hexagon') {
    const mx=x+w/2, s=h/2;
    return <g><polygon points={`${mx},${y} ${x+w},${y+s/2} ${x+w},${y+h-s/2} ${mx},${y+h} ${x},${y+h-s/2} ${x},${y+s/2}`} {...sh}/>{textEl}</g>;
  }
  if (type==='note') {
    const fold=14;
    return <g>
      <path d={`M ${x},${y} L ${x+w-fold},${y} L ${x+w},${y+fold} L ${x+w},${y+h} L ${x},${y+h} Z`} {...sh}/>
      <path d={`M ${x+w-fold},${y} L ${x+w-fold},${y+fold} L ${x+w},${y+fold}`} fill="none" stroke={selStroke} strokeWidth={sw*0.8}/>
      {textEl}
    </g>;
  }
  if (type==='swimlane') {
    return <g>
      <rect x={x} y={y} width={w} height={h} rx={2} {...sh}/>
      <rect x={x} y={y} width={w} height={28} fill={stroke} rx={2} stroke={selStroke} strokeWidth={sw}/>
      {textEl}
    </g>;
  }
  if (type==='class') {
    const div1=28, div2=28;
    const lines=(label||'ClassName').split('\n');
    const header=lines[0];
    const attrs=lines.slice(1).filter((_,i,a)=>i<Math.floor(a.length/2));
    const methods=lines.slice(1+attrs.length);
    return <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={fill} stroke={selStroke} strokeWidth={sw}/>
      <rect x={x} y={y} width={w} height={div1} fill={stroke} rx={2} stroke={selStroke} strokeWidth={sw}/>
      <rect x={x} y={y+4} width={w} height={div1-4} fill={stroke} stroke="none"/>
      <line x1={x} y1={y+div1} x2={x+w} y2={y+div1} stroke={selStroke} strokeWidth={sw*0.8}/>
      <line x1={x} y1={y+div1+div2} x2={x+w} y2={y+div1+div2} stroke={selStroke} strokeWidth={0.8}/>
      <text x={x+w/2} y={y+div1/2+1} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize+1} fontWeight="bold" fill="#fff" style={{userSelect:'none',pointerEvents:'none'}}>{header}</text>
      {attrs.map((l,i)=><text key={i} x={x+6} y={y+div1+13+i*14} fontSize={fontSize-1} fill={txtColor} style={{userSelect:'none',pointerEvents:'none'}}>{l}</text>)}
      {methods.map((l,i)=><text key={i} x={x+6} y={y+div1+div2+13+i*14} fontSize={fontSize-1} fill={txtColor} style={{userSelect:'none',pointerEvents:'none'}}>{l}</text>)}
    </g>;
  }
  if (type==='interface') {
    const div1=28;
    const lines=(label||'«interface»\nIName').split('\n');
    return <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={fill} stroke={selStroke} strokeWidth={sw}/>
      <line x1={x} y1={y+div1} x2={x+w} y2={y+div1} stroke={selStroke} strokeWidth={sw*0.8}/>
      {lines.map((l,i)=><text key={i} x={x+w/2} y={y+(i===0?div1/2:div1+12+(i-1)*14)} textAnchor="middle" dominantBaseline="middle"
        fontSize={i===0?fontSize-1:fontSize} fontStyle={i===0?'italic':fontStyle} fill={i===0?stroke:txtColor}
        style={{userSelect:'none',pointerEvents:'none'}}>{l}</text>)}
    </g>;
  }
  // text fallback
  return <g>{textEl}</g>;
}

// ─── EdgeLine ─────────────────────────────────────────────────────────────────
function EdgeLine({ edge, fromNode, toNode, selected, onClick }) {
  if (!fromNode || !toNode) return null;
  const { from, to } = getClosestPort(fromNode, toNode);
  const et = EDGE_TYPES.find(e=>e.id===edge.type) || EDGE_TYPES[0];
  const pts = [from, ...(edge.bends||[]), to];
  const d = pts.map((p,i)=>`${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');
  const edgeColor = edge.style?.stroke || '#475569';
  const mid = pts[Math.floor(pts.length/2)] || from;

  const startPath = arrowPath(et.startArrow);
  const endPath   = arrowPath(et.endArrow);
  const startId = `ms-${edge.id}`;
  const endId   = `me-${edge.id}`;

  const displayLabel = edge.label || et.labelFixed || '';

  return (
    <g onClick={onClick} style={{cursor:'pointer'}}>
      <defs>
        {startPath && <marker id={startId} markerWidth="13" markerHeight="10" refX="2" refY="5" orient="auto-start-reverse">
          <path d={startPath} fill={arrowFill(et.startArrow,edgeColor)} stroke={edgeColor} strokeWidth="1.2"/>
        </marker>}
        {endPath && <marker id={endId} markerWidth="13" markerHeight="10" refX="10" refY="5" orient="auto">
          <path d={endPath} fill={arrowFill(et.endArrow,edgeColor)} stroke={edgeColor} strokeWidth="1.2"/>
        </marker>}
      </defs>
      <path d={d} fill="none" stroke="transparent" strokeWidth={12}/>
      <path d={d} fill="none"
        stroke={selected?'#6366f1':edgeColor}
        strokeWidth={selected?2:1.5}
        strokeDasharray={et.dash}
        markerStart={startPath?`url(#${startId})`:undefined}
        markerEnd={endPath?`url(#${endId})`:undefined}
      />
      {displayLabel && <text x={mid.x} y={mid.y-6} textAnchor="middle" fontSize={10} fill="#374151" fontStyle="italic" style={{userSelect:'none',pointerEvents:'none'}}>{displayLabel}</text>}
    </g>
  );
}

// ─── ShapeItem ────────────────────────────────────────────────────────────────
function ShapeItem({ shapeKey, activeTool, onDragStart, onSelect }) {
  const def = SHAPES[shapeKey];
  const isActive = activeTool === shapeKey;
  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, shapeKey)}
      onClick={() => onSelect(shapeKey)}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-grab text-xs select-none transition-colors
        ${isActive ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-blue-50 active:bg-blue-100'}`}
      title={`${def.label} — drag to canvas or click to select`}
    >
      <span className="w-5 h-5 rounded border flex-shrink-0"
        style={{ background: def.fill==='none'?'#f1f5f9':def.fill, borderColor: def.stroke==='none'?'#94a3b8':def.stroke }}/>
      <span className="text-muted-foreground truncate">{def.label}</span>
    </div>
  );
}

// ─── PropertiesPanel ──────────────────────────────────────────────────────────
function PropertiesPanel({ node, edge, onNodeChange, onEdgeChange }) {
  if (!node && !edge) return <div className="p-3 text-xs text-muted-foreground italic">Select a shape or connection to edit properties.</div>;

  if (node) {
    const s = node.style || {};
    return (
      <div className="p-3 space-y-3 text-xs">
        <p className="font-semibold text-foreground">Shape</p>
        <div className="space-y-1"><label className="text-muted-foreground">Fill</label>
          <input type="color" value={s.fill||SHAPES[node.type]?.fill||'#dbeafe'} onChange={e=>onNodeChange({style:{...s,fill:e.target.value}})} className="w-full h-7 rounded border border-border cursor-pointer"/>
        </div>
        <div className="space-y-1"><label className="text-muted-foreground">Stroke</label>
          <input type="color" value={s.stroke||SHAPES[node.type]?.stroke||'#3b82f6'} onChange={e=>onNodeChange({style:{...s,stroke:e.target.value}})} className="w-full h-7 rounded border border-border cursor-pointer"/>
        </div>
        <div className="space-y-1"><label className="text-muted-foreground">Text Color</label>
          <input type="color" value={s.textColor||'#1e293b'} onChange={e=>onNodeChange({style:{...s,textColor:e.target.value}})} className="w-full h-7 rounded border border-border cursor-pointer"/>
        </div>
        <div className="space-y-1"><label className="text-muted-foreground">Font Size</label>
          <input type="number" min={8} max={32} value={s.fontSize||12} onChange={e=>onNodeChange({style:{...s,fontSize:+e.target.value}})} className="w-full border border-border rounded px-2 py-1"/>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>onNodeChange({style:{...s,bold:!s.bold}})} className={`px-2 py-1 rounded border ${s.bold?'bg-primary text-primary-foreground':'border-border'}`}><Bold className="w-3 h-3"/></button>
          <button onClick={()=>onNodeChange({style:{...s,italic:!s.italic}})} className={`px-2 py-1 rounded border ${s.italic?'bg-primary text-primary-foreground':'border-border'}`}><Italic className="w-3 h-3"/></button>
        </div>
        <div className="space-y-1"><label className="text-muted-foreground">Align</label>
          <div className="flex gap-1">
            {['left','center','right'].map(a=>(
              <button key={a} onClick={()=>onNodeChange({style:{...s,align:a}})}
                className={`flex-1 py-1 rounded border ${(s.align||'center')===a?'bg-primary text-primary-foreground':'border-border'}`}>
                {a==='left'?<AlignLeft className="w-3 h-3 mx-auto"/>:a==='center'?<AlignCenter className="w-3 h-3 mx-auto"/>:<AlignRight className="w-3 h-3 mx-auto"/>}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="space-y-1"><label className="text-muted-foreground">W</label>
            <input type="number" min={20} value={Math.round(node.w)} onChange={e=>onNodeChange({w:+e.target.value})} className="w-full border border-border rounded px-2 py-1"/>
          </div>
          <div className="space-y-1"><label className="text-muted-foreground">H</label>
            <input type="number" min={20} value={Math.round(node.h)} onChange={e=>onNodeChange({h:+e.target.value})} className="w-full border border-border rounded px-2 py-1"/>
          </div>
        </div>
      </div>
    );
  }

  if (edge) {
    const s = edge.style || {};
    return (
      <div className="p-3 space-y-3 text-xs">
        <p className="font-semibold text-foreground">Connection</p>
        <div className="space-y-1"><label className="text-muted-foreground">Type</label>
          <select value={edge.type||'association'} onChange={e=>onEdgeChange({type:e.target.value})}
            className="w-full border border-border rounded px-2 py-1 text-xs bg-background">
            {EDGE_TYPES.map(et=><option key={et.id} value={et.id}>{et.label}</option>)}
          </select>
        </div>
        <div className="space-y-1"><label className="text-muted-foreground">Label</label>
          <input value={edge.label||''} onChange={e=>onEdgeChange({label:e.target.value})}
            className="w-full border border-border rounded px-2 py-1" placeholder="Label..."/>
        </div>
        <div className="space-y-1"><label className="text-muted-foreground">Color</label>
          <input type="color" value={s.stroke||'#475569'} onChange={e=>onEdgeChange({style:{...s,stroke:e.target.value}})} className="w-full h-7 rounded border border-border cursor-pointer"/>
        </div>
      </div>
    );
  }
}

// ─── ToolBtn ──────────────────────────────────────────────────────────────────
function ToolBtn({ icon: Icon, label, active, onClick, disabled, className='' }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={onClick} disabled={disabled}
          className={`p-1.5 rounded-md transition-colors ${active?'bg-primary text-primary-foreground':'hover:bg-slate-200 text-slate-600 hover:text-slate-900'} ${disabled?'opacity-30 cursor-not-allowed':''} ${className}`}>
          <Icon className="w-3.5 h-3.5"/>
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom"><p className="text-xs">{label}</p></TooltipContent>
    </Tooltip>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SNAP = 10;
const snapV = v => Math.round(v/SNAP)*SNAP;
const PORTS = ['top','bottom','left','right'];
const EDGE_TOOL_IDS = EDGE_TYPES.map(e=>e.id);

// ─── Main UmlEditor ───────────────────────────────────────────────────────────
export default function UmlEditor({ value, onChange }) {
  const parseValue = () => {
    try { const p = JSON.parse(value||'{}'); return { nodes: p.nodes||[], edges: p.edges||[] }; }
    catch { return { nodes:[], edges:[] }; }
  };

  const [history, dispatch] = useReducer(historyReducer, null, () => ({
    past:[], present: parseValue(), future:[]
  }));
  const { nodes, edges } = history.present;

  const [tool, setTool]             = useState('select');
  const [edgeType, setEdgeType]     = useState('association');
  const [selected, setSelected]     = useState(null);
  const [selEdge, setSelEdge]       = useState(null);
  const [multiSel, setMultiSel]     = useState([]);
  const [edgeDraft, setEdgeDraft]   = useState(null);
  const [editingId, setEditingId]   = useState(null);
  const [editText, setEditText]     = useState('');
  const [zoom, setZoom]             = useState(1);
  const [pan, setPan]               = useState({ x:40, y:40 });
  const [showGrid, setShowGrid]     = useState(true);
  const [snapGrid, setSnapGrid]     = useState(true);
  const [clipboard, setClipboard]   = useState([]);
  const [selRect, setSelRect]       = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Use refs for drag state so window listeners always see latest values
  const dragRef       = useRef(null); // { ids, startPt, origPositions }
  const resizeRef     = useRef(null); // { nodeId, offW, offH }
  const panRef        = useRef(null); // { startX, startY }
  const selRectStartRef = useRef(null);
  const edgeDraftRef  = useRef(null); // mirrors edgeDraft state for sync reads in mouseup

  const svgRef = useRef(null);

  // Sync to parent
  useEffect(() => { onChange(JSON.stringify(history.present)); }, [history.present]);

  // Keep edgeDraftRef in sync with edgeDraft state
  useEffect(() => { edgeDraftRef.current = edgeDraft; }, [edgeDraft]);

  const commit = useCallback((n,e) => dispatch({type:'COMMIT',payload:{nodes:n,edges:e}}), []);
  const undo = useCallback(()=>dispatch({type:'UNDO'}),[]);
  const redo = useCallback(()=>dispatch({type:'REDO'}),[]);

  const toCanvas = useCallback((cx,cy) => {
    const r = svgRef.current.getBoundingClientRect();
    return { x:(cx-r.left-pan.x)/zoom, y:(cy-r.top-pan.y)/zoom };
  },[pan,zoom]);

  // ── Drop from panel ──────────────────────────────────────────────────────
  const handleDrop = (e) => {
    e.preventDefault();
    const shapeKey = e.dataTransfer.getData('shape');
    if (!shapeKey) return;
    const pt = toCanvas(e.clientX, e.clientY);
    const def = SHAPES[shapeKey];
    addNode(shapeKey, snapGrid ? snapV(pt.x-def.w/2) : pt.x-def.w/2, snapGrid ? snapV(pt.y-def.h/2) : pt.y-def.h/2);
  };

  const addNode = (type, x, y) => {
    const def = SHAPES[type];
    const node = {
      id:uid(), type,
      x: snapGrid?snapV(x):x,
      y: snapGrid?snapV(y):y,
      w:def.w, h:def.h,
      label: type==='class'?'ClassName\n+attribute: Type\n+method(): void'
           : type==='interface'?'«interface»\nIName\n+method(): void'
           : type==='umlStart'||type==='umlEnd'?''
           : def.label,
      style:{},
    };
    commit([...nodes,node], edges);
    setSelected(node.id); setSelEdge(null);
    return node;
  };

  // ── Global mouse handlers (window-level so mouseup always fires) ──────────
  useEffect(() => {
    const onMove = (e) => {
      // Pan
      if (panRef.current) {
        setPan({ x: e.clientX - panRef.current.startX, y: e.clientY - panRef.current.startY });
        return;
      }
      // Resize
      if (resizeRef.current) {
        const { nodeId, offW, offH, nodesSnapshot } = resizeRef.current;
        const pt = toCanvas(e.clientX, e.clientY);
        const orig = nodesSnapshot.find(n=>n.id===nodeId);
        if (!orig) return;
        const newW = Math.max(30, pt.x - orig.x + offW);
        const newH = Math.max(20, pt.y - orig.y + offH);
        const newNodes = nodesSnapshot.map(n => n.id===nodeId
          ? {...n, w:snapGrid?snapV(newW):newW, h:snapGrid?snapV(newH):newH }
          : n);
        dispatch({type:'COMMIT',payload:{nodes:newNodes,edges}});
        return;
      }
      // Drag
      if (dragRef.current) {
        const { ids, startPt, origPositions } = dragRef.current;
        const pt = toCanvas(e.clientX, e.clientY);
        const dx = pt.x - startPt.x, dy = pt.y - startPt.y;
        const newNodes = nodes.map(n => {
          if (!ids.includes(n.id)) return n;
          const ox = origPositions[n.id];
          return {...n, x:snapGrid?snapV(ox.x+dx):ox.x+dx, y:snapGrid?snapV(ox.y+dy):ox.y+dy};
        });
        dispatch({type:'COMMIT',payload:{nodes:newNodes,edges}});
        return;
      }
      // Edge draft
      if (edgeDraft) {
        const pt = toCanvas(e.clientX, e.clientY);
        setEdgeDraft(d=>({...d,toX:pt.x,toY:pt.y}));
      }
      // Rubber band
      if (selRectStartRef.current) {
        const pt = toCanvas(e.clientX, e.clientY);
        const sx=selRectStartRef.current.x, sy=selRectStartRef.current.y;
        const rx=Math.min(pt.x,sx), ry=Math.min(pt.y,sy);
        const rw=Math.abs(pt.x-sx), rh=Math.abs(pt.y-sy);
        setSelRect({x:rx,y:ry,w:rw,h:rh});
        setMultiSel(nodes.filter(n=>n.x<rx+rw&&n.x+n.w>rx&&n.y<ry+rh&&n.y+n.h>ry).map(n=>n.id));
      }
    };

    const onUp = (e) => {
      panRef.current = null;
      resizeRef.current = null;
      dragRef.current = null;
      selRectStartRef.current = null;
      setSelRect(null);
      edgeDraftRef.current = null;
      setEdgeDraft(null);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mouseleave', onUp);
    return ()=>{ window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp); window.removeEventListener('mouseleave',onUp); };
  }, [nodes, edges, edgeDraft, zoom, pan, snapGrid, toCanvas]);

  // ── SVG mouse down ────────────────────────────────────────────────────────
  const handleSvgMouseDown = (e) => {
    if (editingId) return;
    const pt = toCanvas(e.clientX, e.clientY);

    // Middle-click or Alt+drag = pan
    if (e.button===1 || (e.button===0&&e.altKey)) {
      e.preventDefault();
      panRef.current = { startX: e.clientX-pan.x, startY: e.clientY-pan.y };
      return;
    }
    if (e.button!==0) return;

    const isBackground = e.target===svgRef.current
      || (e.target.tagName==='rect'&&e.target.dataset.bg==='1');

    // Place shape tool — click on canvas
    if (SHAPES[tool]) {
      const def=SHAPES[tool];
      addNode(tool, pt.x-def.w/2, pt.y-def.h/2);
      setTool('select');
      return;
    }

    if (!isBackground) return;

    setSelected(null); setSelEdge(null);

    if (tool==='pan') {
      panRef.current = { startX: e.clientX-pan.x, startY: e.clientY-pan.y };
      return;
    }

    if (tool==='select') {
      selRectStartRef.current={x:pt.x,y:pt.y};
      setSelRect({x:pt.x,y:pt.y,w:0,h:0});
      setMultiSel([]);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(z=>Math.min(4,Math.max(0.2,z*(e.deltaY<0?1.1:0.9))));
  };

  // ── Node events ───────────────────────────────────────────────────────────
  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    if (editingId) return;

    const isEdgeTool = EDGE_TOOL_IDS.includes(tool);

    if (tool === 'pan') {
      panRef.current = { startX: e.clientX - pan.x, startY: e.clientY - pan.y };
      return;
    }

    if (isEdgeTool) {
      const pt=toCanvas(e.clientX,e.clientY);
      setEdgeDraft({fromId:node.id,fromX:pt.x,fromY:pt.y,toX:pt.x,toY:pt.y,type:tool});
      return;
    }

    if (tool==='select') {
      setSelEdge(null);
      const ids = multiSel.includes(node.id)?multiSel:[node.id];
      setSelected(node.id);
      if (!multiSel.includes(node.id)) setMultiSel([]);
      const pt=toCanvas(e.clientX,e.clientY);
      const origPositions={};
      ids.forEach(id=>{ const n=nodes.find(x=>x.id===id); if(n) origPositions[id]={x:n.x,y:n.y}; });
      dragRef.current={ids,startPt:pt,origPositions};
    }
  };

  const handleNodeMouseUp = (e, node) => {
    e.stopPropagation();
    // Use ref to read edgeDraft synchronously — state may already be cleared by window onUp
    const draft = edgeDraftRef.current;
    if (draft && draft.fromId !== node.id) {
      edgeDraftRef.current = null;
      setEdgeDraft(null);
      commit(nodes,[...edges,{id:uid(),from:draft.fromId,to:node.id,type:draft.type||edgeType,label:'',bends:[],style:{}}]);
      setTool('select');
    }
  };

  const handlePortMouseDown = (e, node, side) => {
    e.stopPropagation();
    const pp=getPortPoint(node,side);
    setEdgeDraft({fromId:node.id,fromX:pp.x,fromY:pp.y,toX:pp.x,toY:pp.y,type:edgeType});
  };

  const handleResizeMouseDown = (e, node) => {
    e.stopPropagation();
    const pt=toCanvas(e.clientX,e.clientY);
    resizeRef.current={ nodeId:node.id, offW:node.w-pt.x+node.x, offH:node.h-pt.y+node.y, nodesSnapshot:[...nodes] };
  };

  const handleNodeDblClick = (e, node) => {
    e.stopPropagation();
    setEditingId(node.id);
    setEditText(node.label||'');
  };

  const finishEdit = () => {
    if (!editingId) return;
    commit(nodes.map(n=>n.id===editingId?{...n,label:editText}:n),edges);
    setEditingId(null);
  };

  // ── Selection / clipboard ─────────────────────────────────────────────────
  const deleteSelected = useCallback(() => {
    const ids=multiSel.length?multiSel:selected?[selected]:[];
    if (!ids.length&&!selEdge) return;
    commit(nodes.filter(n=>!ids.includes(n.id)),edges.filter(ed=>!ids.includes(ed.from)&&!ids.includes(ed.to)&&ed.id!==selEdge));
    setSelected(null);setSelEdge(null);setMultiSel([]);
  },[nodes,edges,selected,selEdge,multiSel,commit]);

  const copySelected=useCallback(()=>{
    const ids=multiSel.length?multiSel:selected?[selected]:[];
    setClipboard(nodes.filter(n=>ids.includes(n.id)));
  },[nodes,selected,multiSel]);

  const pasteClipboard=useCallback(()=>{
    if(!clipboard.length)return;
    const newNodes=clipboard.map(n=>({...n,id:uid(),x:n.x+20,y:n.y+20}));
    commit([...nodes,...newNodes],edges);
    setMultiSel(newNodes.map(n=>n.id));
  },[clipboard,nodes,edges,commit]);

  const selectAll=()=>setMultiSel(nodes.map(n=>n.id));

  const updateNode=(patch)=>commit(nodes.map(n=>n.id===selected?{...n,...patch}:n),edges);
  const updateEdge=(patch)=>commit(nodes,edges.map(e=>e.id===selEdge?{...e,...patch}:e));

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(()=>{
    const h=(e)=>{
      if(editingId)return;
      const t=e.target;
      if(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT')return;
      if((e.ctrlKey||e.metaKey)&&e.key==='z'){e.preventDefault();undo();}
      if((e.ctrlKey||e.metaKey)&&(e.key==='y'||(e.shiftKey&&e.key==='z'))){e.preventDefault();redo();}
      if((e.ctrlKey||e.metaKey)&&e.key==='c'){e.preventDefault();copySelected();}
      if((e.ctrlKey||e.metaKey)&&e.key==='v'){e.preventDefault();pasteClipboard();}
      if((e.ctrlKey||e.metaKey)&&e.key==='a'){e.preventDefault();selectAll();}
      if(e.key==='Delete'||e.key==='Backspace')deleteSelected();
      if(e.key==='Escape'){
        setTool('select');setEdgeDraft(null);setEditingId(null);setIsFullscreen(false);
        dragRef.current=null; resizeRef.current=null; panRef.current=null; selRectStartRef.current=null; setSelRect(null);
      }
      if(e.key==='v')setTool('select');
      if(e.key==='h')setTool('pan');
    };
    window.addEventListener('keydown',h);
    return()=>window.removeEventListener('keydown',h);
  },[editingId,deleteSelected,copySelected,pasteClipboard,undo,redo]);

  const exportSvg=()=>{
    const s=new XMLSerializer(),blob=new Blob([s.serializeToString(svgRef.current)],{type:'image/svg+xml'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='diagram.svg';a.click();URL.revokeObjectURL(url);
  };

  const selectedNode = nodes.find(n=>n.id===selected)||null;
  const selectedEdgeObj = edges.find(e=>e.id===selEdge)||null;
  const isEdgeTool = EDGE_TOOL_IDS.includes(tool);

  return (
    <TooltipProvider>
      <div className={`border border-border bg-white flex flex-col ${isFullscreen?'fixed inset-0 z-[9999] rounded-none':'rounded-xl overflow-hidden'}`}
        style={{height:isFullscreen?'100vh':580}}>

        {/* Toolbar */}
        <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-slate-50 flex-wrap shrink-0">
          <ToolBtn icon={MousePointer} label="Select (V)" active={tool==='select'} onClick={()=>setTool('select')}/>
          <ToolBtn icon={Hand} label="Pan canvas (H)" active={tool==='pan'} onClick={()=>setTool('pan')}/>
          <div className="w-px h-5 bg-border mx-0.5"/>

          <div className="flex items-center gap-1">
            <select value={edgeType} onChange={e=>{setEdgeType(e.target.value);setTool(e.target.value);}}
              className="text-xs border border-border rounded px-1.5 py-1 bg-background cursor-pointer max-w-[140px]">
              {EDGE_TYPES.map(et=><option key={et.id} value={et.id}>{et.label}</option>)}
            </select>
            <ToolBtn icon={Link2} label="Draw Connection" active={isEdgeTool} onClick={()=>setTool(edgeType)}/>
          </div>
          <div className="w-px h-5 bg-border mx-0.5"/>

          <ToolBtn icon={Undo2} label="Undo (Ctrl+Z)" onClick={undo} disabled={!history.past.length}/>
          <ToolBtn icon={Redo2} label="Redo (Ctrl+Y)" onClick={redo} disabled={!history.future.length}/>
          <div className="w-px h-5 bg-border mx-0.5"/>

          <ToolBtn icon={Copy}     label="Copy (Ctrl+C)"  onClick={copySelected}/>
          <ToolBtn icon={Clipboard}label="Paste (Ctrl+V)" onClick={pasteClipboard}/>
          <ToolBtn icon={Scissors} label="Cut"            onClick={()=>{copySelected();deleteSelected();}}/>
          <ToolBtn icon={Trash2}   label="Delete (Del)"   onClick={deleteSelected} className="text-destructive"/>
          <div className="w-px h-5 bg-border mx-0.5"/>

          <ToolBtn icon={ZoomOut}   label="Zoom Out"     onClick={()=>setZoom(z=>Math.max(0.2,z-0.15))}/>
          <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom*100)}%</span>
          <ToolBtn icon={ZoomIn}    label="Zoom In"      onClick={()=>setZoom(z=>Math.min(4,z+0.15))}/>
          <ToolBtn icon={RotateCcw} label="Reset View"   onClick={()=>{setZoom(1);setPan({x:40,y:40});}}/>
          <div className="w-px h-5 bg-border mx-0.5"/>

          <ToolBtn icon={Grid}     label="Toggle grid"  active={showGrid} onClick={()=>setShowGrid(v=>!v)}/>
          <ToolBtn icon={Download} label="Export SVG"   onClick={exportSvg}/>
          <ToolBtn icon={isFullscreen?Minimize2:Maximize2} label={isFullscreen?'Exit Fullscreen':'Fullscreen'} onClick={()=>setIsFullscreen(v=>!v)}/>
        </div>

        {/* Main area */}
        <div className="flex flex-1 min-h-0">

          {/* Shape panel */}
          <div className="w-36 shrink-0 border-r border-border bg-slate-50 overflow-y-auto py-1">
            <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Shapes</p>
            <p className="px-2 pb-1 text-[9px] text-muted-foreground">Click to select · Drag to canvas</p>
            {Object.keys(SHAPES).map(k=>(
              <ShapeItem key={k} shapeKey={k} activeTool={tool}
                onDragStart={(e,key)=>e.dataTransfer.setData('shape',key)}
                onSelect={key=>setTool(key)}
              />
            ))}
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-hidden bg-slate-100" onDrop={handleDrop} onDragOver={e=>e.preventDefault()}>
            <svg ref={svgRef} width="100%" height="100%"
              style={{cursor:panRef.current?'grabbing':tool==='pan'?'grab':isEdgeTool?'crosshair':SHAPES[tool]?'copy':'default',display:'block'}}
              onMouseDown={handleSvgMouseDown}
              onWheel={handleWheel}
            >
              <defs>
                {showGrid&&<pattern id="sg" width={SNAP*zoom} height={SNAP*zoom} patternUnits="userSpaceOnUse" x={pan.x%(SNAP*zoom)} y={pan.y%(SNAP*zoom)}>
                  <path d={`M ${SNAP*zoom} 0 L 0 0 0 ${SNAP*zoom}`} fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                </pattern>}
                {showGrid&&<pattern id="gg" width={SNAP*zoom*5} height={SNAP*zoom*5} patternUnits="userSpaceOnUse" x={pan.x%(SNAP*zoom*5)} y={pan.y%(SNAP*zoom*5)}>
                  <rect width={SNAP*zoom*5} height={SNAP*zoom*5} fill="url(#sg)"/>
                  <path d={`M ${SNAP*zoom*5} 0 L 0 0 0 ${SNAP*zoom*5}`} fill="none" stroke="#cbd5e1" strokeWidth="1"/>
                </pattern>}
              </defs>

              <rect width="100%" height="100%" fill={showGrid?'url(#gg)':'#f8fafc'} data-bg="1"/>

              <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
                {/* Edges */}
                {edges.map(edge=>(
                  <EdgeLine key={edge.id} edge={edge}
                    fromNode={nodes.find(n=>n.id===edge.from)}
                    toNode={nodes.find(n=>n.id===edge.to)}
                    selected={selEdge===edge.id}
                    onClick={e=>{e.stopPropagation();setSelEdge(edge.id);setSelected(null);setMultiSel([]);}}
                  />
                ))}

                {/* Edge draft */}
                {edgeDraft&&<line x1={edgeDraft.fromX} y1={edgeDraft.fromY} x2={edgeDraft.toX} y2={edgeDraft.toY}
                  stroke="#6366f1" strokeWidth={1.5} strokeDasharray="5,3" opacity={0.8} pointerEvents="none"/>}

                {/* Rubber band */}
                {selRect&&<rect x={selRect.x} y={selRect.y} width={selRect.w} height={selRect.h}
                  fill="rgba(99,102,241,0.08)" stroke="#6366f1" strokeWidth={1} strokeDasharray="4,2" pointerEvents="none"/>}

                {/* Nodes */}
                {nodes.map(node=>{
                  const isSel=selected===node.id;
                  const isMulti=multiSel.includes(node.id);
                  return (
                    <g key={node.id}
                      onMouseDown={e=>handleNodeMouseDown(e,node)}
                      onMouseUp={e=>handleNodeMouseUp(e,node)}
                      onDoubleClick={e=>handleNodeDblClick(e,node)}
                      style={{cursor:tool==='pan'?'grab':tool==='select'?'move':isEdgeTool?'crosshair':'copy'}}
                    >
                      <NodeShape node={node} selected={isSel} multiSelected={isMulti}/>

                      {/* Ports — shown when edge tool OR node selected */}
                      {(isEdgeTool||isSel)&&PORTS.map(side=>{
                        const pp=getPortPoint(node,side);
                        return <circle key={side} cx={pp.x} cy={pp.y} r={5}
                          fill="#6366f1" stroke="#fff" strokeWidth={1.5}
                          style={{cursor:'crosshair',opacity:0.85}}
                          onMouseDown={e=>handlePortMouseDown(e,node,side)}
                        />;
                      })}

                      {/* Resize handle */}
                      {isSel&&<rect x={node.x+node.w-5} y={node.y+node.h-5} width={10} height={10}
                        fill="#6366f1" rx={2} style={{cursor:'se-resize'}}
                        onMouseDown={e=>handleResizeMouseDown(e,node)}
                      />}
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Label editor */}
            {editingId&&(()=>{
              const n=nodes.find(x=>x.id===editingId);
              if(!n)return null;
              const sx=(n.x+n.w/2)*zoom+pan.x, sy=(n.y+n.h/2)*zoom+pan.y;
              return <div style={{position:'absolute',left:Math.max(4,sx-96),top:Math.max(4,sy-48),zIndex:50}}>
                <textarea autoFocus value={editText} onChange={e=>setEditText(e.target.value)}
                  onBlur={finishEdit}
                  onKeyDown={e=>{if(e.key==='Escape')setEditingId(null);if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();finishEdit();}}}
                  rows={4} className="w-48 text-xs border-2 border-primary rounded-lg p-2 bg-white shadow-2xl focus:outline-none resize-none"
                  style={{fontFamily:'monospace'}}/>
                <p className="text-[10px] text-muted-foreground mt-0.5 px-1">Enter=save · Shift+Enter=newline</p>
              </div>;
            })()}

            {/* Status bar */}
            <div className="absolute bottom-0 left-0 right-0 px-3 py-1 bg-white/80 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{nodes.length} shapes · {edges.length} connections{multiSel.length?` · ${multiSel.length} selected`:''}</span>
              <span>{tool==='select'?'Move · Dbl-click=edit · Alt+drag=pan':tool==='pan'?'Drag to pan canvas (H)':isEdgeTool?'Click port → target':SHAPES[tool]?'Click to place':'—'} · Scroll=zoom</span>
            </div>
          </div>

          {/* Properties */}
          <div className="w-44 shrink-0 border-l border-border bg-slate-50 overflow-y-auto">
            <p className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">Properties</p>
            <PropertiesPanel node={selectedNode} edge={selectedEdgeObj} onNodeChange={updateNode} onEdgeChange={updateEdge}/>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}