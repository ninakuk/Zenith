import { StyleSheet, Text, View, Image, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Button from '@/src/components/Button';
import { JournalEntry } from '@/src/models/JournalEntry';
import { fetchEntryById, deleteEntry, updateEntry } from '@/src/helpers/fileSystemCRUD';
import Slider from '@react-native-community/slider';
import { COLORS } from '@/src/constants/Colors';
import { useTheme } from '@react-navigation/native';
import { analyzeSentiment } from '@/src/helpers/sentiment';

//TODO date of this update will be saved as well, showing both in the entry

const emotionalStates = [
    { label: '😢', value: -5 },
    { label: '😞', value: -3 },
    { label: '😐', value: 0 },
    { label: '😊', value: 3 },
    { label: '😁', value: 5 },
];

export default function EntryDetailScreen() {
    const { entry_id } = useLocalSearchParams();
    const router = useRouter();
    const colors = useTheme().colors;
    const styles = useMemo(() => makeStyles(colors), [colors]);


    const id = typeof entry_id === 'string' ? entry_id : '';

    const [entry, setEntry] = useState<JournalEntry | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [entryText, setEntryText] = useState('');
    const [emotionValue, setEmotionValue] = useState(0);

    useEffect(() => {
        const loadEntry = async () => {
            if (id) {
                const fetchedEntry = await fetchEntryById(id);
                if (fetchedEntry) {
                    setEntry(fetchedEntry);
                    setTitle(fetchedEntry.title || '');
                    setEntryText(fetchedEntry.content || '');
                    setEmotionValue(fetchedEntry.emotionSliderScore || 0);
                }
            }
        };

        loadEntry();
    }, [id]);

    const handleSave = async () => {
        if (entry) {
            const sentimentResult = analyzeSentiment(entryText);
            const sentimentScore = sentimentResult.score;
            const sentimentWord = sentimentResult.emotion;
            const sentimentHappyW = sentimentResult.happyW;
            const sentimentSadW = sentimentResult.sadW;
            const sentimentAllW = sentimentResult.allW;

            // Get emotion value and map it to the Emotion word
            const emotionSliderScore = emotionValue;
            const emotionSliderWord = emotionSliderScore > 0
                ? 'Happy'
                : emotionSliderScore < 0
                    ? 'Sad'
                    : 'Neutral';


            await updateEntry(id, {
                title: title,
                content: entryText,
                sentimentScore,
                sentimentWord,
                emotionSliderScore,
                emotionSliderWord,
                sentimentHappyW,
                sentimentSadW,
                sentimentAllW 
            });
            setIsEditing(false); // Exit editing mode
        } else {
            alert('No entry to save.');
        }
    };

    const handleDelete = async () => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this entry?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                onPress: async () => {
                    await deleteEntry(id);
                    //router.replace('/(tabs)/entries/home');
                    router.replace('/(tabs)/entries/home');
                },
                style: 'destructive',
            },
        ]);
    };

    if (!entry) {
        return <Text></Text>;
    }

    return (
        <ScrollView>
            <Stack.Screen options={{
                title: isEditing ? 'Edit Entry' : entry.title,
                headerStyle: {
                    backgroundColor: COLORS.White,
                },
            }} />

            {isEditing ? (
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                />
            ) : (
                <></>
            )}

            {isEditing ? (
                <TextInput
                    style={[styles.input, { height: 150 }]}
                    value={entryText}
                    onChangeText={setEntryText}
                    multiline
                />
            ) : (
                <Text style={[{ color: colors.text, marginHorizontal: 20, height: 150, marginVertical: 30, }, styles.content]}>{entryText}</Text>
            )}


            <Slider
                disabled={!isEditing}
                style={styles.inactiveSlider}
                minimumValue={-5}
                maximumValue={5}
                step={1}
                value={emotionValue}
                onValueChange={setEmotionValue}
                minimumTrackTintColor='#76C7F6'
                maximumTrackTintColor='#FFD855'
                thumbTintColor="#000000"
            />

            {/* Emotion labels */}
            <View style={styles.labelContainer}>
                {emotionalStates.map((state) => (
                    <Text key={state.value} style={styles.emotionLabel}>
                        {state.label}
                    </Text>
                ))}
            </View>


            <View style={{ flexDirection: "row", marginVertical: 20 }}>
                <Button onPress={isEditing ? handleSave : () => setIsEditing(true)} text={isEditing ? "Save Entry" : "Edit Entry"} />
                <Button onPress={handleDelete} text="Delete Entry" />
            </View>
        </ScrollView>
    );
}

const makeStyles = (colors: any) => StyleSheet.create({
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
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        color: colors.text,
        margin: 10,
        textAlignVertical: 'top'
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
    inactiveSlider: {
        width: '100%',
        height: 40,
        marginBottom: 10,
    },
    content: {
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        color: colors.text,
        margin: 10,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    emotionLabel: {
        fontSize: 24,
        textAlign: 'center',
        width: '20%',
    },
});