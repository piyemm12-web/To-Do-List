import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Task } from '../types/task';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { PriorityBadge } from './PriorityBadge';
import { CategoryChip } from './CategoryChip';
import { formatDeadlineLabel } from '../utils/dateFormatter';
import { useTask } from '../context/TaskContext';

interface TaskCardProps {
  task: Task;
  onEditPress?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEditPress }) => {
  const { toggleTask, removeTask } = useTask();
  const deadlineInfo = formatDeadlineLabel(task.deadline);

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeTask(task._id) },
      ]
    );
  };

  return (
    <View
      style={[
        styles.card,
        task.completed && styles.completedCard,
        deadlineInfo.isOverdue && !task.completed && styles.overdueCard,
      ]}
    >
      {/* Top Header: Category, Priority & Smart Urgency Score */}
      <View style={styles.headerRow}>
        <View style={styles.badgeGroup}>
          <CategoryChip category={task.category} />
          <PriorityBadge priority={task.priority} />
        </View>

        {task.smartScore !== undefined && !task.completed && (
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>🔥 {task.smartScore}</Text>
          </View>
        )}
      </View>

      {/* Main Row: Custom Checkbox + Task Title & Description */}
      <View style={styles.bodyRow}>
        <TouchableOpacity
          style={[styles.checkbox, task.completed && styles.checkboxChecked]}
          onPress={() => toggleTask(task._id)}
          activeOpacity={0.7}
        >
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.textContainer}
          onPress={() => onEditPress && onEditPress(task)}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.title, task.completed && styles.completedTitle]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {!!task.description && (
            <Text
              style={[styles.description, task.completed && styles.completedDesc]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer Row: Deadline Countdown & Action Buttons */}
      <View style={styles.footerRow}>
        <View style={styles.deadlineContainer}>
          <Text style={styles.clockIcon}>🕒</Text>
          <Text
            style={[
              styles.deadlineText,
              deadlineInfo.isOverdue && !task.completed && styles.overdueText,
              task.completed && styles.completedDeadlineText,
            ]}
          >
            {task.completed
              ? `Done on ${new Date(task.completedAt || task.updatedAt).toLocaleDateString()}`
              : `${deadlineInfo.urgencyText} (${deadlineInfo.label})`}
          </Text>
        </View>

        <View style={styles.actionsGroup}>
          {onEditPress && !task.completed && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => onEditPress(task)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>✏️</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.actionBtn} onPress={handleDelete} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  completedCard: {
    backgroundColor: 'rgba(22, 25, 38, 0.6)',
    borderColor: 'rgba(46, 53, 79, 0.4)',
    opacity: 0.75,
  },
  overdueCard: {
    borderColor: 'rgba(239, 68, 68, 0.5)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  scoreText: {
    ...TYPOGRAPHY.badge,
    color: COLORS.high,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    fontSize: 16,
    lineHeight: 22,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  description: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  completedDesc: {
    color: COLORS.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(46, 53, 79, 0.5)',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  clockIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  deadlineText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  overdueText: {
    color: COLORS.danger,
    fontWeight: '700',
  },
  completedDeadlineText: {
    color: COLORS.textMuted,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 6,
    marginLeft: 6,
  },
  actionIcon: {
    fontSize: 14,
  },
});
