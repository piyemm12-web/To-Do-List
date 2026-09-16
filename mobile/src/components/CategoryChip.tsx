import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskCategory } from '../types/task';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';

interface CategoryChipProps {
  category: TaskCategory;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ category }) => {
  const getCategoryDetails = () => {
    switch (category) {
      case 'WORK':
        return { label: 'Work', color: COLORS.workCategory, emoji: '💼' };
      case 'PERSONAL':
        return { label: 'Personal', color: COLORS.personalCategory, emoji: '🏠' };
      case 'HEALTH':
        return { label: 'Health', color: COLORS.healthCategory, emoji: '🏃' };
      case 'STUDY':
        return { label: 'Study', color: COLORS.studyCategory, emoji: '📚' };
      case 'GENERAL':
      default:
        return { label: 'General', color: COLORS.generalCategory, emoji: '🎯' };
    }
  };

  const { label, color, emoji } = getCategoryDetails();

  return (
    <View style={[styles.chip, { borderColor: `${color}40`, backgroundColor: `${color}15` }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.chipText, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 6,
  },
  emoji: {
    fontSize: 11,
    marginRight: 4,
  },
  chipText: {
    ...TYPOGRAPHY.badge,
  },
});
