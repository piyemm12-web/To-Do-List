import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskPriority } from '../types/task';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getColors = () => {
    switch (priority) {
      case 'URGENT':
        return { bg: COLORS.urgentBg, text: COLORS.urgent, icon: '🔥' };
      case 'HIGH':
        return { bg: COLORS.highBg, text: COLORS.high, icon: '⚡' };
      case 'MEDIUM':
        return { bg: COLORS.mediumBg, text: COLORS.medium, icon: '📌' };
      case 'LOW':
      default:
        return { bg: COLORS.lowBg, text: COLORS.low, icon: '🌱' };
    }
  };

  const { bg, text, icon } = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.iconText}>{icon}</Text>
      <Text style={[styles.badgeText, { color: text }]}>{priority}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  iconText: {
    fontSize: 10,
    marginRight: 4,
  },
  badgeText: {
    ...TYPOGRAPHY.badge,
  },
});
