import { StyleSheet, Text, View, Image, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Button from '@/src/components/Button';
import { JournalEntry } from '@/src/models/JournalEntry';
import { fetchEntryById, deleteEntry, updateEntry } from '@/src/helpers/fileSystemCRUD';

const emotions = ['sad', 'happy', 'neutral'];
//TODO make emotions be part of entry object, not jus added here

//TODO this page will be for opening the specific entry
//TODO button to edit entry, which will 'unlock' the fields that can be changed, allow you to edit them and save the new entry
//TODO date of this update will be saved as well, showing both in the entry

export default function EntryDetailScreen() {
    const { entry_id } = useLocalSearchParams();
    const router = useRouter();

    const id = typeof entry_id === 'string' ? entry_id : '';

    const [entry, setEntry] = useState<JournalEntry | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [entryText, setEntryText] = useState('');
    const [selectedEmotion, setSelectedEmotion] = useState('happy');

    useEffect(() => {
        const loadEntry = async () => {
            if (id) {
                const fetchedEntry = await fetchEntryById(id);
                if (fetchedEntry) {
                    setEntry(fetchedEntry);
                    setTitle(fetchedEntry.title || '');
                    setEntryText(fetchedEntry.content || '');
                    setSelectedEmotion(fetchedEntry.emotion || 'happy');
                }
            }
        };

        loadEntry();
    }, [id]);

    const handleSave = async () => {
        if (entry) {
            await updateEntry(id, { title, content: entryText });
            setIsEditing(false);
            router.push('/(tabs)/entries/home');
        }
    };

    const handleDelete = async () => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this entry?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                onPress: async () => {
                    await deleteEntry(id);
                    router.replace('/(tabs)/entries/home');
                },
                style: 'destructive',
            },
        ]);
    };

    if (!entry) {
        return <Text>Entry not found</Text>;
    }

    return (
        <ScrollView>
            <Stack.Screen options={{ title: isEditing ? 'Edit Entry' : entry.title }} />
            
            {/* Conditionally render the Image component */}
            {entry.image && (
                <Image source={{ uri: entry.image }} style={styles.image} />
            )}

            {isEditing ? (
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                />
            ) : (
                <Text style={styles.title}>{title}</Text>
            )}

            {isEditing ? (
                <TextInput
                    style={[styles.input, { height: Math.max(40, entryText.length * 2) }]} // Dynamic height
                    value={entryText}
                    onChangeText={setEntryText}
                    multiline
                />
            ) : (
                <Text>{entryText}</Text>
            )}

            <Text>Emotions: </Text>
            <View style={styles.emotions}>
                {emotions.map((emotion) => (
                    <Pressable
                        onPress={() => { setSelectedEmotion(emotion); }}
                        style={[styles.emotion, { backgroundColor: selectedEmotion === emotion ? '#B3EBF2' : '#779ca1' }]}
                        key={emotion}
                    >
                        <Text style={[styles.emotionText, { color: selectedEmotion === emotion ? 'black' : '#becbcc' }]}>
                            {emotion}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Button onPress={isEditing ? handleSave : () => setIsEditing(true)} text={isEditing ? "Save Entry" : "Edit Entry"} />
            <Button onPress={handleDelete} text="Delete Entry" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    image: {
        width: '50%',
        aspectRatio: 1,
        margin: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
        color: 'black',
    },
    emotions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    emotion: {
        backgroundColor: '#B3EBF2',
        width: 80,
        aspectRatio: 1,
        borderRadius: 55,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emotionText: {
        fontSize: 20,
    },
});