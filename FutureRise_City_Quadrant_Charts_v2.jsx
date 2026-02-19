import { useState } from "react";

const CITIES = [
  { name: "Atlanta",      abbr: "ATL", color: "#F43F5E" },
  { name: "Minneapolis",  abbr: "MIN", color: "#8B5CF6" },
  { name: "Cleveland",    abbr: "CLE", color: "#00C49F" },
  { name: "Detroit",      abbr: "DET", color: "#0088FE" },
  { name: "Cincinnati",   abbr: "CIN", color: "#06B6D4" },
  { name: "Memphis",      abbr: "MEM", color: "#FF8042" },
  { name: "Baltimore",    abbr: "BAL", color: "#EC4899" },
  { name: "Los Angeles",  abbr: "LA",  color: "#64748B" },
  { name: "Milwaukee",    abbr: "MKE", color: "#FFBB28" },
  { name: "Chicago",      abbr: "CHI", color: "#10B981" },
];

// Chart 1: Funding Opportunities (Y) vs Partnership Opportunities (X)
// Both axes: Low (left/bottom) → High (right/top)
const CHART1 = {
  title: "Funding vs. Partnership Opportunities",
  subtitle: "Where can we raise money AND build relationships?",
  xLabel: "Partnership Opportunities",
  yLabel: "Funding Opportunities",
  xLow: "Low", xHigh: "High",
  yLow: "Low", yHigh: "High",
  q3label: "Great Partners,\nLess Funding",
  q4label: "★ Sweet Spot\nStrong Both",
  q1label: "Low Both\nLower Priority",
  q2label: "Good Funding\nFewer Partners",
  points: [
    { city: "Atlanta",     x: 82, y: 68 },
    { city: "Minneapolis", x: 72, y: 82 },
    { city: "Cleveland",   x: 75, y: 88 },
    { city: "Detroit",     x: 70, y: 82 },
    { city: "Cincinnati",  x: 58, y: 65 },
    { city: "Memphis",     x: 62, y: 74 },
    { city: "Baltimore",   x: 68, y: 70 },
    { city: "Los Angeles", x: 85, y: 52 },
    { city: "Milwaukee",   x: 58, y: 68 },
    { city: "Chicago",     x: 78, y: 75 },
  ],
};

// Chart 2: Need for Intensive College Prep (Y) vs HS→College Acceptance Rate (X)
// IDEAL: High Need (top), Low Acceptance Rate (left) = top-left quadrant = highest priority
// Axes: X = low acceptance rate LEFT → high acceptance rate RIGHT
//       Y = low need BOTTOM → high need TOP
const CHART2 = {
  title: "Program Need vs. HS-to-College Acceptance Rate",
  subtitle: "High need + low acceptance = highest priority cities",
  xLabel: "High School → 4-Year College Acceptance Rate",
  yLabel: "Need for Intensive College Prep Program",
  xLow: "Low Rate", xHigh: "High Rate",
  yLow: "Lower Need", yHigh: "High Need",
  q1label: "★ Priority Tier 1\nHigh Need,\nLow Acceptance",
  q2label: "Priority Tier 2\nHigh Need,\nHigher Acceptance",
  q3label: "Lower Priority\nLow Need,\nLow Acceptance",
  q4label: "Lower Priority\nLow Need,\nHigh Acceptance",
  invertX: true, // lower acceptance = higher priority (left side is better)
  points: [
    { city: "Atlanta",     x: 52, y: 72 }, // moderate acceptance, moderate-high need
    { city: "Minneapolis", x: 58, y: 74 },
    { city: "Cleveland",   x: 25, y: 94 }, // very low acceptance, very high need
    { city: "Detroit",     x: 20, y: 96 },
    { city: "Cincinnati",  x: 38, y: 80 },
    { city: "Memphis",     x: 18, y: 97 },
    { city: "Baltimore",   x: 32, y: 85 },
    { city: "Los Angeles", x: 48, y: 70 },
    { city: "Milwaukee",   x: 28, y: 91 },
    { city: "Chicago",     x: 42, y: 82 },
  ],
};

// Chart 3: Difficulty Recruiting (Y) vs Attrition Risk (X)
// IDEAL: Easy to recruit (low difficulty = bottom) + Low Attrition (left)
// Y: Low difficulty (bottom) → High difficulty (top)
// X: Low attrition (left) → High attrition (right)
const CHART3 = {
  title: "Student Recruitment Difficulty vs. Attrition Risk",
  subtitle: "Low difficulty + low attrition = best operational cities",
  xLabel: "Fellow Attrition Risk",
  yLabel: "Difficulty Recruiting Student Participants",
  xLow: "Low Attrition", xHigh: "High Attrition",
  yLow: "Easy to Recruit", yHigh: "Hard to Recruit",
  q1label: "★ Best Ops\nEasy Recruit\nLow Attrition",
  q2label: "Easy Recruit\nHigher Attrition\nWatch Carefully",
  q3label: "Harder Recruit\nLow Attrition\nOnce In, Stay",
  q4label: "Hardest\nHigh Risk Both",
  points: [
    { city: "Atlanta",     x: 32, y: 35 },
    { city: "Minneapolis", x: 28, y: 40 },
    { city: "Cleveland",   x: 25, y: 28 },
    { city: "Detroit",     x: 30, y: 38 },
    { city: "Cincinnati",  x: 22, y: 32 },
    { city: "Memphis",     x: 42, y: 45 },
    { city: "Baltimore",   x: 35, y: 48 },
    { city: "Los Angeles", x: 48, y: 55 },
    { city: "Milwaukee",   x: 28, y: 42 },
    { city: "Chicago",     x: 38, y: 50 },
  ],
};

const ALL_CHARTS = [CHART1, CHART2, CHART3];

const CHART_COLORS = [
  { bg: "rgba(0,196,159,0.12)", border: "#00C49F", accent: "#00C49F" },
  { bg: "rgba(248,113,113,0.12)", border: "#F87171", accent: "#F43F5E" },
  { bg: "rgba(139,92,246,0.12)", border: "#A78BFA", accent: "#8B5CF6" },
];

function QuadrantChart({ data, index }) {
  const [hovered, setHovered] = useState(null);
  const cc = CHART_COLORS[index];

  const W = 540, H = 480;
  const PAD = { top: 52, right: 28, bottom: 72, left: 72 };
  const IW = W - PAD.left - PAD.right;
  const IH = H - PAD.top - PAD.bottom;

  const toX = v => PAD.left + (v / 100) * IW;
  const toY = v => PAD.top + IH - (v / 100) * IH;
  const midX = toX(50), midY = toY(50);

  const hovCity = CITIES.find(c => c.name === hovered);
  const hovPt   = data.points.find(p => p.city === hovered);

  // quadrant fills (bottom-left origin)
  // Q1=bottom-left, Q2=bottom-right, Q3=top-left, Q4=top-right
  const quads = [
    { x: PAD.left, y: midY,      w: midX - PAD.left,           h: IH - (midY - PAD.top), label: data.q1label, color: "rgba(16,185,129,0.10)" },
    { x: midX,     y: midY,      w: PAD.left + IW - midX,      h: IH - (midY - PAD.top), label: data.q2label, color: "rgba(251,191,36,0.07)" },
    { x: PAD.left, y: PAD.top,   w: midX - PAD.left,           h: midY - PAD.top,         label: data.q3label, color: "rgba(59,130,246,0.07)" },
    { x: midX,     y: PAD.top,   w: PAD.left + IW - midX,      h: midY - PAD.top,         label: data.q4label, color: "rgba(239,68,68,0.07)" },
  ];

  return (
    <div style={{
      background: "linear-gradient(160deg,#0f172a 0%,#1a2744 100%)",
      borderRadius: 18,
      padding: "22px 18px 14px",
      boxShadow: `0 0 0 1px rgba(255,255,255,0.07), 0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)`,
      position: "relative",
    }}>
      {/* badge */}
      <div style={{
        position:"absolute", top:14, left:16,
        background: `linear-gradient(135deg,${cc.accent}33,${cc.accent}18)`,
        border:`1px solid ${cc.accent}44`,
        borderRadius:8, padding:"3px 10px",
        fontSize:10, fontWeight:700, color:cc.accent,
        fontFamily:"'DM Mono',monospace", letterSpacing:1.5,
      }}>GRAPH {index+1}</div>

      <div style={{ textAlign:"center", paddingTop:4, marginBottom:14 }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#f1f5f9", fontFamily:"'Space Grotesk',sans-serif", marginBottom:3 }}>{data.title}</div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.38)", fontFamily:"'DM Mono',monospace" }}>{data.subtitle}</div>
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
        <defs>
          <pattern id={`g${index}`} width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="0.8"/>
          </pattern>
        </defs>

        {/* grid */}
        <rect x={PAD.left} y={PAD.top} width={IW} height={IH} fill={`url(#g${index})`}/>

        {/* quadrant fills + labels */}
        {quads.map((q,i) => {
          const labelLines = q.label.split("\n");
          const lx = q.x + q.w/2;
          const ly = q.y + q.h/2 - (labelLines.length-1)*7;
          return (
            <g key={i}>
              <rect x={q.x} y={q.y} width={q.w} height={q.h} fill={q.color}/>
              {labelLines.map((ln,li) => (
                <text key={li} x={lx} y={ly + li*14} textAnchor="middle" fontSize={9}
                  fill="rgba(255,255,255,0.28)" fontFamily="'DM Mono',monospace" fontWeight="600"
                  dominantBaseline="middle">
                  {ln}
                </text>
              ))}
            </g>
          );
        })}

        {/* axes */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top+IH} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}/>
        <line x1={PAD.left} y1={PAD.top+IH} x2={PAD.left+IW} y2={PAD.top+IH} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}/>

        {/* midpoint lines */}
        <line x1={midX} y1={PAD.top} x2={midX} y2={PAD.top+IH} stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="4,4"/>
        <line x1={PAD.left} y1={midY} x2={PAD.left+IW} y2={midY} stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="4,4"/>

        {/* ticks + labels */}
        {[0,25,50,75,100].map(v => (
          <g key={v}>
            <line x1={toX(v)} y1={PAD.top+IH} x2={toX(v)} y2={PAD.top+IH+5} stroke="rgba(255,255,255,0.2)" strokeWidth={1}/>
            <line x1={PAD.left-5} y1={toY(v)} x2={PAD.left} y2={toY(v)} stroke="rgba(255,255,255,0.2)" strokeWidth={1}/>
            <text x={toX(v)} y={PAD.top+IH+15} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.22)" fontFamily="'DM Mono',monospace">{v}</text>
            <text x={PAD.left-8} y={toY(v)+3} textAnchor="end" fontSize={8} fill="rgba(255,255,255,0.22)" fontFamily="'DM Mono',monospace">{v}</text>
          </g>
        ))}

        {/* low/high axis labels */}
        <text x={PAD.left+4} y={PAD.top+IH+28} fontSize={9} fill={`${cc.accent}88`} fontFamily="'DM Mono',monospace">← {data.xLow}</text>
        <text x={PAD.left+IW-4} y={PAD.top+IH+28} textAnchor="end" fontSize={9} fill={`${cc.accent}88`} fontFamily="'DM Mono',monospace">{data.xHigh} →</text>
        <text x={PAD.left-10} y={PAD.top+4} textAnchor="middle" fontSize={9} fill={`${cc.accent}88`} fontFamily="'DM Mono',monospace" transform={`rotate(-90,${PAD.left-44},${PAD.top+IH/2})`}>{data.yHigh} ↑</text>
        <text x={PAD.left-10} y={PAD.top+IH} textAnchor="middle" fontSize={9} fill={`${cc.accent}88`} fontFamily="'DM Mono',monospace" transform={`rotate(-90,${PAD.left-44},${PAD.top+IH/2+40})`}>↓ {data.yLow}</text>

        {/* axis title */}
        <text x={PAD.left+IW/2} y={H-6} textAnchor="middle" fontSize={11} fill="rgba(255,255,255,0.45)" fontFamily="'Space Grotesk',sans-serif" fontWeight={600}>{data.xLabel}</text>
        <text x={16} y={PAD.top+IH/2} textAnchor="middle" fontSize={11} fill="rgba(255,255,255,0.45)" fontFamily="'Space Grotesk',sans-serif" fontWeight={600}
          transform={`rotate(-90,16,${PAD.top+IH/2})`}>{data.yLabel}</text>

        {/* city dots */}
        {data.points.map(p => {
          const city = CITIES.find(c=>c.name===p.city);
          const cx = toX(p.x), cy = toY(p.y);
          const isHov = hovered===p.city;
          return (
            <g key={p.city} onMouseEnter={()=>setHovered(p.city)} onMouseLeave={()=>setHovered(null)} style={{cursor:"pointer"}}>
              {isHov && <circle cx={cx} cy={cy} r={22} fill={city.color} opacity={0.15}/>}
              <circle cx={cx} cy={cy} r={isHov?14:10}
                fill={city.color} stroke="#fff" strokeWidth={isHov?2.5:1.5}
                style={{transition:"all 0.15s ease", filter: isHov ? `drop-shadow(0 0 8px ${city.color})` : "none"}}/>
              <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle"
                fontSize={isHov?8:7} fontWeight="800" fill="#fff"
                fontFamily="'DM Mono',monospace" style={{pointerEvents:"none",userSelect:"none"}}>
                {city.abbr}
              </text>
            </g>
          );
        })}

        {/* tooltip */}
        {hovCity && hovPt && (() => {
          const cx = toX(hovPt.x), cy = toY(hovPt.y);
          const bw=150, bh=54;
          const bx = cx+18+bw>W ? cx-bw-18 : cx+18;
          const by = Math.max(PAD.top, Math.min(cy-bh/2, PAD.top+IH-bh));
          return (
            <g>
              <rect x={bx} y={by} width={bw} height={bh} rx={8}
                fill="#0f172a" stroke={hovCity.color} strokeWidth={1.5} opacity={0.97}/>
              <text x={bx+10} y={by+17} fontSize={12} fontWeight="700" fill={hovCity.color}
                fontFamily="'Space Grotesk',sans-serif">{hovCity.name}</text>
              <text x={bx+10} y={by+32} fontSize={9} fill="rgba(255,255,255,0.6)"
                fontFamily="'DM Mono',monospace">X: {hovPt.x} / Y: {hovPt.y}</text>
              <text x={bx+10} y={by+45} fontSize={9} fill="rgba(255,255,255,0.35)"
                fontFamily="'DM Mono',monospace">{data.xLabel.slice(0,20)}…</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

function Legend() {
  return (
    <div style={{
      background:"linear-gradient(145deg,#0f172a,#1e293b)",
      borderRadius:14, padding:"14px 18px",
      border:"1px solid rgba(255,255,255,0.07)",
    }}>
      <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.35)",fontFamily:"'DM Mono',monospace",letterSpacing:2,marginBottom:10}}>
        CITIES — hover any dot for details
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:"6px 14px"}}>
        {CITIES.map(c=>(
          <div key={c.name} style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{
              width:24,height:24,borderRadius:"50%",background:c.color,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:7,fontWeight:800,color:"#fff",fontFamily:"'DM Mono',monospace",
              boxShadow:`0 0 6px ${c.color}55`, flexShrink:0,
            }}>{c.abbr}</div>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.65)",fontFamily:"'Space Grotesk',sans-serif",fontWeight:500}}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SCORES = [
  { city:"Atlanta",    funding:68,partner:82,need:72,accept:52,recDiff:35,attrition:32 },
  { city:"Minneapolis",funding:82,partner:72,need:74,accept:58,recDiff:40,attrition:28 },
  { city:"Cleveland",  funding:88,partner:75,need:94,accept:25,recDiff:28,attrition:25 },
  { city:"Detroit",    funding:82,partner:70,need:96,accept:20,recDiff:38,attrition:30 },
  { city:"Cincinnati", funding:65,partner:58,need:80,accept:38,recDiff:32,attrition:22 },
  { city:"Memphis",    funding:74,partner:62,need:97,accept:18,recDiff:45,attrition:42 },
  { city:"Baltimore",  funding:70,partner:68,need:85,accept:32,recDiff:48,attrition:35 },
  { city:"Los Angeles",funding:52,partner:85,need:70,accept:48,recDiff:55,attrition:48 },
  { city:"Milwaukee",  funding:68,partner:58,need:91,accept:28,recDiff:42,attrition:28 },
  { city:"Chicago",    funding:75,partner:78,need:82,accept:42,recDiff:50,attrition:38 },
].map(s=>({
  ...s,
  composite: Math.round((s.funding + s.partner + s.need + (100-s.accept) + (100-s.recDiff) + (100-s.attrition))/6)
})).sort((a,b)=>b.composite-a.composite);

function Bar({val, color, max=100}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:5}}>
      <div style={{width:52,height:7,background:"rgba(255,255,255,0.08)",borderRadius:4,overflow:"hidden"}}>
        <div style={{width:`${(val/max)*100}%`,height:"100%",background:color,borderRadius:4}}/>
      </div>
      <span style={{fontSize:11,color:"rgba(255,255,255,0.45)",fontFamily:"'DM Mono',monospace",minWidth:20}}>{val}</span>
    </div>
  );
}

function ScoreTable() {
  return (
    <div style={{
      background:"linear-gradient(145deg,#0f172a,#1e293b)",
      borderRadius:14,padding:"18px 18px",
      border:"1px solid rgba(255,255,255,0.07)",
      overflowX:"auto",
    }}>
      <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.35)",fontFamily:"'DM Mono',monospace",letterSpacing:2,marginBottom:14}}>
        COMPOSITE CITY OPPORTUNITY SCORE — RANKED
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",minWidth:680}}>
        <thead>
          <tr>
            {["Rank","City","Funding","Partners","Need","Acceptance","Recruit Diff","Attrition","Score"].map(h=>(
              <th key={h} style={{padding:"6px 8px",textAlign:"left",fontSize:10,fontWeight:700,
                color:"rgba(255,255,255,0.3)",fontFamily:"'DM Mono',monospace",letterSpacing:1,
                borderBottom:"1px solid rgba(255,255,255,0.07)",whiteSpace:"nowrap"}}>{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SCORES.map((s,i)=>{
            const city = CITIES.find(c=>c.name===s.city);
            const medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":"";
            return (
              <tr key={s.city} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <td style={{padding:"7px 8px",fontSize:12,color:"rgba(255,255,255,0.3)",fontFamily:"'DM Mono',monospace"}}>{medal || `#${i+1}`}</td>
                <td style={{padding:"7px 8px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:city?.color,flexShrink:0}}/>
                    <span style={{fontSize:12,fontWeight:600,color:"#f1f5f9",fontFamily:"'Space Grotesk',sans-serif",whiteSpace:"nowrap"}}>{s.city}</span>
                  </div>
                </td>
                <td style={{padding:"7px 8px"}}><Bar val={s.funding} color="#0088FE"/></td>
                <td style={{padding:"7px 8px"}}><Bar val={s.partner} color="#00C49F"/></td>
                <td style={{padding:"7px 8px"}}><Bar val={s.need} color="#FF8042"/></td>
                <td style={{padding:"7px 8px"}}><Bar val={100-s.accept} color="#FFBB28"/></td>
                <td style={{padding:"7px 8px"}}><Bar val={100-s.recDiff} color="#A855F7"/></td>
                <td style={{padding:"7px 8px"}}><Bar val={100-s.attrition} color="#10B981"/></td>
                <td style={{padding:"7px 8px"}}>
                  <div style={{
                    display:"inline-flex",alignItems:"center",justifyContent:"center",
                    background:`linear-gradient(135deg,${city?.color}30,${city?.color}10)`,
                    border:`1.5px solid ${city?.color}55`,
                    borderRadius:8,padding:"3px 10px",
                    fontSize:14,fontWeight:800,color:city?.color,
                    fontFamily:"'DM Mono',monospace",
                  }}>{s.composite}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{fontSize:10,color:"rgba(255,255,255,0.2)",fontFamily:"'DM Mono',monospace",marginTop:12,lineHeight:1.7}}>
        * Score = avg of: Funding + Partnership + Need + (100−AcceptRate) + (100−RecruitDifficulty) + (100−Attrition) ÷ 6. Higher score = stronger FutureRise launch opportunity.
        <br/>Acceptance, Recruit Difficulty, and Attrition bars shown INVERTED — longer bar = better (lower is better for those metrics).
      </p>
    </div>
  );
}

export default function App() {
  return (
    <div style={{minHeight:"100vh",background:"#070e1c",fontFamily:"'Space Grotesk',sans-serif",padding:"28px 20px 48px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;700&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:#0f172a;}
        ::-webkit-scrollbar-thumb{background:#334155;border-radius:3px;}
      `}</style>

      {/* header */}
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{
          display:"inline-block",
          background:"linear-gradient(135deg,#1d4ed8,#7c3aed)",
          borderRadius:10,padding:"5px 18px",
          fontSize:10,fontWeight:700,color:"#fff",
          fontFamily:"'DM Mono',monospace",letterSpacing:2,marginBottom:12,
        }}>FUTURERISE FELLOWSHIP · I'RAISE · LAUNCH JUNE 2026</div>
        <h1 style={{
          fontSize:28,fontWeight:800,margin:"0 0 8px",
          background:"linear-gradient(135deg,#e2e8f0 30%,#94a3b8 100%)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1.2,
        }}>City Expansion Quadrant Analysis</h1>
        <p style={{color:"rgba(255,255,255,0.35)",fontSize:13,margin:0}}>
          10-City market test · Feb–May 2026 · Hover any dot for details
        </p>
      </div>

      {/* legend */}
      <div style={{maxWidth:920,margin:"0 auto 22px"}}><Legend/></div>

      {/* charts */}
      <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(380px,1fr))",gap:22,marginBottom:24}}>
        {ALL_CHARTS.map((c,i)=><QuadrantChart key={i} data={c} index={i}/>)}
      </div>

      {/* table */}
      <div style={{maxWidth:1200,margin:"0 auto"}}><ScoreTable/></div>
    </div>
  );
}
