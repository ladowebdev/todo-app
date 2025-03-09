import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { X, Plus, ChevronDown } from 'lucide-react-native';
import { useTodos } from '@/context/TodoContext';

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (todo: {
    title: string;
    description?: string;
    notes?: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
    completed: boolean;
  }) => void;
}

export function AddTodoModal({ visible, onClose, onSubmit }: AddTodoModalProps) {
  const { categories, addCategory } = useTodos();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState<string | undefined>();
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState(categories[0]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      notes: notes.trim(),
      dueDate,
      priority,
      category,
      completed: false,
    });

    setTitle('');
    setDescription('');
    setNotes('');
    setDueDate(undefined);
    setPriority('medium');
    setCategory(categories[0]);
    onClose();
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setCategory(newCategory.trim());
      setNewCategory('');
      setShowNewCategoryInput(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={[styles.headerText, { fontFamily: 'Inter_600SemiBold' }]}>
              Add New Task
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <TextInput
              style={[styles.titleInput, { fontFamily: 'Inter_600SemiBold' }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Task title..."
              placeholderTextColor="#999999"
            />

            <TextInput
              style={[styles.descriptionInput, { fontFamily: 'Inter_400Regular' }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add a description..."
              placeholderTextColor="#999999"
              multiline
            />

            <TouchableOpacity
              style={styles.notesToggle}
              onPress={() => setShowNotes(!showNotes)}>
              <ChevronDown
                size={20}
                color="#666666"
                style={[
                  styles.notesIcon,
                  showNotes && { transform: [{ rotate: '180deg' }] },
                ]}
              />
              <Text style={[styles.notesLabel, { fontFamily: 'Inter_500Medium' }]}>
                Notes
              </Text>
            </TouchableOpacity>

            {showNotes && (
              <TextInput
                style={[styles.notesInput, { fontFamily: 'Inter_400Regular' }]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add detailed notes..."
                placeholderTextColor="#999999"
                multiline
                textAlignVertical="top"
              />
            )}

            <View style={styles.categoryContainer}>
              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.categoryButton,
                      category === item && styles.categoryButtonSelected,
                    ]}
                    onPress={() => setCategory(item)}>
                    <Text
                      style={[
                        styles.categoryText,
                        category === item && styles.categoryTextSelected,
                        { fontFamily: 'Inter_500Medium' },
                      ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
                ListFooterComponent={
                  <TouchableOpacity
                    style={styles.addCategoryButton}
                    onPress={() => setShowNewCategoryInput(true)}>
                    <Plus size={20} color="#007AFF" />
                  </TouchableOpacity>
                }
              />
            </View>

            {showNewCategoryInput && (
              <View style={styles.newCategoryContainer}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 8 }]}
                  value={newCategory}
                  onChangeText={setNewCategory}
                  placeholder="New category name"
                  placeholderTextColor="#999999"
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddCategory}>
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.priorityContainer}>
              {(['low', 'medium', 'high'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    priority === p && styles.priorityButtonSelected,
                  ]}
                  onPress={() => setPriority(p)}>
                  <Text
                    style={[
                      styles.priorityText,
                      priority === p && styles.priorityTextSelected,
                      { fontFamily: 'Inter_500Medium' },
                    ]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowCalendar(true)}>
              <Text style={[styles.dateButtonText, { fontFamily: 'Inter_400Regular' }]}>
                {dueDate ? new Date(dueDate).toLocaleDateString() : 'Set due date'}
              </Text>
            </TouchableOpacity>

            {showCalendar && (
              <View style={styles.calendarContainer}>
                <Calendar
                  onDayPress={(day) => {
                    setDueDate(day.dateString);
                    setShowCalendar(false);
                  }}
                  markedDates={dueDate ? { [dueDate]: { selected: true } } : {}}
                  theme={{
                    selectedDayBackgroundColor: '#007AFF',
                    todayTextColor: '#007AFF',
                    arrowColor: '#007AFF',
                  }}
                />
              </View>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={[styles.submitButtonText, { fontFamily: 'Inter_600SemiBold' }]}>
                Create Task
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 20,
    color: '#000000',
  },
  closeButton: {
    padding: 8,
  },
  form: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  titleInput: {
    fontSize: 24,
    color: '#000000',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  descriptionInput: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  notesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  notesIcon: {
    marginRight: 8,
  },
  notesLabel: {
    fontSize: 16,
    color: '#666666',
  },
  notesInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 120,
    fontSize: 14,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  categoryButtonSelected: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#000000',
    fontSize: 14,
  },
  categoryTextSelected: {
    color: '#ffffff',
  },
  addCategoryButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  priorityContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    alignItems: 'center',
  },
  priorityButtonSelected: {
    backgroundColor: '#007AFF',
  },
  priorityText: {
    color: '#000000',
    fontSize: 14,
  },
  priorityTextSelected: {
    color: '#ffffff',
  },
  dateButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  calendarContainer: {
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});