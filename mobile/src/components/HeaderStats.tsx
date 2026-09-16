import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';

export const HeaderStats: React.FC = () => {
  const { user, logout } = useAuth();
  const { stats } = useTask();

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      {/* Top Bar with User Info & Logout Button */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.dateText}>{todayStr.toUpperCase()}</Text>
          <Text style={styles.userNameText}>
            Hello, <Text style={styles.highlightName}>{user?.name || 'User'}</Text> 👋
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Card */}
      <View style={styles.card}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.cardTitle}>Daily Productivity</Text>
            <Text style={styles.cardSubtitle}>
              {stats.completed} of {stats.total} tasks completed
            </Text>
          </View>
          <View style={styles.percentBadge}>
            <Text style={styles.percentText}>{completionRate}%</Text>
          </View>
        </View>

        {/* Dynamic Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${completionRate}%` }]} />
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: COLORS.cyanNeon }]}>{stats.active}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: COLORS.success }]}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text
              style={[
                styles.statValue,
                { color: stats.overdue > 0 ? COLORS.danger : COLORS.textMuted },
              ]}
            >
              {stats.overdue}
            </Text>
            <Text style={styles.statLabel}>Overdue</Text>
          </View>
        </View>

        {/* Smart Urgency Alert Banner */}
        {stats.urgentActiveCount > 0 && (
          <View style={styles.alertBanner}>
            <Text style={styles.alertEmoji}>⚡</Text>
            <Text style={styles.alertText}>
              <Text style={{ fontWeight: '700' }}>{stats.urgentActiveCount} high-priority tasks</Text>{' '}
              require immediate focus!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.cyanNeon,
    letterSpacing: 1,
    fontWeight: '700',
  },
  userNameText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  highlightName: {
    color: COLORS.primary,
  },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.danger,
    fontWeight: '700',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  percentBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  percentText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.cyanNeon,
    fontSize: 14,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 4,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    fontSize: 20,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.surfaceBorder,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  alertEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  alertText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.high,
    flex: 1,
    fontSize: 12,
  },
});
