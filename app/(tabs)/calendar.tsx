import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { useTodos } from '@/context/TodoContext';
import { TodoItem } from '@/components/TodoItem';
import { AddTodoModal } from '@/components/AddTodoModal';

export default function CalendarScreen() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const markedDates = todos.reduce((acc, todo) => {
    if (todo.dueDate) {
      acc[todo.dueDate] = {
        marked: true,
        dotColor: todo.completed ? '#4CAF50' : '#007AFF',
      };
    }
    return acc;
  }, {} as Record<string, { marked: boolean; dotColor: string }>);

  const todosForSelectedDate = todos.filter(
    (todo) => todo.dueDate === selectedDate
  );

  return (
    <View style={styles.container}>
      <RNCalendar
        current={selectedDate}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...(markedDates[selectedDate] || {}),
            selected: true,
            selectedColor: '#007AFF',
          },
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          selectedDayBackgroundColor: '#007AFF',
          todayTextColor: '#007AFF',
          arrowColor: '#007AFF',
          monthTextColor: '#000000',
          textDayFontFamily: 'Inter_400Regular',
          textMonthFontFamily: 'Inter_600SemiBold',
          textDayHeaderFontFamily: 'Inter_500Medium',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        enableSwipeMonths={true}
      />
      <View style={styles.todoList}>
        {todosForSelectedDate.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => updateTodo(todo.id, { completed: !todo.completed })}
            onDelete={() => deleteTodo(todo.id)}
            onPress={() => {
              // Handle edit todo
            }}
            onUpdateNotes={(notes) => updateTodo(todo.id, { notes })}
          />
        ))}
      </View>

      <AddTodoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(todo) => {
          addTodo({ ...todo, dueDate: selectedDate });
          setModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  todoList: {
    flex: 1,
    paddingTop: 16,
  },
});