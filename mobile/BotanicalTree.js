import React from 'react';
import Svg, { Circle, Path, G, Ellipse } from 'react-native-svg';

/**
 * BotanicalTree: Organic vector illustration that dynamically develops
 * through 7 distinct botanical growth stages as study progress accumulates.
 */
export default function BotanicalTree({
  progress = 0,
  isDark = false,
  running = false,
  isComplete = false,
  width = 140,
  height = 100
}) {
  const p = Math.max(0, Math.min(1, Number(progress) || 0));

  // Theme palettes
  const groundColor = isDark ? '#2D1F17' : '#D7CCC8';
  const groundStroke = isDark ? '#4E342E' : '#A1887F';
  const trunkBase = isDark ? '#4E342E' : '#6D4C41';
  const trunkHighlight = isDark ? '#6D4C41' : '#8D6E63';

  // Green foliage hues
  const darkGreen = isDark ? '#044E36' : '#047857';
  const midGreen = isDark ? '#059669' : '#10B981';
  const brightGreen = isDark ? '#10B981' : '#34D399';
  const lightGreen = isDark ? '#34D399' : '#6EE7B7';
  const limeSprout = isDark ? '#84CC16' : '#A3E635';

  const renderGround = (
    <G>
      <Ellipse cx="80" cy="110" rx="38" ry="5.5" fill={groundColor} opacity={0.8} />
      <Path
        d="M 32 110 Q 80 103 128 110"
        stroke={groundStroke}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </G>
  );

  // STAGE 1: 0% — Seed / Tiny Sprout
  if (p <= 0.005) {
    return (
      <Svg width={width} height={height} viewBox="0 0 160 120">
        {renderGround}
        {/* Seed */}
        <Ellipse cx="80" cy="108" rx="8" ry="5.5" fill="#795548" />
        <Path d="M 76 107 Q 80 105 84 107" stroke="#4E342E" strokeWidth="1.2" fill="none" />
        {/* Tender shoot tip just emerging */}
        <Path d="M 78 106 Q 80 97 83 95 Q 83 103 80 106" fill={limeSprout} />
        <Circle cx="82" cy="96" r="2.2" fill={brightGreen} />
      </Svg>
    );
  }

  // STAGE 2: 1% to 20% — Small seedling emerges
  if (p <= 0.20) {
    const stageP = (p - 0.005) / 0.195;
    const stemTop = 106 - stageP * 20; // 106 down to 86
    const leafSize = 4 + stageP * 7;

    return (
      <Svg width={width} height={height} viewBox="0 0 160 120">
        {renderGround}
        {/* Husk */}
        <Ellipse cx="76" cy="108" rx="5" ry="3.5" fill="#795548" opacity={0.6} />
        {/* Rising Stem */}
        <Path
          d={`M 80 108 Q ${79 - stageP * 2} ${(108 + stemTop) / 2} 80 ${stemTop}`}
          stroke={midGreen}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Cotyledon Leaves */}
        <Path
          d={`M 80 ${stemTop + 4} C ${80 - leafSize} ${stemTop - 2} ${80 - leafSize - 2} ${stemTop + 5} 80 ${stemTop + 2}`}
          fill={midGreen}
        />
        <Path
          d={`M 80 ${stemTop + 4} C ${80 + leafSize} ${stemTop - 2} ${80 + leafSize + 2} ${stemTop + 5} 80 ${stemTop + 2}`}
          fill={brightGreen}
        />
        <Circle cx="80" cy={stemTop - 1} r="2.4" fill={limeSprout} />
      </Svg>
    );
  }

  // STAGE 3: 20% to 40% — Stem grows and first leaves appear
  if (p <= 0.40) {
    const stageP = (p - 0.20) / 0.20;
    const stemHeight = 86 - stageP * 16; // 86 down to 70

    return (
      <Svg width={width} height={height} viewBox="0 0 160 120">
        {renderGround}
        {/* Woody base stalk */}
        <Path d="M 80 108 L 80 90" stroke={trunkBase} strokeWidth="4.5" strokeLinecap="round" />
        <Path d={`M 80 90 L 80 ${stemHeight}`} stroke={midGreen} strokeWidth="3.5" strokeLinecap="round" />
        {/* Lower mature leaves */}
        <Path d="M 80 94 C 62 88 58 99 80 95" fill={darkGreen} />
        <Path d="M 80 94 C 98 88 102 99 80 95" fill={midGreen} />
        {/* Upper new leaves */}
        <Path d={`M 80 ${stemHeight + 8} C 65 ${stemHeight - 1} 65 ${stemHeight + 11} 80 ${stemHeight + 5}`} fill={brightGreen} />
        <Path d={`M 80 ${stemHeight + 8} C 95 ${stemHeight - 1} 95 ${stemHeight + 11} 80 ${stemHeight + 5}`} fill={lightGreen} />
        {/* Apical shoot */}
        <Path d={`M 80 ${stemHeight} Q 80 ${stemHeight - 7} 81 ${stemHeight - 9} Q 82 ${stemHeight - 3} 80 ${stemHeight}`} fill={limeSprout} />
      </Svg>
    );
  }

  // STAGE 4: 40% to 60% — Sapling develops additional branches and leaves
  if (p <= 0.60) {
    const stageP = (p - 0.40) / 0.20;
    const foliageR = 12 + stageP * 4;

    return (
      <Svg width={width} height={height} viewBox="0 0 160 120">
        {renderGround}
        {/* Sturdy Trunk */}
        <Path d="M 80 108 L 80 76" stroke={trunkBase} strokeWidth="5.5" strokeLinecap="round" />
        {/* Branch structure */}
        <Path d="M 80 84 Q 72 74 62 68" stroke={trunkBase} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <Path d="M 80 80 Q 88 72 98 66" stroke={trunkBase} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <Path d="M 80 76 L 80 58" stroke={trunkBase} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {/* Foliage Clusters */}
        <Circle cx="60" cy="64" r={foliageR} fill={darkGreen} />
        <Circle cx="58" cy="62" r={foliageR * 0.75} fill={midGreen} />
        <Circle cx="100" cy="62" r={foliageR} fill={darkGreen} />
        <Circle cx="98" cy="60" r={foliageR * 0.75} fill={midGreen} />
        <Circle cx="80" cy="52" r={foliageR * 1.15} fill={midGreen} />
        <Circle cx="80" cy="49" r={foliageR * 0.8} fill={brightGreen} />
      </Svg>
    );
  }

  // STAGE 5: 60% to 80% — Tree becomes larger and fuller
  if (p <= 0.80) {
    const stageP = (p - 0.60) / 0.20;
    const spread = stageP * 4;

    return (
      <Svg width={width} height={height} viewBox="0 0 160 120">
        {renderGround}
        {/* Roots */}
        <Path d="M 76 108 Q 70 111 64 111 M 84 108 Q 90 111 96 111" stroke={trunkBase} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Thickening Trunk */}
        <Path d="M 80 108 L 80 66" stroke={trunkBase} strokeWidth="7" strokeLinecap="round" />
        {/* Spreading Branches */}
        <Path d="M 80 78 Q 66 66 50 58" stroke={trunkBase} strokeWidth="4.2" strokeLinecap="round" fill="none" />
        <Path d="M 80 74 Q 94 62 110 56" stroke={trunkBase} strokeWidth="4.2" strokeLinecap="round" fill="none" />
        <Path d="M 80 66 L 80 46" stroke={trunkBase} strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* 5-Cluster Canopy */}
        <Circle cx={50 - spread} cy="56" r="16" fill={darkGreen} />
        <Circle cx={50 - spread} cy="53" r="12" fill={midGreen} />
        <Circle cx={110 + spread} cy="54" r="16" fill={darkGreen} />
        <Circle cx={108 + spread} cy="51" r="12" fill={midGreen} />
        <Circle cx="64" cy="40" r="17" fill={darkGreen} />
        <Circle cx="63" cy="37" r="13" fill={brightGreen} />
        <Circle cx="96" cy="38" r="17" fill={darkGreen} />
        <Circle cx="95" cy="35" r="13" fill={brightGreen} />
        <Circle cx="80" cy="30" r="19" fill={midGreen} />
        <Circle cx="80" cy="27" r="14" fill={brightGreen} />
      </Svg>
    );
  }

  // STAGE 6: 80% to 99% — Nearly mature tree
  if (p < 1.0) {
    return (
      <Svg width={width} height={height} viewBox="0 0 160 120">
        {renderGround}
        {/* Deep anchoring roots */}
        <Path d="M 75 108 Q 68 111 60 111 M 85 108 Q 92 111 100 111" stroke={trunkBase} strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Solid Trunk */}
        <Path d="M 80 108 L 80 62" stroke={trunkBase} strokeWidth="8.5" strokeLinecap="round" />
        <Path d="M 78 100 L 78 68" stroke={trunkHighlight} strokeWidth="1.5" strokeLinecap="round" />
        {/* Canopy Branches */}
        <Path d="M 80 74 Q 64 62 44 54" stroke={trunkBase} strokeWidth="4.8" strokeLinecap="round" fill="none" />
        <Path d="M 80 70 Q 96 58 116 52" stroke={trunkBase} strokeWidth="4.8" strokeLinecap="round" fill="none" />
        <Path d="M 80 62 L 80 40" stroke={trunkBase} strokeWidth="4.5" strokeLinecap="round" fill="none" />
        {/* Lush layered canopy */}
        <Circle cx="44" cy="52" r="17" fill={darkGreen} />
        <Circle cx="43" cy="49" r="13" fill={midGreen} />
        <Circle cx="116" cy="50" r="17" fill={darkGreen} />
        <Circle cx="114" cy="47" r="13" fill={midGreen} />
        <Circle cx="58" cy="36" r="19" fill={darkGreen} />
        <Circle cx="57" cy="33" r="14" fill={brightGreen} />
        <Circle cx="102" cy="34" r="19" fill={darkGreen} />
        <Circle cx="101" cy="31" r="14" fill={brightGreen} />
        <Circle cx="80" cy="24" r="22" fill={midGreen} />
        <Circle cx="80" cy="20" r="16" fill={brightGreen} />
        <Circle cx="80" cy="17" r="9" fill={lightGreen} />
      </Svg>
    );
  }

  // STAGE 7: 100% — Fully mature, healthy green tree with golden fruits
  return (
    <Svg width={width} height={height} viewBox="0 0 160 120">
      {/* Radiant completion halo */}
      <Circle cx="80" cy="38" r="46" fill={brightGreen} opacity={isDark ? 0.22 : 0.18} />
      {renderGround}
      {/* Roots */}
      <Path d="M 75 108 Q 66 112 56 112 M 85 108 Q 94 112 104 112" stroke={trunkBase} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* Full Majestic Trunk */}
      <Path d="M 80 108 L 80 60" stroke={trunkBase} strokeWidth="9.5" strokeLinecap="round" />
      <Path d="M 77 104 L 77 66" stroke={trunkHighlight} strokeWidth="2" strokeLinecap="round" />
      {/* Branch network */}
      <Path d="M 80 72 Q 62 60 40 50" stroke={trunkBase} strokeWidth="5.2" strokeLinecap="round" fill="none" />
      <Path d="M 80 68 Q 98 56 120 48" stroke={trunkBase} strokeWidth="5.2" strokeLinecap="round" fill="none" />
      <Path d="M 80 60 L 80 36" stroke={trunkBase} strokeWidth="4.8" strokeLinecap="round" fill="none" />
      {/* Full 7-Cluster Crown */}
      <Circle cx="40" cy="48" r="18" fill={darkGreen} />
      <Circle cx="39" cy="45" r="14" fill={midGreen} />
      <Circle cx="120" cy="46" r="18" fill={darkGreen} />
      <Circle cx="118" cy="43" r="14" fill={midGreen} />
      <Circle cx="56" cy="32" r="21" fill={darkGreen} />
      <Circle cx="55" cy="29" r="15" fill={brightGreen} />
      <Circle cx="104" cy="30" r="21" fill={darkGreen} />
      <Circle cx="103" cy="27" r="15" fill={brightGreen} />
      <Circle cx="80" cy="20" r="24" fill={midGreen} />
      <Circle cx="80" cy="16" r="17" fill={brightGreen} />
      <Circle cx="80" cy="13" r="10" fill={lightGreen} />
      {/* Golden Focus Fruit / Blossom Accents */}
      <Circle cx="42" cy="42" r="3" fill="#F59E0B" />
      <Circle cx="116" cy="40" r="3" fill="#F59E0B" />
      <Circle cx="64" cy="24" r="3.2" fill="#FBBF24" />
      <Circle cx="96" cy="22" r="3.2" fill="#FBBF24" />
      <Circle cx="80" cy="10" r="3.5" fill="#FBBF24" />
      <Circle cx="72" cy="34" r="2.8" fill="#F59E0B" />
      <Circle cx="88" cy="32" r="2.8" fill="#FBBF24" />
      {/* Celebratory Star Sparkles */}
      <Path d="M 22 24 L 24 20 L 26 24 L 30 26 L 26 28 L 24 32 L 22 28 L 18 26 Z" fill="#FBBF24" />
      <Path d="M 136 22 L 137.5 19 L 139 22 L 142 23.5 L 139 25 L 137.5 28 L 136 25 L 133 23.5 Z" fill="#FBBF24" />
    </Svg>
  );
}
