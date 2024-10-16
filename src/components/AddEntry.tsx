import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { createEntry } from '../helpers/fileSystemCRUD';
import Button from './Button';
import { useFocusEffect, useRouter } from 'expo-router';
import { Basic } from './RichTextEditor';
import Sentiment from 'sentiment';
import Slider from '@react-native-community/slider';
import { Emotion } from '../models/JournalEntry';
import { analyzeSentiment } from '../helpers/sentiment';
import { getRandomPrompt } from '../models/Prompts';


//TODO when calculating valence, compare it to the emotion as ground truth
//TODO Content doesnt show when exiting writing mode
const AddEntry: React.FC = () => {
    //const editorRef = useRef<RichEditor>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [emotionValue, setEmotionValue] = useState(0);
    const [sliderTouched, setSliderTouched] = useState(false);
    const [entryType, setEntryType] = useState<'emotion' | 'freeform' | null>(null);
    const [isTyping, setIsTyping] = useState(false); // New state to track if the user is typing
    const selectedPromptRef = useRef<string>("null");

    const router = useRouter();
    let blurTimeout: NodeJS.Timeout; // Variable to store the timeout ID


    useFocusEffect(
        useCallback(() => {
            setTitle('');
            setContent('');
            setEmotionValue(0);
            setSliderTouched(false);
            setEntryType(null);
            setIsTyping(false);
            selectedPromptRef.current = " ";
        }, [])
    )

    useEffect(() => {
        if (entryType === 'emotion' && !selectedPromptRef.current) {
            selectedPromptRef.current = getRandomPrompt(emotionValue); // Set the prompt only once
        }
    }, [emotionValue, entryType]);

    const handleCreateEntry = async () => {
        if (title && content) {
            //analyze sentiment and get the score and word
            const sentimentResult = analyzeSentiment(content);
            const sentimentScore = sentimentResult.score;
            const sentimentWord = sentimentResult.emotion;

            //get emotion value and map it to the Emotion value same as sentiment
            const emotionSliderScore = emotionValue
            const emotionSliderWord = emotionSliderScore > 0 ? 'Happy' : emotionSliderScore < 0 ? 'Sad' : 'Neutral';

            await createEntry(title, content, sentimentScore, sentimentWord, emotionSliderScore, emotionSliderWord, selectedPromptRef.current,);

            //clear input fields and navigate back
            setTitle('');
            setContent('');
            setEntryType(null);
            setSliderTouched(false);
            setIsTyping(false);

            router.push('/(tabs)/entries/home');
        } else {
            alert('Please enter both a title and content.');
        }


    };

    const handleBlur = () => {
        blurTimeout = setTimeout(() => {
            setIsTyping(false);
        }, 100);
    };

    const handleFocus = () => {
        if (blurTimeout) {
            clearTimeout(blurTimeout); // Clear timeout if a new input gets focused quickly
        }

        if (!selectedPromptRef.current && entryType === 'emotion') {
            selectedPromptRef.current = getRandomPrompt(emotionValue);
        }

        setIsTyping(true);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <ScrollView style={[{ flexGrow: 1 }, styles.container]}>
                {!isTyping && (
                    <View>
                        {/* Slider for emotion input */}
                        <Text style={styles.sliderLabel}>How are you feeling/ How would you rate your day? (negative - positive)</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={-5}
                            maximumValue={5}
                            step={1}
                            value={emotionValue}
                            minimumTrackTintColor="#0000FF"
                            maximumTrackTintColor="#FF0000"
                            thumbTintColor="#000000"
                            onSlidingStart={() => setSliderTouched(true)}
                            onValueChange={(value) => {
                                setEmotionValue(value);
                                selectedPromptRef.current = "";
                            }} />
                        {/* <Text style={styles.sliderValue}>Emotion: {emotionValue.toFixed(1)}</Text> */}

                        {sliderTouched && (
                            <View>
                                <Button text="Write about this emotion" onPress={() => setEntryType('emotion')} />
                                <Button text="Free form entry" onPress={() => setEntryType('freeform')} />
                            </View>
                        )}
                    </View>)}

                {entryType && (
                    <View style={{ flex: 1 }}>
                        {entryType === 'emotion' && (
                            <Text style={styles.sliderValue}>{selectedPromptRef.current}</Text>
                        )}
                        {entryType === 'freeform' && (
                            <Text style={styles.sliderValue}>
                                *positive psychology prompt (gratitude)*
                            </Text>
                        )}

                        <TextInput
                            style={[
                                styles.input,
                                {
                                    flex: isTyping ? 1 : undefined,
                                    height: isTyping ? '100%' : Math.max(40, content.length * 1),
                                },
                            ]}
                            placeholder="Title"
                            value={title}
                            onChangeText={setTitle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />

                        <TextInput
                            style={[
                                styles.input,
                                {
                                    flex: isTyping ? 1 : undefined,
                                    height: isTyping ? '100%' : Math.max(100, content.length * 1),
                                    paddingBottom: 20
                                },
                                { paddingBottom: 120 }

                            ]}
                            placeholder="Content"
                            value={content}
                            onChangeText={setContent}
                            multiline={true}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />

                        {!isTyping && <Button text="Save" onPress={handleCreateEntry} />}
                    </View>
                )}
            </ScrollView>
        </TouchableWithoutFeedback>

    );
};

export default AddEntry;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        color: 'black',
        margin: 20,
    },
    richTextEditor: {
        height: 200,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 20,
    },
    sliderLabel: {
        fontSize: 16,
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 10,
    },
    sliderValue: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
});
