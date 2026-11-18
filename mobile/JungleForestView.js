import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform
} from 'react-native';
import Svg, {
  Path,
  Circle,
  Ellipse,
  G,
  Defs,
  LinearGradient,
  Stop,
  Rect
} from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import {
  calculateForestGrowth,
  calculateTodayStudyStats,
  DAILY_GOAL_HOURS,
  DAILY_GOAL_SECONDS
} from './studyStats';

/**
 * JungleForestView: Dynamic Growing Jungle & Forest Visualization
 *
 * Visual Language:
 * - Deterministic, organic SVG landscape derived strictly from verified completed study sessions.
 * - 7 visual milestones: Sapling -> Growing Plants -> First Trees -> Small Forest -> Medium Forest -> Dense Forest -> Fully Grown Jungle.
 * - Layered depth: distant misty mountains, midground hill ridge, lush foreground terrain.
 * - Smooth subtle entrance / growth animation without heavy interval loops.
 * - Emerald green, sage, mint, and earthy nature-inspired tones.
 */
export default function JungleForestView({
  sessions = [],
  isDark = false,
  theme,
  lang = 'en',
  t = (k, fb) => fb
}) {
  const C = theme || {
    bg: isDark ? '#051811' : '#F4FBF7',
    white: isDark ? '#0F291E' : '#FFFFFF',
    ink: isDark ? '#F2FDF7' : '#0B291B',
    muted: isDark ? '#75A991' : '#4D7865',
    blue: isDark ? '#10B981' : '#059669',
    soft: isDark ? '#143829' : '#ECFDF5',
    line: isDark ? '#17382A' : '#D1FAE5',
    gold: '#F59E0B',
    goldSoft: isDark ? '#3B290A' : '#FEF3C7'
  };

  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true
    }).start();
  }, [sessions.length]);

  // Dynamic calculations from single source of truth
  const forest = calculateForestGrowth(sessions);
  const todayStats = calculateTodayStudyStats(sessions, DAILY_GOAL_SECONDS);

  // Stage titles in current language
  const getStageTitle = (stage) => {
    if (!stage) return '';
    if (lang === 'mr') return stage.titleMr || stage.titleEn;
    if (lang === 'hi') return stage.titleHi || stage.titleEn;
    return stage.titleEn;
  };

  const getStageDesc = (stage) => {
    if (!stage) return '';
    if (lang === 'mr') return stage.descriptionMr || stage.descriptionEn;
    if (lang === 'hi') return stage.descriptionHi || stage.descriptionEn;
    return stage.descriptionEn;
  };

  // Color tokens for landscape
  const skyGradTop = isDark ? '#03170F' : '#E6F8EF';
  const skyGradBottom = isDark ? '#0B291D' : '#C4EED8';
  const sunColor = isDark ? '#E2E8F0' : '#FEF08A';
  const sunGlow = isDark ? '#64748B' : '#FDE047';
  const mountainColor = isDark ? '#082E20' : '#A3E3C3';
  const midHillColor = isDark ? '#0A3B29' : '#65D5A5';
  const foreTerrainColor = isDark ? '#0D4732' : '#10B981';
  const groundBaseColor = isDark ? '#092F21' : '#059669';

  // Render individual tree by type
  const renderTree = (tree) => {
    const { id, type, x, y, scale = 1, isToday = false } = tree;

    const renderTreeGraphic = () => {
      switch (type) {
        case 'sapling':
          return (
            <G>
              {/* Seed Husk */}
              <Ellipse cx="0" cy="0" rx="3.5" ry="2" fill="#78350F" opacity={0.7} />
              {/* Tender stem */}
              <Path d="M 0 0 Q -1 -8 0 -14" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Leaves */}
              <Path d="M 0 -14 C -6 -16 -6 -10 0 -11" fill="#34D399" />
              <Path d="M 0 -14 C 6 -16 6 -10 0 -11" fill="#10B981" />
              <Circle cx="0" cy="-15" r="1.5" fill="#A7F3D0" />
            </G>
          );

        case 'plant':
          return (
            <G>
              {/* Little woody mound */}
              <Ellipse cx="0" cy="0" rx="4" ry="2" fill="#854D0E" opacity={0.6} />
              {/* Stems */}
              <Path d="M 0 0 Q -2 -10 -4 -18" stroke="#059669" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <Path d="M 0 0 Q 3 -8 5 -16" stroke="#10B981" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <Path d="M 0 0 L 0 -22" stroke="#34D399" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Leaves */}
              <Ellipse cx="-5" cy="-18" rx="4" ry="2" fill="#34D399" transform="rotate(-30 -5 -18)" />
              <Ellipse cx="6" cy="-16" rx="3.8" ry="1.9" fill="#10B981" transform="rotate(25 6 -16)" />
              <Ellipse cx="0" cy="-23" rx="4.5" ry="2.2" fill="#6EE7B7" transform="rotate(-10 0 -23)" />
            </G>
          );

        case 'oak_young':
          return (
            <G>
              {/* Trunk */}
              <Path d="M -1.8 0 L -1 -15 L 1 -15 L 1.8 0 Z" fill="#78350F" />
              {/* Foliage */}
              <Circle cx="0" cy="-21" r="9" fill="#047857" />
              <Circle cx="-4" cy="-20" r="7" fill="#059669" />
              <Circle cx="4" cy="-22" r="7.5" fill="#10B981" />
              <Circle cx="0" cy="-24" r="6" fill="#34D399" opacity={0.9} />
            </G>
          );

        case 'pine':
        case 'pine_ridge':
          return (
            <G>
              {/* Trunk */}
              <Path d="M -1.2 0 L -0.8 -10 L 0.8 -10 L 1.2 0 Z" fill="#78350F" />
              {/* 3 Tier Needle Foliage */}
              <Path d="M 0 -32 L 8 -18 L -8 -18 Z" fill="#065F46" />
              <Path d="M 0 -26 L 10 -12 L -10 -12 Z" fill="#047857" />
              <Path d="M 0 -20 L 12 -6 L -12 -6 Z" fill="#059669" />
              <Path d="M 0 -32 L 4 -20 L -4 -20 Z" fill="#10B981" opacity={0.6} />
            </G>
          );

        case 'oak':
        case 'oak_ridge':
          return (
            <G>
              {/* Gnarled Trunk */}
              <Path d="M -3 0 Q -1.5 -10 -2 -18 L 2 -18 Q 1.5 -10 3 0 Z" fill="#5A3A1A" />
              {/* Main Foliage lobes */}
              <Circle cx="0" cy="-28" r="14" fill="#064E3B" />
              <Circle cx="-8" cy="-26" r="11" fill="#047857" />
              <Circle cx="8" cy="-28" r="11.5" fill="#059669" />
              <Circle cx="-3" cy="-34" r="10" fill="#10B981" />
              <Circle cx="4" cy="-33" r="9.5" fill="#34D399" opacity={0.85} />
            </G>
          );

        case 'broadleaf':
        case 'broadleaf_ridge':
          return (
            <G>
              {/* Tall trunk */}
              <Path d="M -2 0 L -1 -22 L 1 -22 L 2 0 Z" fill="#713F12" />
              {/* Canopy */}
              <Ellipse cx="0" cy="-32" rx="12" ry="16" fill="#047857" />
              <Ellipse cx="-3" cy="-33" rx="10" ry="14" fill="#059669" />
              <Ellipse cx="3" cy="-35" rx="8" ry="12" fill="#10B981" />
              <Circle cx="0" cy="-38" r="6" fill="#6EE7B7" opacity={0.7} />
            </G>
          );

        case 'palm':
          return (
            <G>
              {/* Sweeping slender trunk */}
              <Path d="M 0 0 Q 6 -18 2 -32 L -0.5 -32 Q 3 -18 -2 0 Z" fill="#92400E" />
              {/* Palm Fronds */}
              <Path d="M 1 -32 Q 12 -40 18 -32" stroke="#047857" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <Path d="M 1 -32 Q 10 -46 4 -48" stroke="#059669" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <Path d="M 1 -32 Q -8 -44 -14 -40" stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <Path d="M 1 -32 Q -12 -36 -16 -28" stroke="#059669" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <Path d="M 1 -32 Q 0 -48 -2 -50" stroke="#34D399" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Coconuts / Fruits */}
              <Circle cx="0" cy="-31" r="1.8" fill="#78350F" />
              <Circle cx="2" cy="-31" r="1.6" fill="#B45309" />
            </G>
          );

        case 'ancient_banyan':
        case 'sacred_canopy':
          return (
            <G>
              {/* Mighty Grand Trunk with Roots */}
              <Path d="M -5 0 Q -3 -12 -4 -22 L 4 -22 Q 3 -12 5 0 Z" fill="#451A03" />
              <Path d="M -7 0 Q -4 -8 -3 -16" stroke="#78350F" strokeWidth="1.5" fill="none" />
              <Path d="M 7 0 Q 4 -8 3 -16" stroke="#78350F" strokeWidth="1.5" fill="none" />
              {/* Massive Tiered Canopy */}
              <Ellipse cx="0" cy="-35" rx="22" ry="16" fill="#064E3B" />
              <Circle cx="-12" cy="-34" r="14" fill="#047857" />
              <Circle cx="12" cy="-34" r="14" fill="#059669" />
              <Circle cx="-6" cy="-42" r="13" fill="#10B981" />
              <Circle cx="6" cy="-42" r="13" fill="#34D399" opacity={0.9} />
              <Circle cx="0" cy="-45" r="9" fill="#6EE7B7" opacity={0.8} />
              {/* Golden Bloom dots celebrating mastery */}
              <Circle cx="-8" cy="-38" r="1.8" fill="#F59E0B" />
              <Circle cx="8" cy="-40" r="1.8" fill="#FBBF24" />
              <Circle cx="0" cy="-43" r="2" fill="#FCD34D" />
              <Circle cx="-14" cy="-32" r="1.5" fill="#F59E0B" />
              <Circle cx="14" cy="-33" r="1.5" fill="#FBBF24" />
            </G>
          );

        default:
          return null;
      }
    };

    return (
      <G key={id} transform={`translate(${x}, ${y}) scale(${scale})`}>
        {renderTreeGraphic()}
        {/* Subtle fresh growth glow on trees planted today */}
        {isToday && (
          <G transform="translate(0, -36)">
            <Circle cx="0" cy="0" r="3" fill="#10B981" opacity={0.9} />
            <Circle cx="0" cy="0" r="1.6" fill="#FEF08A" />
          </G>
        )}
      </G>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: C.white, borderColor: C.line }]}>
      {/* 1. Header with Stage Badge & Description */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: C.blue, letterSpacing: 0.5 }}>
              {t('jungleSanctuary', 'LIVING JUNGLE SANCTUARY')}
            </Text>
            <View
              style={{
                backgroundColor: C.soft,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: C.line
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: C.blue }}>
                Level {forest.currentLevel.level} • Permanent Jungle
              </Text>
            </View>
          </View>

          <Text style={[styles.stageHeading, { color: C.ink }]}>
            {forest.currentLevel.emoji} {getStageTitle(forest.currentLevel)}
          </Text>

          <Text style={[styles.stageSubtitle, { color: C.muted }]}>
            {getStageDesc(forest.currentLevel)}
          </Text>
        </View>
      </View>

      {/* 2. Nature-Inspired Vector Forest Landscape (Deterministic SVG Hero) */}
      <Animated.View
        style={[
          styles.canvasCard,
          {
            borderColor: C.line,
            opacity: animValue,
            transform: [
              {
                scale: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.97, 1]
                })
              }
            ]
          }
        ]}
      >
        <Svg width="100%" height={180} viewBox="0 0 380 185">
          <Defs>
            <LinearGradient id="jungleSkyGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={skyGradTop} stopOpacity="1" />
              <Stop offset="100%" stopColor={skyGradBottom} stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="jungleHillGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={midHillColor} stopOpacity="0.85" />
              <Stop offset="100%" stopColor={foreTerrainColor} stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {/* Sky Backdrop */}
          <Rect x="0" y="0" width="380" height="185" fill="url(#jungleSkyGrad)" rx="12" />

          {/* Sun / Moon Orb */}
          <Circle cx="320" cy="38" r="24" fill={sunGlow} opacity={0.3} />
          <Circle cx="320" cy="38" r="15" fill={sunColor} opacity={0.9} />

          {/* Distant Birds */}
          <Path d="M 60 40 Q 64 36 68 40 Q 72 36 76 40" stroke={isDark ? '#4D7865' : '#047857'} strokeWidth="1.2" fill="none" opacity={0.6} />
          <Path d="M 90 32 Q 93 29 96 32 Q 99 29 102 32" stroke={isDark ? '#4D7865' : '#047857'} strokeWidth="1.2" fill="none" opacity={0.5} />

          {/* Depth Layer 1: Distant Mountain Ridges */}
          <Path
            d="M 0 135 Q 70 85 140 125 T 280 102 Q 330 92 380 120 L 380 185 L 0 185 Z"
            fill={mountainColor}
            opacity={0.4}
          />

          {/* Depth Layer 2: Midground Rolling Hill Ridge */}
          <Path
            d="M 0 144 Q 95 118 190 134 T 380 126 L 380 185 L 0 185 Z"
            fill="url(#jungleHillGrad)"
            opacity={0.75}
          />

          {/* Trees on Midground Ridge (Smaller scale, depth perspective) */}
          {forest.visibleTrees
            .filter(t => t.y <= 136)
            .map(tree => renderTree(tree))}

          {/* Depth Layer 3: Lush Foreground Undulating Terrain */}
          <Path
            d="M 0 155 Q 70 144 140 152 T 280 146 Q 330 142 380 150 L 380 185 L 0 185 Z"
            fill={groundBaseColor}
          />

          {/* Subtle Ground Highlight Path */}
          <Path
            d="M 0 156 Q 70 145 140 153 T 280 147 Q 330 143 380 151"
            stroke="#34D399"
            strokeWidth="2"
            fill="none"
            opacity={0.4}
          />

          {/* Trees on Foreground Terrain (Full scale, crisp details) */}
          {forest.visibleTrees
            .filter(t => t.y > 136)
            .map(tree => renderTree(tree))}

          {/* Forest Floor Grass Tufts & Stone Details */}
          <Path d="M 30 170 Q 32 163 34 170 M 34 170 Q 36 161 38 170" stroke="#6EE7B7" strokeWidth="1.3" fill="none" opacity={0.7} />
          <Path d="M 160 172 Q 162 165 164 172 M 164 172 Q 166 163 168 172" stroke="#6EE7B7" strokeWidth="1.3" fill="none" opacity={0.7} />
          <Path d="M 290 168 Q 292 161 294 168 M 294 168 Q 296 159 298 168" stroke="#6EE7B7" strokeWidth="1.3" fill="none" opacity={0.7} />
          <Ellipse cx="115" cy="172" rx="4" ry="2" fill="#044E36" opacity={0.5} />
          <Ellipse cx="240" cy="170" rx="5" ry="2.2" fill="#044E36" opacity={0.5} />
        </Svg>

        {/* Top-Left Prominent Study Time & Jungle Level Badge */}
        <View
          style={[
            styles.canvasHeroStats,
            {
              backgroundColor: isDark ? 'rgba(15,41,30,0.88)' : 'rgba(255,255,255,0.92)',
              borderColor: C.line
            }
          ]}
        >
          <Text style={{ fontSize: 10, fontWeight: '600', color: C.muted }}>
            Total Study Time
          </Text>
          <Text style={{ fontSize: 15, fontWeight: '800', color: C.ink }}>
            {forest.totalFormatted}
          </Text>
          <Text style={{ fontSize: 10, fontWeight: '700', color: C.blue, marginTop: 1 }}>
            Level {forest.currentLevel.level}: {getStageTitle(forest.currentLevel)}
          </Text>
        </View>

        {/* Top-Right Live Tree Counter Watermark Tag */}
        <View style={[styles.canvasTag, { backgroundColor: isDark ? 'rgba(15,41,30,0.88)' : 'rgba(255,255,255,0.92)', borderColor: C.line }]}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: C.blue }}>
            🌲 {forest.totalTreesCount} {forest.totalTreesCount === 1 ? 'Tree' : 'Trees'} Grown
          </Text>
          <Text style={{ fontSize: 9.5, fontWeight: '600', color: forest.hasTodayContribution ? '#059669' : C.muted, marginTop: 1 }}>
            {forest.hasTodayContribution ? `+${forest.todayTreesCount} added today (${forest.todayFormatted})` : '0 added today'}
          </Text>
        </View>
      </Animated.View>

      {/* 3. Daily Contribution Banner */}
      <View
        style={[
          styles.contributionBanner,
          {
            backgroundColor: forest.hasTodayContribution ? C.soft : (isDark ? '#0A2016' : '#FAFDFB'),
            borderColor: C.line
          }
        ]}
      >
        <Text style={{ fontSize: 20 }}>{forest.hasTodayContribution ? '🌱' : '🌿'}</Text>
        <View style={{ flex: 1, paddingLeft: 6 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: C.ink }}>
            {forest.hasTodayContribution
              ? `Today's Effort: +${forest.todayTreesCount} ${forest.todayTreesCount === 1 ? 'tree' : 'trees'} added to your jungle!`
              : "Today's Effort: Ready to add new trees to your permanent jungle?"}
          </Text>
          <Text style={{ fontSize: 11, color: C.muted, marginTop: 1, lineHeight: 15 }}>
            {forest.hasTodayContribution
              ? `${forest.todayFormatted} studied today. All ${forest.pastTreesCount} trees from previous days are permanently preserved.`
              : `Complete and save a study session today to grow new trees on top of your ${forest.pastTreesCount} existing trees.`}
          </Text>
        </View>
      </View>

      {/* 4. Next Level Progression Card */}
      <View style={[styles.milestoneProgressCard, { backgroundColor: isDark ? '#0A2016' : '#FAFDFB', borderColor: C.line }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.blue, textTransform: 'uppercase' }}>
              {forest.nextLevel ? `Next: Level ${forest.nextLevel.level} (${getStageTitle(forest.nextLevel)})` : 'Peak Jungle Sanctuary Achieved'}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: C.ink, marginTop: 2 }}>
              {forest.nextLevel
                ? `${forest.minutesNeededForNext}m more study to level up (${forest.nextLevel.badgeText})`
                : 'Highest mastery achieved! Your permanent living sanctuary is thriving forever.'}
            </Text>
          </View>
          <Text style={{ fontSize: 13, fontWeight: '800', color: C.blue }}>
            {forest.nextLevel ? `${forest.levelProgressPercent}%` : '100%'}
          </Text>
        </View>

        <View style={[styles.progressTrack, { backgroundColor: C.soft, marginTop: 8 }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${forest.nextLevel ? forest.levelProgressPercent : 100}%`,
                backgroundColor: C.blue
              }
            ]}
          />
        </View>
      </View>

      {/* 5. Metrics 4-Col Grid */}
      <View style={[styles.metricsGrid, { borderColor: C.line, backgroundColor: isDark ? '#0A2016' : '#FAFDFB' }]}>
        <View style={styles.metricCell}>
          <Text style={{ fontSize: 10, color: C.muted }}>Total Study</Text>
          <Text style={{ fontSize: 14, fontWeight: '800', color: C.ink, marginTop: 2 }}>
            {forest.totalFormatted}
          </Text>
        </View>
        <View style={[styles.cellDivider, { backgroundColor: C.line }]} />
        <View style={styles.metricCell}>
          <Text style={{ fontSize: 10, color: C.muted }}>Permanent Trees</Text>
          <Text style={{ fontSize: 14, fontWeight: '800', color: C.blue, marginTop: 2 }}>
            {forest.totalTreesCount} Trees
          </Text>
        </View>
        <View style={[styles.cellDivider, { backgroundColor: C.line }]} />
        <View style={styles.metricCell}>
          <Text style={{ fontSize: 10, color: C.muted }}>Today Added</Text>
          <Text style={{ fontSize: 14, fontWeight: '800', color: forest.hasTodayContribution ? '#059669' : C.muted, marginTop: 2 }}>
            +{forest.todayTreesCount} Trees
          </Text>
        </View>
        <View style={[styles.cellDivider, { backgroundColor: C.line }]} />
        <View style={styles.metricCell}>
          <Text style={{ fontSize: 10, color: C.muted }}>Jungle Level</Text>
          <Text style={{ fontSize: 14, fontWeight: '800', color: C.ink, marginTop: 2 }}>
            {forest.currentLevel.emoji} Lvl {forest.currentLevel.level}
          </Text>
        </View>
      </View>

      {/* 6. Visual Growth Levels Badges Carousel */}
      <View style={{ marginTop: 14 }}>
        <Text style={{ fontSize: 12, fontWeight: '700', color: C.ink, marginBottom: 8 }}>
          Jungle Growth Levels ({forest.levels.filter(l => l.isUnlocked).length}/{forest.levels.length} Unlocked)
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
        >
          {forest.levels.map((lvl) => {
            const isUnlocked = lvl.isUnlocked;
            const isCurrent = lvl.isCurrent;

            return (
              <View
                key={lvl.id}
                style={[
                  styles.badgeCard,
                  {
                    backgroundColor: isCurrent ? C.soft : isUnlocked ? (isDark ? '#0A2317' : '#F0FDF4') : (isDark ? '#081711' : '#F8FAFC'),
                    borderColor: isCurrent ? C.blue : isUnlocked ? '#86EFAC' : (isDark ? '#122E22' : '#E2E8F0'),
                    borderWidth: isCurrent ? 2 : 1
                  }
                ]}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 20 }}>{lvl.emoji}</Text>
                  {isUnlocked ? (
                    <View style={{ backgroundColor: '#059669', borderRadius: 10, padding: 2 }}>
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    </View>
                  ) : (
                    <Ionicons name="lock-closed-outline" size={12} color={C.muted} />
                  )}
                </View>

                <Text style={{ fontSize: 11, fontWeight: '700', color: isUnlocked ? C.ink : C.muted, marginTop: 4 }}>
                  {getStageTitle(lvl)}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                  <Text style={{ fontSize: 10, fontWeight: '600', color: isCurrent ? C.blue : C.muted }}>
                    {lvl.badgeText}
                  </Text>
                  {isCurrent && (
                    <View style={{ backgroundColor: C.blue, paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4 }}>
                      <Text style={{ fontSize: 8, fontWeight: '800', color: '#FFFFFF' }}>ACTIVE</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6
      },
      android: {
        elevation: 2
      }
    })
  },
  contributionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 10
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  stageHeading: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 3,
    letterSpacing: -0.2
  },
  stageSubtitle: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16
  },
  canvasCard: {
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    marginTop: 4
  },
  canvasTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1
  },
  canvasHeroStats: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1
  },
  milestoneProgressCard: {
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1
  },
  progressTrack: {
    height: 7,
    borderRadius: 7,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 7
  },
  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
    paddingVertical: 9
  },
  metricCell: {
    alignItems: 'center',
    flex: 1
  },
  cellDivider: {
    width: 1,
    height: 24
  },
  badgeCard: {
    width: 110,
    padding: 8,
    borderRadius: 12
  }
});
