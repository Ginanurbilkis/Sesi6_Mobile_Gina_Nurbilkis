import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { getItems, createItem, updateItem, deleteItem, Item } from './src/Api';

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [input, setInput] = useState<string>('');
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getItems();
      setItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, { name: input });
        setEditingItem(null);
      } else {
        await createItem({ name: input });
      }
      setInput('');
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (item: Item) => {
    setInput(item.name);
    setEditingItem(item);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteItem(id);
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple CRUD App</Text>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Enter item name"
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{editingItem ? 'Update Item' : 'Add Item'}</Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default App;