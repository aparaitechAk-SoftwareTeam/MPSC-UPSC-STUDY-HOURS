import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native';
import Svg, { Circle, Path, G, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import BotanicalTree from './BotanicalTree';
import JungleForestView from './JungleForestView';
import { calculateTodayStudyStats, calculateForestGrowth, calculateRangeStudyStats, DAILY_GOAL_SECONDS, DAILY_GOAL_MINUTES } from './studyStats';
import { getTranslation, getSubjectName } from './translations';

/**
 * AnalyticsScreen: Tree-Based Study Analytics for MPSC & UPSC Aspirants.
 *
 * Visual Language:
 * - Study Progress Tree derived from verified accumulated study records.
 * - Daily, Weekly and Monthly botanical activity representations.
 * - Subject-wise botanical grove breakdown.
 * - Milestone achievements tied strictly to genuine user data.
 */
export default function AnalyticsScreen({
  analytics = {},
  sessions = [],
  subjects = [],
  theme,
  isDarkMode = false,
  lang = 'en',
  analyticsRange = '7',
  setAnalyticsRange
}) {
  const [analyticsTab, setAnalyticsTab] = useState('Overview');
  const [internalRange, setInternalRange] = useState('7');

  const range = analyticsRange || internalRange;
  const setRange = setAnalyticsRange || setInternalRange;

  const t = (key, fallback) => getTranslation(lang, key, fallback);

  // Emerald theme colors
  const C = theme || {
    bg: isDarkMode ? '#051811' : '#F4FBF7',
    white: isDarkMode ? '#0F291E' : '#FFFFFF',
    card: isDarkMode ? '#0F291E' : '#FFFFFF',
    ink: isDarkMode ? '#F2FDF7' : '#0B291B',
    muted: isDarkMode ? '#75A991' : '#4D7865',
    blue: isDarkMode ? '#10B981' : '#059669',
    soft: isDarkMode ? '#143829' : '#ECFDF5',
    line: isDarkMode ? '#17382A' : '#D1FAE5',
    gold: '#F59E0B',
    goldSoft: isDarkMode ? '#3B290A' : '#FEF3C7',
  };

  const txt = (size = 14, bold = false, color = C.ink) => ({
    fontSize: size,
    fontWeight: bold ? '700' : '400',
    color
  });

  const allDaily = Array.isArray(analytics.daily) ? analytics.daily : [];
  const rangeDaysCount = range === '30' ? 30 : 7;
  const rangeStats = useMemo(() => {
    return calculateRangeStudyStats(sessions, rangeDaysCount);
  }, [sessions, rangeDaysCount]);

  const chartDays = rangeStats.chartDays;
  const rangeSessions = rangeStats.rangeSessions;
  const rangeMinutes = rangeStats.rangeMinutes;
  const maxMinutes = rangeStats.maxMinutes;
  const rangeFocus = rangeStats.averageFocus;
  const averageSession = rangeStats.averageSessionMinutes;
  const activeDays = rangeStats.activeDays;

  // Synchronized 8-Hour Daily Study Goal (28,800 seconds)
  const todayStats = useMemo(() => {
    return calculateTodayStudyStats(sessions, DAILY_GOAL_SECONDS);
  }, [sessions]);

  // Lifetime Cumulative Jungle Forest
  const forestStats = useMemo(() => {
    return calculateForestGrowth(sessions);
  }, [sessions]);

  const todayMinutes = todayStats.todayStudyMinutes;
  const dailyGoalMinutes = DAILY_GOAL_MINUTES; // 480 minutes (8 hours)
  const goalProgress = todayStats.progressPercent;

  const sessionDays = useMemo(() => {
    return new Set(
      (sessions || [])
        .filter(s => (Number(s.minutes) || 0) > 0 && s.startedAt)
        .map(s => (s.startedAt || '').slice(0, 10))
        .filter(Boolean)
    );
  }, [sessions]);

  const currentStreak = useMemo(() => {
    if (analytics.currentStreak && Number.isFinite(analytics.currentStreak)) {
      return analytics.currentStreak;
    }
    let count = 0;
    const checkDate = new Date();
    const todayStr = [
      checkDate.getFullYear(),
      String(checkDate.getMonth() + 1).padStart(2, '0'),
      String(checkDate.getDate()).padStart(2, '0')
    ].join('-');
    if (!sessionDays.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    while (true) {
      const dStr = checkDate.toISOString().slice(0, 10);
      if (sessionDays.has(dStr)) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  }, [analytics.currentStreak, sessionDays]);

  /**
   * =========================================================================
   * DOCUMENTED STUDY PROGRESS TREE CALCULATION
   * -------------------------------------------------------------------------
   * A deterministic composite score (0.0 to 1.0) derived from 3 genuine metrics:
   * 1. Volume Score (40%): Minutes studied vs target (840m for 7d, 3600m for 30d).
   * 2. Session Count (30%): Sessions completed vs target (14 for 7d, 45 for 30d).
   * 3. Consistency (30%): Ratio of active study days to total days in period.
   * =========================================================================
   */
  const { compositeProgress, treeStageInfo } = useMemo(() => {
    const targetMinutes = range === '7' ? 840 : 3600;
    const targetSessions = range === '7' ? 14 : 45;
    const totalDays = Math.max(1, chartDays.length);

    const volumeScore = Math.min(1.0, rangeMinutes / targetMinutes);
    const sessionScore = Math.min(1.0, rangeSessions.length / targetSessions);
    const consistencyScore = Math.min(1.0, activeDays / totalDays);

    let progress = 0;
    if (rangeMinutes > 0) {
      progress = Math.max(
        0.02, // Show small sprout if user has at least 1 session
        (0.40 * volumeScore) + (0.30 * sessionScore) + (0.30 * consistencyScore)
      );
    }
    progress = Math.min(1.0, progress);

    // 7 Botanical Stages
    let stageNum = 1;
    let stageTitle = 'Seed in Soil';
    let stageDesc = 'Plant your study seed by recording a focus session.';
    let emoji = '🌱';

    if (progress <= 0.01) {
      stageNum = 1;
      stageTitle = t('stageSeed', 'Seed in Fertile Soil');
      stageDesc = t('stageSeedDesc', 'Begin studying to nurture your first sprout.');
      emoji = '🌱';
    } else if (progress <= 0.20) {
      stageNum = 2;
      stageTitle = t('stageSprout', 'Emerging Seedling');
      stageDesc = t('stageSproutDesc', 'Tender roots are taking hold with your first sessions.');
      emoji = '🌿';
    } else if (progress <= 0.40) {
      stageNum = 3;
      stageTitle = t('stageYoung', 'Young Green Sprout');
      stageDesc = t('stageYoungDesc', 'Consistent study is producing sturdy green leaves.');
      emoji = '🪴';
    } else if (progress <= 0.60) {
      stageNum = 4;
      stageTitle = t('stageSapling', 'Branching Sapling');
      stageDesc = t('stageSaplingDesc', 'Solid preparation is building a strong wooden stem.');
      emoji = '🌲';
    } else if (progress <= 0.80) {
      stageNum = 5;
      stageTitle = t('stageThriving', 'Thriving Forest Tree');
      stageDesc = t('stageThrivingDesc', 'A lush green canopy of knowledge is forming.');
      emoji = '🌳';
    } else if (progress < 1.0) {
      stageNum = 6;
      stageTitle = t('stageMature', 'Majestic Mature Tree');
      stageDesc = t('stageMatureDesc', 'Strong disciplined habits are bearing rich academic fruits.');
      emoji = '🌲';
    } else {
      stageNum = 7;
      stageTitle = t('stageHarvest', 'Flourishing Master Tree');
      stageDesc = t('stageHarvestDesc', 'Peak focus achieved! Your knowledge tree is in full bloom.');
      emoji = '🏆';
    }

    return {
      compositeProgress: progress,
      treeStageInfo: {
        stageNum,
        stageTitle,
        stageDesc,
        emoji,
        percentage: Math.round(progress * 100)
      }
    };
  }, [range, rangeMinutes, rangeSessions.length, activeDays, chartDays.length, t]);

  // Subject Totals
  const subjectTotals = useMemo(() => {
    return rangeSessions.reduce((result, session) => {
      const subject = subjects.find(item => item.id === session.subjectId);
      const key = session.subjectId || 'unassigned';

      if (!result[key]) {
        result[key] = {
          id: key,
          name: subject?.name || 'Unassigned',
          exam: subject?.exam || '',
          minutes: 0,
          count: 0
        };
      }
      result[key].minutes += Number(session.minutes) || 0;
      result[key].count += 1;
      return result;
    }, {});
  }, [rangeSessions, subjects]);

  const subjectRows = useMemo(() => {
    return Object.values(subjectTotals).sort((a, b) => b.minutes - a.minutes);
  }, [subjectTotals]);

  const recentSessions = useMemo(() => {
    return rangeSessions
      .slice()
      .sort((a, b) => (b.startedAt || '').localeCompare(a.startedAt || ''))
      .slice(0, 8);
  }, [rangeSessions]);

  const formatMinutes = value => {
    const minutes = Math.max(0, Number(value) || 0);
    const hours = Math.floor(minutes / 60);
    const remainder = Math.round(minutes % 60);
    const hShort = t('hoursShort', 'h');
    const mShort = t('minsShort', 'm');

    return hours ? `${hours}${hShort} ${remainder}${mShort}` : `${remainder}${mShort}`;
  };

  return (
    <View style={{ width: '100%' }}>
      {/* Header and Period Filter */}
      <View style={{ marginBottom: 14 }}>
        <Text style={txt(24, true, C.ink)}>{t('studyAnalytics', 'Study Analytics')}</Text>
        <Text style={[txt(12, false, C.muted), { marginTop: 3 }]}>
          {t('analyticsSubtitleMain', 'Understand your habits, track progress and grow your study tree')}
        </Text>
      </View>

      {/* Top Range Selector & Tab Navigator */}
      <View style={styles.filterRow}>
        {/* 7 Days vs 30 Days Filter */}
        <View style={styles.rangeSelector}>
          {[
            { key: '7', label: t('sevenDays', '7 Days') },
            { key: '30', label: t('thirtyDays', '30 Days') }
          ].map(item => (
            <TouchableOpacity
              key={item.key}
              onPress={() => setRange(item.key)}
              style={[
                styles.rangeButton,
                {
                  backgroundColor: range === item.key ? C.blue : C.soft,
                  borderColor: range === item.key ? C.blue : C.line
                }
              ]}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: range === item.key ? '#FFFFFF' : C.blue
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Analytics Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, paddingVertical: 2 }}
        >
          {[
            { key: 'Overview', label: t('overview', 'Overview') },
            { key: 'Activity', label: t('activity', 'Activity') },
            { key: 'Subjects', label: t('subjects', 'Subjects') },
            { key: 'Sessions', label: t('sessionsTab', 'Sessions') }
          ].map(tabItem => (
            <TouchableOpacity
              key={tabItem.key}
              onPress={() => setAnalyticsTab(tabItem.key)}
              style={[
                styles.tabChip,
                {
                  backgroundColor: analyticsTab === tabItem.key ? C.blue : C.white,
                  borderColor: analyticsTab === tabItem.key ? C.blue : C.line
                }
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: analyticsTab === tabItem.key ? '700' : '500',
                  color: analyticsTab === tabItem.key ? '#FFFFFF' : C.ink
                }}
              >
                {tabItem.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* =================================================================== */}
      {/* TAB 1: OVERVIEW — STUDY PROGRESS TREE HERO                          */}
      {/* =================================================================== */}
      {analyticsTab === 'Overview' && (
        <View style={{ gap: 12 }}>
          {/* 1. Dynamic Growing Jungle / Forest Visualization */}
          <JungleForestView
            sessions={sessions}
            isDark={isDarkMode}
            theme={C}
            lang={lang}
            t={t}
          />

          {/* 2. Synchronized Today's 8-Hour Study Goal Card */}
          <View style={[styles.card, { backgroundColor: C.white, borderColor: C.line }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={txt(16, true, C.ink)}>{t('todaysStudyGoal', "Today's Study Goal")}</Text>
                <Text style={[txt(11, false, C.muted), { marginTop: 3 }]}>
                  {todayStats.isGoalMet
                    ? '🎉 ' + t('dailyGoalReached', 'Daily study goal accomplished!')
                    : `${todayStats.remainingFormatted} ${t('remainingOf', 'remaining of')} ${todayStats.goalFormatted}`}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={txt(20, true, C.blue)}>{todayStats.completedFormatted}</Text>
                <Text style={txt(10, false, C.muted)}>{todayStats.progressFormatted} {t('complete', 'complete')}</Text>
              </View>
            </View>

            {/* Progress bar with percentage indicator */}
            <View style={[styles.progressTrack, { backgroundColor: C.soft, marginTop: 10 }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${todayStats.progressPercent}%`,
                    backgroundColor: todayStats.isGoalMet ? '#059669' : C.blue
                  }
                ]}
              />
            </View>

            {/* Metrics Triad: Completed, Goal, Remaining */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderColor: C.line }}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={txt(10, false, C.muted)}>{t('loggedToday', 'Logged Today')}</Text>
                <Text style={[txt(13, true, C.ink), { marginTop: 2 }]}>{todayStats.completedFormatted}</Text>
              </View>
              <View style={{ width: 1, height: 20, backgroundColor: C.line }} />
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={txt(10, false, C.muted)}>{t('dailyGoal', 'Daily Goal')}</Text>
                <Text style={[txt(13, true, C.ink), { marginTop: 2 }]}>{todayStats.goalFormatted}</Text>
              </View>
              <View style={{ width: 1, height: 20, backgroundColor: C.line }} />
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={txt(10, false, C.muted)}>{t('remaining', 'Remaining')}</Text>
                <Text style={[txt(13, true, todayStats.isGoalMet ? C.blue : C.ink), { marginTop: 2 }]}>
                  {todayStats.remainingFormatted}
                </Text>
              </View>
            </View>
          </View>

          {/* Real Application Study Statistics Cards */}
          <View style={styles.gridRow}>
            {[
              {
                icon: 'time-outline',
                label: t('totalStudyTimeLifetime', 'Total Study Time'),
                value: forestStats.totalFormatted,
                detail: t('lifetimeRecorded', 'Lifetime verified')
              },
              {
                icon: 'leaf-outline',
                label: t('treesGrown', 'Trees Grown'),
                value: `${forestStats.totalTreesCount} ${t('treesGrown', 'Trees Grown')}`,
                detail: t('livingSanctuary', 'In permanent jungle')
              },
              {
                icon: 'trophy-outline',
                label: t('jungleGrowthLevel', 'Jungle Level'),
                value: `Level ${forestStats.currentStage.stageNumber}`,
                detail: `${forestStats.currentStage.emoji} ${forestStats.currentStage.titleEn}`
              },
              {
                icon: 'flame-outline',
                label: t('dailyStudyStreak', 'Daily Streak'),
                value: `${currentStreak} ${currentStreak === 1 ? t('day', 'Day') : t('days', 'Days')}`,
                detail: t('consecutiveDays', 'Active discipline')
              },
              {
                icon: 'stats-chart-outline',
                label: t('studyConsistency', 'Consistency'),
                value: `${rangeStats.consistencyPercent}%`,
                detail: `${activeDays}/${chartDays.length} ${t('daysActive', 'days active')}`
              },
              {
                icon: 'shield-checkmark-outline',
                label: t('averageFocus', 'Average Focus'),
                value: `${rangeFocus}%`,
                detail: `${rangeSessions.length} ${t('sessionsLogged', 'sessions logged')}`
              }
            ].map(item => (
              <View
                key={item.label}
                style={[
                  styles.gridCard,
                  { backgroundColor: C.white, borderColor: C.line }
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Ionicons name={item.icon} size={15} color={C.blue} />
                  <Text style={txt(11, true, C.muted)} numberOfLines={1}>{item.label}</Text>
                </View>
                <Text style={txt(18, true, C.ink)}>{item.value}</Text>
                <Text style={[txt(10, false, C.muted), { marginTop: 2 }]} numberOfLines={1}>{item.detail}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* =================================================================== */}
      {/* TAB 2: ACTIVITY — DAILY, WEEKLY & MONTHLY BOTANICAL CHARTS          */}
      {/* =================================================================== */}
      {analyticsTab === 'Activity' && (
        <View style={{ gap: 12 }}>
          {/* Daily Study Activity Bar Chart */}
          <View style={[styles.card, { backgroundColor: C.white, borderColor: C.line }]}>
            <Text style={txt(16, true, C.ink)}>{t('dailyStudyActivity', 'Daily Study Activity')}</Text>
            <Text style={[txt(11, false, C.muted), { marginTop: 2, marginBottom: 16 }]}>
              {range === '7'
                ? t('minutesStudiedWeek', 'Minutes studied each day this week')
                : t('minutesStudiedMonth', 'Minutes studied across the selected 30-day period')}
            </Text>

            {chartDays.length === 0 ? (
              <Text style={txt(12, false, C.muted)}>
                {t('noDailyAnalytics', 'No daily study records available yet. Complete a study session to begin.')}
              </Text>
            ) : (
              <View style={styles.chartContainer}>
                {chartDays.map((day, index) => {
                  const minutes = Number(day.minutes) || 0;
                  const barHeight = minutes > 0 ? Math.max(8, (minutes / maxMinutes) * 110) : 4;
                  const date = new Date(`${day.date}T12:00:00`);
                  const label =
                    range === '7'
                      ? date.toLocaleDateString(undefined, { weekday: 'narrow' })
                      : date.getDate() % 5 === 0 || index === 0
                        ? String(date.getDate())
                        : '';

                  // Dynamic Botanical Color based on daily study depth
                  const barColor =
                    minutes === 0
                      ? (isDarkMode ? '#17382A' : '#D1FAE5')
                      : minutes < 60
                        ? '#34D399' // Light Sprout
                        : minutes < 120
                          ? '#10B981' // Solid Sapling
                          : '#059669'; // Mature Forest Tree

                  return (
                    <View key={day.date} style={styles.chartBarCol}>
                      {minutes > 0 && range === '7' && (
                        <Text style={[styles.barMinutesText, { color: C.muted }]}>
                          {minutes}
                        </Text>
                      )}
                      <View
                        style={[
                          styles.chartBar,
                          {
                            height: barHeight,
                            backgroundColor: barColor,
                            width: range === '7' ? 18 : 6
                          }
                        ]}
                      />
                      <Text style={[styles.barLabelText, { color: C.muted }]}>
                        {label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Active Days Summary */}
            <View style={[styles.summaryFooter, { borderTopColor: C.line }]}>
              <View>
                <Text style={txt(10, false, C.muted)}>{t('totalStudyTime', 'Total Study Time')}</Text>
                <Text style={txt(15, true, C.ink)}>{formatMinutes(rangeMinutes)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={txt(10, false, C.muted)}>{t('activeDays', 'Active Study Days')}</Text>
                <Text style={txt(15, true, C.ink)}>
                  {activeDays} / {chartDays.length} {t('days', 'days')}
                </Text>
              </View>
            </View>
          </View>

          {/* Botanical Consistency Forest Heatmap */}
          <View style={[styles.card, { backgroundColor: C.white, borderColor: C.line }]}>
            <Text style={txt(16, true, C.ink)}>{t('studyConsistency', 'Study Consistency & Habit Forest')}</Text>
            <Text style={[txt(11, false, C.muted), { marginTop: 2, marginBottom: 14 }]}>
              {t('heatmapDesc', 'Each plant represents a daily study session. Greener and fuller plants indicate longer study sessions.')}
            </Text>

            <View style={styles.heatmapGrid}>
              {chartDays.map(day => {
                const minutes = Number(day.minutes) || 0;
                let bg = isDarkMode ? '#132B20' : '#ECFDF5';
                let iconName = 'ellipse';
                let iconColor = isDarkMode ? '#1E4030' : '#D1FAE5';
                let iconSize = 6;

                if (minutes > 0 && minutes < 45) {
                  bg = isDarkMode ? '#163E2D' : '#D1FAE5';
                  iconName = 'leaf-outline';
                  iconColor = '#10B981';
                  iconSize = 12;
                } else if (minutes >= 45 && minutes < 90) {
                  bg = isDarkMode ? '#124D35' : '#A7F3D0';
                  iconName = 'leaf';
                  iconColor = '#059669';
                  iconSize = 14;
                } else if (minutes >= 90 && minutes < 150) {
                  bg = isDarkMode ? '#065F46' : '#6EE7B7';
                  iconName = 'flower';
                  iconColor = '#047857';
                  iconSize = 14;
                } else if (minutes >= 150) {
                  bg = isDarkMode ? '#047857' : '#34D399';
                  iconName = 'trophy';
                  iconColor = '#F59E0B';
                  iconSize = 15;
                }

                return (
                  <View
                    key={day.date}
                    style={[
                      styles.heatCell,
                      {
                        backgroundColor: bg,
                        borderColor: C.line,
                        width: range === '7' ? '12%' : '8.6%'
                      }
                    ]}
                  >
                    <Ionicons name={iconName} size={iconSize} color={iconColor} />
                    <Text style={{ fontSize: 9, color: minutes > 0 ? C.ink : C.muted, marginTop: 1, fontWeight: minutes > 0 ? '700' : '400' }}>
                      {new Date(`${day.date}T12:00:00`).getDate()}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Heatmap Legend */}
            <View style={[styles.legendRow, { borderTopColor: C.line }]}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: isDarkMode ? '#132B20' : '#ECFDF5' }]} />
                <Text style={txt(9, false, C.muted)}>0m</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: isDarkMode ? '#163E2D' : '#D1FAE5' }]} />
                <Text style={txt(9, false, C.muted)}>&lt;45m</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: isDarkMode ? '#124D35' : '#A7F3D0' }]} />
                <Text style={txt(9, false, C.muted)}>45-90m</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: isDarkMode ? '#065F46' : '#6EE7B7' }]} />
                <Text style={txt(9, false, C.muted)}>90-150m</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: isDarkMode ? '#047857' : '#34D399' }]} />
                <Text style={txt(9, false, C.muted)}>&gt;150m</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* =================================================================== */}
      {/* TAB 3: SUBJECTS — BOTANICAL GROVE & TIME BREAKDOWN                  */}
      {/* =================================================================== */}
      {analyticsTab === 'Subjects' && (
        <View style={{ gap: 12 }}>
          <View style={[styles.card, { backgroundColor: C.white, borderColor: C.line }]}>
            <Text style={txt(16, true, C.ink)}>{t('subjectBreakdown', 'Subject-Wise Study Grove')}</Text>
            <Text style={[txt(11, false, C.muted), { marginTop: 2, marginBottom: 16 }]}>
              {t('subjectBreakdownDesc', 'Review your preparation hours, session counts, and syllabus coverage across subjects.')}
            </Text>

            {subjectRows.length === 0 || rangeMinutes === 0 ? (
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <Ionicons name="leaf-outline" size={36} color={C.muted} />
                <Text style={[txt(12, false, C.muted), { marginTop: 8 }]}>
                  {t('noSubjectStudyTime', 'No subject study time recorded for this period.')}
                </Text>
              </View>
            ) : (
              <>
                {/* Donut Chart with Emerald Palette */}
                <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                  {(() => {
                    const emeraldPalette = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#047857', '#065F46', '#F59E0B', '#10B981'];
                    const radius = 62;
                    const strokeWidth = 22;
                    const circumference = 2 * Math.PI * radius;
                    let offset = 0;

                    return (
                      <View style={{ width: 170, height: 170, alignItems: 'center', justifyContent: 'center' }}>
                        <Svg width={170} height={170} viewBox="0 0 170 170">
                          <Circle
                            cx="85"
                            cy="85"
                            r={radius}
                            fill="none"
                            stroke={C.soft}
                            strokeWidth={strokeWidth}
                          />
                          {subjectRows.map((subject, idx) => {
                            const fraction = subject.minutes / rangeMinutes;
                            const segmentLength = fraction * circumference;
                            const currentOffset = offset;
                            offset += segmentLength;

                            return (
                              <Circle
                                key={subject.id || subject.name}
                                cx="85"
                                cy="85"
                                r={radius}
                                fill="none"
                                stroke={emeraldPalette[idx % emeraldPalette.length]}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                                strokeDashoffset={-currentOffset}
                                rotation={-90}
                                origin="85, 85"
                              />
                            );
                          })}
                        </Svg>
                        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={txt(10, false, C.muted)}>{t('totalStudied', 'Total')}</Text>
                          <Text style={txt(16, true, C.ink)}>{formatMinutes(rangeMinutes)}</Text>
                          <Text style={txt(9, false, C.muted)}>{subjectRows.length} {t('subjects', 'subjects')}</Text>
                        </View>
                      </View>
                    );
                  })()}
                </View>

                {/* Subject List with Botanical Indicators */}
                <View style={{ marginTop: 14 }}>
                  {subjectRows.map((subject, index) => {
                    const emeraldPalette = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#047857', '#065F46', '#F59E0B', '#10B981'];
                    const color = emeraldPalette[index % emeraldPalette.length];
                    const percent = Math.round((subject.minutes / rangeMinutes) * 100);

                    return (
                      <View
                        key={subject.id || subject.name}
                        style={[
                          styles.subjectRow,
                          { borderBottomColor: C.line, borderBottomWidth: index === subjectRows.length - 1 ? 0 : 1 }
                        ]}
                      >
                        <View style={[styles.subjectLeafIcon, { backgroundColor: C.soft }]}>
                          <Ionicons name="leaf" size={14} color={color} />
                        </View>

                        <View style={{ flex: 1, paddingRight: 8 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={txt(13, true, C.ink)} numberOfLines={1}>
                              {getSubjectName(subject, lang)}
                            </Text>
                            {Boolean(subject.exam) && (
                              <View style={[styles.examBadge, { backgroundColor: C.soft, borderColor: C.line }]}>
                                <Text style={{ fontSize: 9, fontWeight: '700', color: C.blue }}>
                                  {subject.exam}
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text style={[txt(10, false, C.muted), { marginTop: 2 }]}>
                            {subject.count} {subject.count === 1 ? t('session', 'session') : t('sessions', 'sessions')} • {percent}% of study time
                          </Text>
                          {/* Subject Botanical Bar */}
                          <View style={[styles.subjectMiniBarTrack, { backgroundColor: C.soft }]}>
                            <View style={[styles.subjectMiniBarFill, { width: `${percent}%`, backgroundColor: color }]} />
                          </View>
                        </View>

                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={txt(13, true, C.ink)}>{formatMinutes(subject.minutes)}</Text>
                          <Text style={txt(10, true, C.blue)}>{percent}%</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </View>
        </View>
      )}

      {/* =================================================================== */}
      {/* TAB 4: SESSIONS — CHRONOLOGICAL STUDY HISTORY                       */}
      {/* =================================================================== */}
      {analyticsTab === 'Sessions' && (
        <View style={[styles.card, { backgroundColor: C.white, borderColor: C.line }]}>
          <Text style={txt(16, true, C.ink)}>{t('recentSessions', 'Recent Study Sessions')}</Text>
          <Text style={[txt(11, false, C.muted), { marginTop: 2, marginBottom: 14 }]}>
            {t('recentSessionsDesc', 'Verified record of your focused study sessions, completed durations, and focus scores.')}
          </Text>

          {recentSessions.length === 0 ? (
            <View style={{ paddingVertical: 24, alignItems: 'center' }}>
              <Ionicons name="hourglass-outline" size={36} color={C.muted} />
              <Text style={[txt(12, false, C.muted), { marginTop: 8 }]}>
                {t('noSessionsRecorded', 'No sessions recorded during this period.')}
              </Text>
            </View>
          ) : (
            recentSessions.map((session, index) => {
              const subjectObj = subjects.find(s => s.id === session.subjectId);
              const subjectName = subjectObj ? getSubjectName(subjectObj, lang) : t('studySession', 'Study Session');

              return (
                <View
                  key={session.id || `${session.startedAt}-${index}`}
                  style={[
                    styles.sessionItem,
                    { borderBottomColor: C.line, borderBottomWidth: index === recentSessions.length - 1 ? 0 : 1 }
                  ]}
                >
                  <View style={[styles.sessionIndexBox, { backgroundColor: C.soft, borderColor: C.line }]}>
                    <Text style={txt(11, true, C.blue)}>
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                  </View>

                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={txt(13, true, C.ink)} numberOfLines={1}>{subjectName}</Text>
                    <Text style={[txt(10, false, C.muted), { marginTop: 2 }]}>
                      {session.startedAt ? new Date(session.startedAt).toLocaleDateString() : t('dateUnavailable', 'Date unavailable')}
                      {Boolean(session.mode) && ` • ${session.mode}`}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={txt(13, true, C.ink)}>{formatMinutes(session.minutes)}</Text>
                    <View style={[styles.focusPill, { backgroundColor: C.soft }]}>
                      <Text style={{ fontSize: 9, fontWeight: '700', color: C.blue }}>
                        {Number(session.focusScore) || 100}% {t('focus', 'focus')}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    marginBottom: 12,
    gap: 8,
  },
  rangeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  rangeButton: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  treeHeroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  progressTrack: {
    height: 7,
    borderRadius: 6,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    marginTop: 12,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricDivider: {
    width: 1,
    height: 24,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  gridCard: {
    width: '48.5%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 145,
    paddingTop: 14,
    paddingBottom: 4,
  },
  chartBarCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  barMinutesText: {
    fontSize: 9,
    marginBottom: 3,
  },
  chartBar: {
    borderRadius: 4,
  },
  barLabelText: {
    fontSize: 9,
    marginTop: 6,
  },
  summaryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 12,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  heatCell: {
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  subjectLeafIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  examBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
  },
  subjectMiniBarTrack: {
    height: 4,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 5,
    width: '100%',
  },
  subjectMiniBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
  },
  sessionIndexBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  focusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
});
