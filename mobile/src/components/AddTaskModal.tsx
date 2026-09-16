import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { TYPOGRAPHY } from '../theme/typography';
import { CustomInput } from './CustomInput';
import { CustomButton } from './CustomButton';
import { Task, TaskPriority, TaskCategory, CreateTaskInput } from '../types/task';
import { useTask } from '../context/TaskContext';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  taskToEdit,
}) => {
  const { addTask, editTask } = useTask();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [category, setCategory] = useState<TaskCategory>('GENERAL');
  const [deadlineOffsetHours, setDeadlineOffsetHours] = useState<number>(12); // default 12 hours
  const [customDeadline, setCustomDeadline] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category);
      setCustomDeadline(taskToEdit.deadline);
    } else {
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setCategory('GENERAL');
      setDeadlineOffsetHours(12);
      setCustomDeadline('');
    }
    setError(null);
  }, [taskToEdit, visible]);

  const calculateDeadlineISO = (): string => {
    if (customDeadline) return customDeadline;
    const now = new Date();
    return new Date(now.getTime() + deadlineOffsetHours * 60 * 60 * 1000).toISOString();
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    const deadlineIso = calculateDeadlineISO();

    try {
      if (taskToEdit) {
        await editTask(taskToEdit._id, {
          title: title.trim(),
          description: description.trim(),
          priority,
          category,
          deadline: deadlineIso,
        });
      } else {
        const input: CreateTaskInput = {
          title: title.trim(),
          description: description.trim(),
          priority,
          category,
          deadline: deadlineIso,
        };
        await addTask(input);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving task');
    } finally {
      setSubmitting(false);
    }
  };

  const priorities: { label: string; value: TaskPriority; color: string }[] = [
    { label: '🔥 Urgent', value: 'URGENT', color: COLORS.urgent },
    { label: '⚡ High', value: 'HIGH', color: COLORS.high },
    { label: '📌 Medium', value: 'MEDIUM', color: COLORS.medium },
    { label: '🌱 Low', value: 'LOW', color: COLORS.low },
  ];

  const categories: { label: string; value: TaskCategory }[] = [
    { label: '💼 Work', value: 'WORK' },
    { label: '🏠 Personal', value: 'PERSONAL' },
    { label: '🏃 Health', value: 'HEALTH' },
    { label: '📚 Study', value: 'STUDY' },
    { label: '🎯 General', value: 'GENERAL' },
  ];

  const presetDeadlines: { label: string; hours: number }[] = [
    { label: '+3 Hours', hours: 3 },
    { label: '+12 Hours', hours: 12 },
    { label: 'Tomorrow', hours: 24 },
    { label: 'In 3 Days', hours: 72 },
    { label: 'In 1 Week', hours: 168 },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>
              {taskToEdit ? 'Edit Task Details' : 'Create New Task'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Title Input */}
            <CustomInput
              label="Task Title *"
              placeholder="e.g. Complete React Native CLI setup"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (error) setError(null);
              }}
              error={error}
            />

            {/* Description Input */}
            <CustomInput
              label="Description (Optional)"
              placeholder="Add key details, subtasks, or links..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              style={{ height: 75, textAlignVertical: 'top' }}
            />

            {/* Priority Selection */}
            <Text style={styles.sectionLabel}>Priority Level</Text>
            <View style={styles.chipRow}>
              {priorities.map((item) => {
                const selected = priority === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.selectableChip,
                      selected && { backgroundColor: item.color, borderColor: item.color },
                    ]}
                    onPress={() => setPriority(item.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && { color: '#FFF', fontWeight: '700' },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Category Selection */}
            <Text style={styles.sectionLabel}>Category Tag</Text>
            <View style={styles.chipRow}>
              {categories.map((item) => {
                const selected = category === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.selectableChip,
                      selected && styles.selectedCategoryChip,
                    ]}
                    onPress={() => setCategory(item.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && { color: '#FFF', fontWeight: '700' },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Deadline Preset Selector */}
            <Text style={styles.sectionLabel}>Target Deadline</Text>
            <View style={styles.chipRow}>
              {presetDeadlines.map((item) => {
                const selected = deadlineOffsetHours === item.hours && !customDeadline;
                return (
                  <TouchableOpacity
                    key={`dl-${item.hours}`}
                    style={[
                      styles.selectableChip,
                      selected && styles.selectedDeadlineChip,
                    ]}
                    onPress={() => {
                      setDeadlineOffsetHours(item.hours);
                      setCustomDeadline('');
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && { color: '#FFF', fontWeight: '700' },
                      ]}
                    >
                      ⏱️ {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footer}>
            <CustomButton
              title={taskToEdit ? 'Save Changes' : 'Create Task'}
              onPress={handleSubmit}
              loading={submitting}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlayBg,
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: COLORS.surfaceBorder,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    fontSize: 20,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    color: COLORS.textMuted,
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    marginBottom: 16,
  },
  sectionLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  selectableChip: {
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  selectedDeadlineChip: {
    backgroundColor: COLORS.cyanNeon,
    borderColor: COLORS.cyanNeon,
  },
  chipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  footer: {
    paddingTop: 8,
  },
});
