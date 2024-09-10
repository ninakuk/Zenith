import { StyleSheet, Image, Animated, FlatList, View, Button, Text } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { journalEntries } from '@/assets/data/journalEntries';
import EntryListItem from '@/src/components/EntryListItem';
import { createEntry, deleteEntry, loadEntries, updateEntry } from '../../helpers/fileSystemCRUD';

export default function HomeScreen() {
  const [entries, setEntries] = useState<any[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      const loadedEntries = await loadEntries();
      setEntries(loadedEntries);
    };

    fetchEntries();
  }, []);

  const handleCreateEntry = async () => {
    // Replace with your logic to get title and content
    const title = `Entry ${entries.length + 1}`;
    const content = 'This is a new entry.';
    await createEntry(title, content);
    const updatedEntries = await loadEntries(); // Re-fetch entries after creation
    setEntries(updatedEntries);
};

  const scrollY = useRef(new Animated.Value(0)).current;

  // Shrinking the container as you scroll
  const imageContainerHeight = scrollY.interpolate({
    inputRange: [0, 100],  // Adjust for how far you scroll
    outputRange: [250, 130], // Initial and shrunk container height
    extrapolate: 'clamp',
  });const handleUpdateEntry = async (id: string) => {
    await updateEntry(id, { title: 'Updated Entry' });
    const updatedEntries = await loadEntries(); // Re-fetch entries after update
    setEntries(updatedEntries);
};

const handleDeleteEntry = async (id: string) => {
    await deleteEntry(id);
    const updatedEntries = await loadEntries(); // Re-fetch entries after deletion
    setEntries(updatedEntries);
};

  return (
    // <View style={styles.main}>
    //   {/* Animated Container for Image */}
    //   <Animated.View style={[styles.imageContainer, { height: imageContainerHeight }]}>
    //     <Image
    //       source={require('../../../../assets/images/2024-09-08 11_54_50-Untitled.png')}
    //       style={styles.image}
    //       resizeMode="contain" // Ensures image scales proportionally
    //     />
    //   </Animated.View>

    //   {/* List of Journal Entries */}
    //   <Animated.FlatList
    //     data={journalEntries}
    //     contentContainerStyle={{ gap: 10, padding: 10 }}
    //     contentInset={{ bottom: 130 }}
    //     renderItem={({ item }) => <EntryListItem entry={item} />}
    //     onScroll={Animated.event(
    //       [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    //       { useNativeDriver: false }
    //     )}
    //   />
    // </View>
    <View style={styles.container}>
    <Button title="Create Entry" onPress={handleCreateEntry} />
    <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
            <View style={styles.entryContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text>{item.content}</Text>
                <Button title="Update" onPress={() => handleUpdateEntry(item.id)} />
                <Button title="Delete" onPress={() => handleDeleteEntry(item.id)} />
            </View>
        )}
    />
</View>
    

  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'white'
  },
  title: {
    fontWeight: 'bold',
},
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
},
  entryContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
},
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    width: '100%',
  },
  image: {
    flex: 1,
    width: '100%',
    //maxWidth: 300, 
    height: '100%',
    aspectRatio: 1,
    marginBottom: 5,
    marginTop: 30
  },
});
