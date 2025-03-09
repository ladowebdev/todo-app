import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { PencilLine } from 'lucide-react-native';
import { TodoItem } from '@/components/TodoItem';
import { AddTodoModal } from '@/components/AddTodoModal';
import { useTodos } from '@/context/TodoContext';

export default function TodoScreen() {
  const { todos, addTodo, updateTodo, deleteTodo, reorderTodos } = useTodos();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <DraggableFlatList
        data={todos}
        onDragEnd={({ from, to }) => reorderTodos(from, to)}
        keyExtractor={(item) => item.id}
        renderItem={({ item, drag, isActive }) => (
          <ScaleDecorator>
            <TouchableOpacity
              onLongPress={drag}
              disabled={isActive}
              delayLongPress={150}>
              <TodoItem
                todo={item}
                onToggle={() => updateTodo(item.id, { completed: !item.completed })}
                onDelete={() => deleteTodo(item.id)}
                onPress={() => {
                  // Handle edit todo
                }}
                onUpdateNotes={(notes) => updateTodo(item.id, { notes })}
              />
            </TouchableOpacity>
          </ScaleDecorator>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}>
        <PencilLine size={24} color="#ffffff" />
      </TouchableOpacity>

      <AddTodoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addTodo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});