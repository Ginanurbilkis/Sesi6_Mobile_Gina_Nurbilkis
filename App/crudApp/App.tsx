import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
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
      <Text style={styles.title}>CRUD App</Text>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Enter item name"
      />
      <Button title={editingItem ? "Update Item" : "Add Item"} onPress={handleSubmit} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Button title="Edit" onPress={() => handleEdit(item)} />
            <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10 },
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1 },
});

export default App;
