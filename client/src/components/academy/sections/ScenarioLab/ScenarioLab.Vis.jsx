/**
 * ScenarioLab.Vis.jsx — SVG 재설계 v4 (좌표 검수 후 수정)
 *
 * 수정 목록:
 * [1] IntroVis: transformOrigin y 150px → 130px (cy=130에 맞춤)
 * [2] ConceptSaltVis: mixCy 116 → 120 (polygon 실제 중앙)
 * [4] LinkedInBreachVis: 이모지 size 12 → 14
 * [5] CompareHashingVis: SVG text 안 이모지 제거
 * [6] RainbowTableVis: ATTACKER box label/sub 제거, Emoji만 / WALL rotate 텍스트 제거
 * [7] VaultSealingVis: ATTACKER box 구조 분리 / DB 텍스트 y 조정
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/* CSS @keyframes */
const CSS = `
  @keyframes spin-cw  { from { transform: rotate(0deg);  } to { transform: rotate(360deg);  } }
  @keyframes spin-ccw { from { transform: rotate(0deg);  } to { transform: rotate(-360deg); } }
  @keyframes dash-flow { to { stroke-dashoffset: -20; } }
`;

const SvgCanvas = ({ children, viewBox = "0 0 400 260" }) => (
  <svg viewBox={viewBox} xmlns="http://www.w3.org/2000/svg"
    style={{ width:"100%", height:"100%", display:"block" }}>
    <style>{CSS}</style>
    {children}
  </svg>
);

/* foreignObject 이모지 헬퍼 — 중앙(x,y)을 기준으로 배치 */
const Emoji = ({ x, y, size = 28, children }) => (
  <foreignObject x={x - size/2} y={y - size/2} width={size} height={size}
    style={{ overflow:"visible" }}>
    <div xmlns="http://www.w3.org/1999/xhtml"
      style={{ fontSize: size * 0.72, lineHeight:1, textAlign:"center",
               userSelect:"none", pointerEvents:"none" }}>
      {children}
    </div>
  </foreignObject>
);

/* 흐르는 점선 화살표 */
const FlowArrow = ({ x1, y1, x2, y2, color = "#6366f1", dur = "1.2s", opacity = 0.5 }) => {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx*dx + dy*dy);
  const ux = dx/len, uy = dy/len;
  const ax = x2 - ux*8, ay = y2 - uy*8;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ax} y2={ay}
        stroke={color} strokeOpacity={opacity} strokeWidth="1.5"
        strokeDasharray="5 4"
        style={{ animation:`dash-flow ${dur} linear infinite` }} />
      <polygon
        points={`${x2},${y2} ${ax - uy*4},${ay + ux*4} ${ax + uy*4},${ay - ux*4}`}
        fill={color} fillOpacity={Math.min(opacity * 1.3, 1)} />
    </g>
  );
};

/*
 * Box — 테두리 박스만 그림. label/sub 없으면 빈 박스.
 * label은 박스 상단 패딩 고려해서 배치되므로
 * 내부 콘텐츠를 직접 배치할 때는 label/sub 쓰지 않고 children처럼 별도 배치.
 */
const Box = ({ x, y, w, h, rx=8, fill, stroke, fillOp=0.08, strokeOp=0.35,
               label, labelColor, sub, subColor="#94a3b8" }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={rx}
      fill={fill} fillOpacity={fillOp} stroke={stroke} strokeOpacity={strokeOp} strokeWidth="1.5" />
    {label && (
      <text x={x + w/2} y={y + 16} textAnchor="middle"
        fontSize="8" fill={labelColor || stroke} fontFamily="monospace"
        fontWeight="900" fillOpacity="0.9">{label}</text>
    )}
    {sub && (
      <text x={x + w/2} y={y + 27} textAnchor="middle"
        fontSize="7" fill={subColor} fontFamily="monospace" fillOpacity="0.6">{sub}</text>
    )}
  </g>
);

/* ═══════════════════════════════════════════════════════
   1. IntroVis
   수정: transformOrigin y 150px → 130px
═══════════════════════════════════════════════════════ */
const IntroVis = () => {
  const cx = 200, cy = 120; /* 시각적 중앙 위로 조정 */
  const layers = [
    { rx:170, ry:105, color:"#6366f1", op:0.18, dur:"32s", dir:"spin-cw",  dash:"10 6", label:"Algorithm", lx:374, ly:46 },
    { rx:118, ry:72,  color:"#6366f1", op:0.28, dur:"20s", dir:"spin-ccw", dash:"6 5",  label:"Salt",      lx:322, ly:82 },
    { rx:64,  ry:40,  color:"#f59e0b", op:0.45, dur:"12s", dir:"spin-cw",  dash:"4 4",  label:"Pepper",    lx:282, ly:112 },
  ];
  return (
    <SvgCanvas viewBox="0 0 400 260">
      {layers.map((l, i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={l.rx} ry={l.ry}
          fill="none" stroke={l.color} strokeOpacity={l.op} strokeWidth="1.5"
          strokeDasharray={l.dash}
          style={{
            transformOrigin: `${cx}px ${cy}px`,  /* [수정1] cy=130으로 통일 */
            animation: `${l.dir} ${l.dur} linear infinite`
          }} />
      ))}

      {/* 중앙 Shield 박스 */}
      <rect x={cx-26} y={cy-26} width={52} height={52} rx={13}
        fill="#6366f1" fillOpacity="0.12" stroke="#6366f1" strokeOpacity="0.5" strokeWidth="1.5" />
      <Emoji x={cx} y={cy} size={32}>🛡️</Emoji>

      {/* 레이어 레이블 */}
      {layers.map((l, i) => (
        <motion.text key={i} x={l.lx} y={l.ly} textAnchor="end" fontSize="8.5"
          fill={l.color} fontFamily="monospace" fontWeight="900" fillOpacity="0.8"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i*0.3+0.4 }}>
          {l.label}
        </motion.text>
      ))}

      <text x={cx} y={246} textAnchor="middle" fontSize="8.5"
        fill="#6366f1" fontFamily="monospace" fontWeight="900" fillOpacity="0.35"
        letterSpacing="0.15em">DEFENSE IN DEPTH</text>
    </SvgCanvas>
  );
};

/* ═══════════════════════════════════════════════════════
   2. ConceptSaltVis
   수정: mixCy 116 → 120 (polygon 실제 중앙)
═══════════════════════════════════════════════════════ */
const ConceptSaltVis = () => {
  const mixCy = 120; /* [수정2] polygon (96+144)/2 = 120 */
  const users = [
    { user:"Alice", hash:"a4f3e2...9c8d", hy: 46 },
    { user:"Bob",   hash:"3b2a1f...4d5c", hy:116 },
    { user:"Carol", hash:"8e9f0a...2c3d", hy:186 },
  ];
  return (
    <SvgCanvas viewBox="0 0 400 260">
      {/* 입력 박스 */}
      <Box x={14} y={100} w={96} h={40} fill="#6366f1" stroke="#6366f1"
        label="PASSWORD" sub='"iloveyou"' labelColor="#a5b4fc" subColor="#e2e8f0" />

      {/* PASSWORD → Salt 믹서 */}
      <FlowArrow x1={110} y1={120} x2={154} y2={120} color="#6366f1" dur="1s" />

      {/* Salt 믹서 육각형: 중앙 (180, 120) */}
      <polygon points="180,96 204,108 204,132 180,144 156,132 156,108"
        fill="#047857" fillOpacity="0.1" stroke="#10b981" strokeOpacity="0.5" strokeWidth="1.5" />
      <Emoji x={180} y={120} size={26}>🧂</Emoji>
      <text x={180} y={158} textAnchor="middle" fontSize="7.5"
        fill="#047857" fontFamily="monospace" fontWeight="900" fillOpacity="0.8">+ SALT</text>

      {/* 믹서 우측(x=204) → 각 해시 박스 */}
      {users.map((item, i) => (
        <motion.g key={i} initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay: i*0.2+0.3, duration:0.5 }}>
          <FlowArrow x1={204} y1={mixCy} x2={228} y2={item.hy + 14}
            color="#6366f1" dur={`${1.3 + i*0.15}s`} opacity={0.3} />
          {/* 해시 박스: h=28 */}
          <rect x={228} y={item.hy} width={158} height={28} rx={6}
            fill="#6366f1" fillOpacity="0.08" stroke="#6366f1" strokeOpacity="0.25" strokeWidth="1" />
          <text x={236} y={item.hy + 11} fontSize="7" fill="#3d3325" fontFamily="monospace">
            {item.user}
          </text>
          <text x={236} y={item.hy + 22} fontSize="7.5" fill="#1d4ed8"
            fontFamily="monospace" fontWeight="700">{item.hash}</text>
        </motion.g>
      ))}

      <text x={307} y={248} textAnchor="middle" fontSize="8"
        fill="#047857" fontFamily="monospace" fontWeight="900" fillOpacity="0.7">
        UNIQUE PER USER
      </text>
    </SvgCanvas>
  );
};

/* ═══════════════════════════════════════════════════════
   3. ConceptPepperVis
   변경 없음 (검수 통과)
═══════════════════════════════════════════════════════ */
const ConceptPepperVis = () => (
  <SvgCanvas viewBox="0 0 400 260">
    {/* DB 박스 */}
    <Box x={14} y={44} w={164} h={166} rx={12} fill="#ef4444" stroke="#ef4444"
      fillOp={0.05} strokeOp={0.25} label="DATABASE" labelColor="#f87171" sub="(공개 저장)" />

    {/* DB 내부 행: y=80, 110, 140 / h=22 → 최하 162 < 박스하단 210 */}
    {[
      { label:"hash",  val:"a4f3e2...9c8d", vc:"#94a3b8" },
      { label:"salt",  val:"xK9#mP2q",      vc:"#a5b4fc" },
      { label:"email", val:"user@site.com", vc:"#94a3b8" },
    ].map((row, i) => (
      <g key={i}>
        <rect x={26} y={80 + i*30} width={140} height={22} rx={4}
          fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        <text x={34}  y={95 + i*30} fontSize="7" fill="#4a3f2f" fontFamily="monospace">{row.label}:</text>
        <text x={76}  y={95 + i*30} fontSize="7" fill={row.vc}  fontFamily="monospace" fontWeight="700">{row.val}</text>
      </g>
    ))}

    {/* DB 경고 */}
    <motion.text x={96} y={197} textAnchor="middle" fontSize="7.5"
      fill="#ef4444" fontFamily="monospace" fontWeight="900"
      animate={{ opacity:[0.4,1,0.4] }} transition={{ repeat:Infinity, duration:2 }}>
      ⚠ 유출 시 솔트 노출
    </motion.text>

    {/* 구분선 */}
    <line x1={200} y1={28} x2={200} y2={232}
      stroke="#475569" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" />
    <text x={200} y={20} textAnchor="middle" fontSize="7"
      fill="#475569" fontFamily="monospace" fillOpacity="0.6">ISOLATION</text>

    {/* Server ENV 박스: x=210 w=176 → 우측 386 */}
    <Box x={210} y={44} w={176} h={166} rx={12} fill="#f59e0b" stroke="#f59e0b"
      fillOp={0.05} strokeOp={0.3} label="SERVER ENV" labelColor="#fbbf24" sub="(비공개 보관)" />

    {/* Pepper 값 박스: x=224 w=148 → 우측 372 < 386 */}
    <rect x={224} y={110} width={148} height={44} rx={8}
      fill="#92400e" fillOpacity="0.2" stroke="#f59e0b" strokeOpacity="0.5" strokeWidth="1.5" />
    <text x={298} y={128} textAnchor="middle" fontSize="7.5"
      fill="#92400e" fontFamily="monospace" fontWeight="700">PEPPER</text>
    <text x={298} y={142} textAnchor="middle" fontSize="8.5"
      fill="#92400e" fontFamily="monospace" fontWeight="900">"K#9v!P2z..."</text>

    <Emoji x={298} y={178} size={28}>🔐</Emoji>

    <text x={298} y={205} textAnchor="middle" fontSize="7.5"
      fill="#047857" fontFamily="monospace" fontWeight="900" fillOpacity="0.8">
      DB 탈취해도 무용지물
    </text>
  </SvgCanvas>
);

/* ═══════════════════════════════════════════════════════
   4. LinkedInBreachVis
   수정: 이모지 size 12 → 14
═══════════════════════════════════════════════════════ */
const LinkedInBreachVis = () => {
  const events = [
    { t:"Jun 5, 2012",  label:"DB 침해 발생",       sub:"SQL Injection 추정",    color:"#ef4444", em:"💀" },
    { t:"Jun 6, 2012",  label:"6.5M 해시 포럼 공개", sub:"InsidePro 러시아 포럼", color:"#f97316", em:"📢" },
    { t:"Jun 8, 2012",  label:"대규모 크랙 완료",    sub:"SHA-1 무솔트 → 72hr",  color:"#ef4444", em:"🔓" },
    { t:"2016",         label:"실제 1.17억 확인",    sub:"4년 후에야 규모 파악",  color:"#a855f7", em:"😱" },
  ];
  const lineX = 52;

  return (
    <SvgCanvas viewBox="0 0 400 260">
      {/* 타임라인 수직선 */}
      <line x1={lineX} y1={18} x2={lineX} y2={242}
        stroke="#ef4444" strokeOpacity="0.18" strokeWidth="2" />

      {events.map((ev, i) => {
        const cy = 24 + i * 52; /* 간격 56→52, 시작 30→24 — 마지막 카드 하단 204, 배너 248 → 여백 44px */
        return (
          <motion.g key={i}
            initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
            transition={{ delay: i*0.18, duration:0.45 }}>
            {/* 카드 배경 */}
            <rect x={70} y={cy - 14} width={318} height={38} rx={6}
              fill={ev.color} fillOpacity="0.04"
              stroke={ev.color} strokeOpacity="0.12" strokeWidth="1" />
            {/* 타임라인 원 */}
            <circle cx={lineX} cy={cy + 5} r={8}
              fill={ev.color} fillOpacity="0.85" />
            {/* 이모지: size 14→16 */}
            <Emoji x={lineX} y={cy + 5} size={16}>{ev.em}</Emoji>
            {/* 수평 연결선 */}
            <line x1={lineX + 8} y1={cy + 5} x2={78} y2={cy + 5}
              stroke={ev.color} strokeOpacity="0.25" strokeWidth="1" />
            {/* 날짜 */}
            <text x={82} y={cy}     fontSize="7.5" fill={ev.color}
              fontFamily="monospace" fontWeight="900" fillOpacity="0.7">{ev.t}</text>
            {/* 이벤트명 */}
            <text x={82} y={cy + 12} fontSize="9" fill="#1c1610"
              fontFamily="monospace" fontWeight="900">{ev.label}</text>
            {/* 서브 */}
            <text x={82} y={cy + 23} fontSize="7" fill="#4a3f2f"
              fontFamily="monospace">{ev.sub}</text>
          </motion.g>
        );
      })}

      {/* 하단 요약 */}
      <rect x={14} y={248} width={372} height={11} rx={3}
        fill="#ef4444" fillOpacity="0.07" />
      <text x={200} y={257} textAnchor="middle" fontSize="7.5"
        fill="#b91c1c" fontFamily="monospace" fontWeight="900" fillOpacity="0.75">
        SHA-1 · NO SALT · GPU 10억 H/s → 72HR CRACK
      </text>
    </SvgCanvas>
  );
};

/* ═══════════════════════════════════════════════════════
   5. CompareHashingVis
   수정: SVG text 안 이모지(⚡, ✓) 제거 → 텍스트만
═══════════════════════════════════════════════════════ */
const CompareHashingVis = () => {
  const users = ["Alice", "Bob", "Carol"];
  const salted = ["a4f3e2...7e6f", "3b2a1f...6b7a", "8e9f0a...4e5f"];

  return (
    <SvgCanvas viewBox="0 0 400 260">
      {/* 헤더 */}
      <text x={98} y={18} textAnchor="middle" fontSize="8.5"
        fill="#ef4444" fontFamily="monospace" fontWeight="900">WITHOUT SALT</text>
      <text x={300} y={18} textAnchor="middle" fontSize="8.5"
        fill="#6366f1" fontFamily="monospace" fontWeight="900">WITH SALT</text>

      {/* 구분선 */}
      <line x1={200} y1={24} x2={200} y2={210}
        stroke="#334155" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />

      {users.map((u, i) => {
        const ry = 36 + i * 56;
        return (
          <g key={u}>
            {/* 왼쪽: x=16 w=166 → 우측 182 */}
            <text x={16} y={ry + 12} fontSize="7.5" fill="#4a3f2f" fontFamily="monospace">{u}</text>
            <rect x={16} y={ry + 16} width={166} height={22} rx={5}
              fill="#ef4444" fillOpacity="0.07" stroke="#ef4444" strokeOpacity="0.22" strokeWidth="1" />
            <text x={99} y={ry + 31} textAnchor="middle" fontSize="7.5"
              fill="#b91c1c" fontFamily="monospace" fontWeight="700">e10adc...883e</text>

            {/* 오른쪽: x=210 w=176 → 우측 386 */}
            <motion.g initial={{ opacity:0, x:6 }} animate={{ opacity:1, x:0 }}
              transition={{ delay: i*0.15 + 0.2, duration:0.45 }}>
              <text x={210} y={ry + 12} fontSize="7.5" fill="#4a3f2f" fontFamily="monospace">{u}</text>
              <rect x={210} y={ry + 16} width={176} height={22} rx={5}
                fill="#6366f1" fillOpacity="0.08" stroke="#6366f1" strokeOpacity="0.28" strokeWidth="1" />
              <text x={298} y={ry + 31} textAnchor="middle" fontSize="7.5"
                fill="#1d4ed8" fontFamily="monospace" fontWeight="700">{salted[i]}</text>
            </motion.g>
          </g>
        );
      })}

      {/* [수정5] 이모지 제거, 텍스트만 */}
      <motion.text x={98} y={222} textAnchor="middle" fontSize="8"
        fill="#ef4444" fontFamily="monospace" fontWeight="900"
        animate={{ opacity:[0.4,1,0.4] }} transition={{ repeat:Infinity, duration:2 }}>
        SAME = COLLECTIVE VULN
      </motion.text>
      <text x={298} y={222} textAnchor="middle" fontSize="8"
        fill="#047857" fontFamily="monospace" fontWeight="900">
        ALL UNIQUE = SAFE
      </text>
    </SvgCanvas>
  );
};

/* ═══════════════════════════════════════════════════════
   6. RainbowTableVis
   레이아웃: 좌(ATTACKER) | 우상(NO SALT) / 우하(WITH SALT)
   → NO SALT y=20~100, WITH SALT y=140~220 — 같은 x 대역에 수직으로 정렬
   → ATTACKER는 y=60~180 중앙에 배치해 양쪽 경로와 자연스럽게 연결
═══════════════════════════════════════════════════════ */
const RainbowTableVis = () => (
  <SvgCanvas viewBox="0 0 400 260">
    {/* ── ATTACKER (좌측 중앙) ── */}
    <Box x={8} y={72} w={76} h={90} fill="#ef4444" stroke="#ef4444"
      fillOp={0.08} strokeOp={0.3} />
    <Emoji x={46} y={96} size={26}>👾</Emoji>
    <text x={46} y={117} textAnchor="middle" fontSize="7.5"
      fill="#b91c1c" fontFamily="monospace" fontWeight="900">ATTACKER</text>
    <text x={46} y={129} textAnchor="middle" fontSize="7"
      fill="#3d3325" fontFamily="monospace">Rainbow</text>
    <text x={46} y={140} textAnchor="middle" fontSize="7"
      fill="#3d3325" fontFamily="monospace">Table</text>

    {/* ── 위쪽 화살표: ATTACKER → NO SALT DB ── */}
    <FlowArrow x1={84} y1={92} x2={138} y2={60} color="#ef4444" dur="0.9s" opacity={0.65} />

    {/* ── NO SALT (우측 상단) ── */}
    {/* NO SALT 박스: x=138 w=250 — WITH SALT 박스와 동일 너비(138+250=388) */}
    <text x={263} y={26} textAnchor="middle" fontSize="8"
      fill="#ef4444" fontFamily="monospace" fontWeight="900">NO SALT</text>
    <Box x={138} y={32} w={250} h={68} fill="#ef4444" stroke="#ef4444"
      fillOp={0.06} strokeOp={0.28} />
    {["Alice","Bob","Carol"].map((u, i) => (
      <g key={u}>
        <text x={150} y={50 + i*16} fontSize="7" fill="#4a3f2f" fontFamily="monospace">{u}:</text>
        <text x={178} y={50 + i*16} fontSize="7" fill="#b91c1c" fontFamily="monospace" fontWeight="700">e10adc...883e</text>
      </g>
    ))}
    {/* 즉시 크랙 레이블: 박스 하단(100) 바로 아래 */}
    <motion.text x={263} y={116} textAnchor="middle" fontSize="8"
      fill="#ef4444" fontFamily="monospace" fontWeight="900"
      animate={{ opacity:[0,1,0] }} transition={{ repeat:Infinity, duration:1.4 }}>
      CRACKED INSTANTLY
    </motion.text>

    {/* ── 구분선 ── */}
    <line x1={130} y1={130} x2={392} y2={130}
      stroke="#475569" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.35" />

    {/* ── 아래쪽 화살표: ATTACKER → WITH SALT WALL ── */}
    <FlowArrow x1={84} y1={150} x2={138} y2={178} color="#6366f1" dur="1.1s" opacity={0.45} />

    {/* ── WITH SALT (우측 하단) ── */}
    <text x={263} y={148} textAnchor="middle" fontSize="8"
      fill="#6366f1" fontFamily="monospace" fontWeight="900">WITH SALT</text>

    {/* WALL: x=138 w=14 → 우측 152 */}
    <motion.rect x={138} y={158} width={14} height={62} rx={4}
      fill="#6366f1" fillOpacity="0.15" stroke="#6366f1" strokeOpacity="0.45" strokeWidth="1.5"
      animate={{ opacity:[0.45,1,0.45] }} transition={{ repeat:Infinity, duration:2 }} />

    {/* 방패 이모지: WALL 우측(152)과 DB 좌측(172) 사이 중앙 x=162, 박스 수직 중앙 y=189 */}
    <Emoji x={162} y={189} size={18}>🛡️</Emoji>

    {/* With Salt DB 박스: x=172 w=216 → 우측 388, 하단 220
        WALL(x=138 w=14 → 우측152) + 갭 20px → DB x=172 */}
    <Box x={172} y={158} w={216} h={62} fill="#6366f1" stroke="#6366f1"
      fillOp={0.06} strokeOp={0.28} />
    {[
      { u:"Alice", h:"a4f3...7e6f" },
      { u:"Bob",   h:"3b2a...6b7a" },
      { u:"Carol", h:"8e9f...4e5f" },
    ].map((item, i) => (
      <g key={item.u}>
        <text x={184} y={176 + i*16} fontSize="7" fill="#4a3f2f" fontFamily="monospace">{item.u}:</text>
        <text x={212} y={176 + i*16} fontSize="7" fill="#1d4ed8" fontFamily="monospace" fontWeight="700">{item.h}</text>
      </g>
    ))}

    {/* 하단 결과 레이블: NO SALT 박스 중앙 x=263과 맞춤 */}
    <text x={263} y={238} textAnchor="middle" fontSize="7.5"
      fill="#047857" fontFamily="monospace" fontWeight="900">RAINBOW TABLE NULLIFIED</text>
  </SvgCanvas>
);

/* ═══════════════════════════════════════════════════════
   7. VaultSealingVis
   수정:
   - ATTACKER box: label/sub 제거, 별도 텍스트로 y 분리
   - DB box: h 80 → 90, 내부 텍스트 y 조정
═══════════════════════════════════════════════════════ */
const VaultSealingVis = () => (
  <SvgCanvas viewBox="0 0 400 260">
    {/* 공격자: 순수 박스 + 별도 배치 */}
    <Box x={6} y={82} w={68} h={84} fill="#ef4444" stroke="#ef4444"
      fillOp={0.08} strokeOp={0.3} />
    <Emoji x={40} y={104} size={24}>👾</Emoji>
    <text x={40} y={123} textAnchor="middle" fontSize="7.5"
      fill="#b91c1c" fontFamily="monospace" fontWeight="900">ATTACKER</text>
    <text x={40} y={134} textAnchor="middle" fontSize="7"
      fill="#3d3325" fontFamily="monospace">DB 탈취</text>
    <text x={40} y={144} textAnchor="middle" fontSize="7"
      fill="#3d3325" fontFamily="monospace">완료</text>

    {/* 공격자 → DB */}
    <FlowArrow x1={74} y1={124} x2={112} y2={124} color="#ef4444" dur="0.85s" opacity={0.7} />

    {/* [수정7] DB box: y=82 h=90 → 하단 172
       내부 텍스트: label y=82+16=98, sub y=82+27=109
       내부 행: y=122, 135, 148 → 최하 148 < 172 OK */}
    <Box x={112} y={82} w={92} h={90} fill="#ef4444" stroke="#ef4444"
      fillOp={0.06} strokeOp={0.35} label="DATABASE" labelColor="#f87171" sub="(탈취됨)" />
    {[
      { label:"hash:",   val:"a4f3...9c8d", vc:"#94a3b8" },
      { label:"salt:",   val:"xK9#mP2q",   vc:"#a5b4fc" },
      { label:"pepper:", val:"???",         vc:"#ef4444"  },
    ].map((row, i) => (
      <text key={i} x={120} y={122 + i*13} fontSize="7" fontFamily="monospace">
        <tspan fill="#4a3f2f">{row.label}</tspan>
        <tspan fill={row.vc} fontWeight="700"> {row.val}</tspan>
      </text>
    ))}

    {/* DB → 해독 시도 */}
    <FlowArrow x1={204} y1={124} x2={234} y2={124} color="#ef4444" dur="0.9s" opacity={0.4} />

    {/* PEPPER WALL: y=72 h=120 → 하단 192 */}
    <motion.rect x={236} y={72} width={20} height={120} rx={5}
      fill="#f59e0b" fillOpacity="0.18" stroke="#f59e0b" strokeOpacity="0.55" strokeWidth="2"
      animate={{ opacity:[0.55,1,0.55] }} transition={{ repeat:Infinity, duration:2.2 }} />
    <Emoji x={246} y={132} size={20}>🔒</Emoji>

    {/* 차단 표시 — WALL 우측(256)과 Server ENV 좌측(278) 사이 중앙 */}
    <motion.text x={267} y={126} textAnchor="middle" fontSize="13"
      animate={{ opacity:[0.3,1,0.3] }} transition={{ repeat:Infinity, duration:1.6 }}>
      ✋
    </motion.text>

    {/* Server ENV: x=278 y=72 w=114 h=120 → 우측 392, 하단 192 */}
    <Box x={278} y={72} w={114} h={120} rx={10} fill="#f59e0b" stroke="#f59e0b"
      fillOp={0.05} strokeOp={0.35} label="SERVER ENV" labelColor="#fbbf24" sub="(분리 보관)" />

    {/* Pepper 내부 박스: x=288 y=112 w=94 h=40 → 우측 382, 하단 152 < 192 */}
    <rect x={288} y={112} width={94} height={40} rx={7}
      fill="#92400e" fillOpacity="0.25" stroke="#f59e0b" strokeOpacity="0.5" strokeWidth="1.5" />
    <text x={335} y={128} textAnchor="middle" fontSize="7.5"
      fill="#92400e" fontFamily="monospace" fontWeight="700">PEPPER</text>
    <text x={335} y={142} textAnchor="middle" fontSize="8.5"
      fill="#92400e" fontFamily="monospace" fontWeight="900">"K#9v!P2z"</text>

    {/* 결과 배너: y=204 h=38 → 하단 242 */}
    <rect x={8} y={204} width={384} height={38} rx={7}
      fill="#047857" fillOpacity="0.06" stroke="#10b981" strokeOpacity="0.2" strokeWidth="1" />
    <text x={200} y={220} textAnchor="middle" fontSize="8.5"
      fill="#065f46" fontFamily="monospace" fontWeight="900">
      DB 탈취 → 페퍼 없음 → 해독 불가
    </text>
    <text x={200} y={234} textAnchor="middle" fontSize="7.5"
      fill="#047857" fontFamily="monospace" fillOpacity="0.65">
      Salt(DB) + Pepper(ENV) = 분리된 두 비밀
    </text>
  </SvgCanvas>
);

/* ═══════════════════════════════════════════════════════
   Fallback
═══════════════════════════════════════════════════════ */
const FallbackVis = () => (
  <SvgCanvas viewBox="0 0 400 260">
    <Emoji x={200} y={120} size={56}>🛡️</Emoji>
    <text x={200} y={170} textAnchor="middle" fontSize="8.5"
      fill="#6366f1" fontFamily="monospace" fontWeight="900"
      fillOpacity="0.35" letterSpacing="0.15em">SECURITY VISUALIZATION</text>
  </SvgCanvas>
);

/* ═══════════════════════════════════════════════════════
   메인 라우터
═══════════════════════════════════════════════════════ */
export default function ScenarioVis({ scene }) {
  if (!scene) return null;

  const renderVis = () => {
    if (scene.visualTrigger === "linkedin_leaked_db_visualization") return <LinkedInBreachVis />;
    if (scene.visualTrigger === "vault_sealing_animation")          return <VaultSealingVis />;
    if (scene.visualTrigger === "rainbow_table_comparison")         return <RainbowTableVis />;
    switch (scene.id) {
      case "scene_01_intro":        return <IntroVis />;
      case "scene_02_salt_def":     return <ConceptSaltVis />;
      case "scene_04_pepper_def":   return <ConceptPepperVis />;
      default:
        if (scene.type === "SIMULATION_COMPARE") return <CompareHashingVis />;
        return <FallbackVis />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scene.id}
        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        transition={{ duration:0.35 }}
        className="w-full h-full flex items-center justify-center p-3"
      >
        {renderVis()}
      </motion.div>
    </AnimatePresence>
  );
}