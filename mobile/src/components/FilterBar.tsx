import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { useTask } from '../context/TaskContext';
import { TaskStatusFilter, TaskPriority, TaskCategory, TaskSortOption } from '../types/task';

export const FilterBar: React.FC = () => {
  const {
    filters,
    setFilterStatus,
    setFilterPriority,
    setFilterCategory,
    setSearchQuery,
    setSortOption,
  } = useTask();

  const statusOptions: { label: string; value: TaskStatusFilter }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Completed', value: 'COMPLETED' },
  ];

  const priorityOptions: { label: string; value: TaskPriority | 'ALL' }[] = [
    { label: 'All Priorities', value: 'ALL' },
    { label: '🔥 Urgent', value: 'URGENT' },
    { label: '⚡ High', value: 'HIGH' },
    { label: '📌 Medium', value: 'MEDIUM' },
    { label: '🌱 Low', value: 'LOW' },
  ];

  const categoryOptions: { label: string; value: TaskCategory | 'ALL' }[] = [
    { label: 'All Categories', value: 'ALL' },
    { label: '💼 Work', value: 'WORK' },
    { label: '🏠 Personal', value: 'PERSONAL' },
    { label: '🏃 Health', value: 'HEALTH' },
    { label: '📚 Study', value: 'STUDY' },
    { label: '🎯 General', value: 'GENERAL' },
  ];

  const sortOptions: { label: string; value: TaskSortOption }[] = [
    { label: '🧠 Smart Mix', value: 'SMART' },
    { label: '🕒 Deadline', value: 'DEADLINE' },
    { label: '🔥 Priority', value: 'PRIORITY' },
    { label: '✨ Newest', value: 'NEWEST' },
  ];

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          placeholderTextColor={COLORS.textMuted}
          value={filters.search}
          onChangeText={setSearchQuery}
        />
        {!!filters.search && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Row 1: Status Tabs & Smart Sort Toggle */}
      <View style={styles.row}>
        <View style={styles.tabsContainer}>
          {statusOptions.map((opt) => {
            const isActive = filters.status === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setFilterStatus(opt.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Horizontal Scrollable Sorting & Category Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sort Chips */}
        {sortOptions.map((opt) => {
          const isActive = filters.sort === opt.value;
          return (
            <TouchableOpacity
              key={`sort-${opt.value}`}
              style={[styles.chip, styles.sortChip, isActive && styles.activeSortChip]}
              onPress={() => setSortOption(opt.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={styles.chipDivider} />

        {/* Priority Chips */}
        {priorityOptions.map((opt) => {
          const isActive = filters.priority === opt.value;
          return (
            <TouchableOpacity
              key={`prio-${opt.value}`}
              style={[styles.chip, isActive && styles.activeChip]}
              onPress={() => setFilterPriority(opt.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={styles.chipDivider} />

        {/* Category Chips */}
        {categoryOptions.map((opt) => {
          const isActive = filters.category === opt.value;
          return (
            <TouchableOpacity
              key={`cat-${opt.value}`}
              style={[styles.chip, isActive && styles.activeChip]}
              onPress={() => setFilterCategory(opt.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    paddingVertical: 6,
  },
  clearSearch: {
    color: COLORS.textMuted,
    fontSize: 16,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    flex: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: '700',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  chip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.primary,
  },
  sortChip: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  activeSortChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  activeChipText: {
    color: '#FFF',
    fontWeight: '700',
  },
  chipDivider: {
    width: 1,
    height: 18,
    backgroundColor: COLORS.surfaceBorder,
    marginRight: 8,
  },
});
