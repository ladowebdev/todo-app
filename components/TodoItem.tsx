import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Check, Clock, Trash2, Tag, ChevronDown } from 'lucide-react-native';
import { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onPress: () => void;
  onUpdateNotes: (notes: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onPress, onUpdateNotes }: TodoItemProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(todo.notes || '');

  const priorityColors = {
    low: '#4CAF50',
    medium: '#FFC107',
    high: '#F44336',
  };

  const handleNotesChange = (text: string) => {
    setNotes(text);
    onUpdateNotes(text);
  };

  return (
    <View style={[styles.container, todo.completed && styles.completed]}>
      <TouchableOpacity
        style={styles.mainContent}
        onPress={onPress}
        activeOpacity={0.7}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={[styles.checkbox, todo.completed && styles.checkboxChecked]}
            onPress={onToggle}>
            {todo.completed && <Check size={16} color="#ffffff" />}
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title,
                todo.completed && styles.completedText,
                { fontFamily: 'Inter_500Medium' },
              ]}>
              {todo.title}
            </Text>
            {todo.description && (
              <Text
                style={[
                  styles.description,
                  todo.completed && styles.completedText,
                  { fontFamily: 'Inter_400Regular' },
                ]}>
                {todo.description}
              </Text>
            )}
            <View style={styles.metaContainer}>
              <View style={styles.categoryContainer}>
                <Tag size={12} color="#666666" />
                <Text style={[styles.categoryText, { fontFamily: 'Inter_400Regular' }]}>
                  {todo.category}
                </Text>
              </View>
              {todo.dueDate && (
                <View style={styles.dueDate}>
                  <Clock size={12} color="#666666" />
                  <Text style={[styles.dueDateText, { fontFamily: 'Inter_400Regular' }]}>
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.rightSection}>
          <View
            style={[styles.priorityIndicator, { backgroundColor: priorityColors[todo.priority] }]}
          />
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Trash2 size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.notesToggle}
        onPress={() => setShowNotes(!showNotes)}>
        <ChevronDown
          size={20}
          color="#666666"
          style={[styles.notesIcon, showNotes && { transform: [{ rotate: '180deg' }] }]}
        />
        <Text style={[styles.notesLabel, { fontFamily: 'Inter_500Medium' }]}>Notes</Text>
      </TouchableOpacity>

      {showNotes && (
        <TextInput
          style={[styles.notesInput, { fontFamily: 'Inter_400Regular' }]}
          value={notes}
          onChangeText={handleNotesChange}
          placeholder="Add notes..."
          placeholderTextColor="#999999"
          multiline
          textAlignVertical="top"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  completed: {
    opacity: 0.7,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  notesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  notesIcon: {
    marginRight: 8,
  },
  notesLabel: {
    fontSize: 14,
    color: '#666666',
  },
  notesInput: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    minHeight: 80,
    fontSize: 14,
    color: '#666666',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});