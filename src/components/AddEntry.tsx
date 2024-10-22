import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { createEntry } from '../helpers/fileSystemCRUD';
import Button from './Button';
import { useFocusEffect, useRouter } from 'expo-router';
import Sentiment from 'sentiment';
import Slider from '@react-native-community/slider';
import { Emotion } from '../models/JournalEntry';
import { analyzeSentiment } from '../helpers/sentiment';
import { getRandomPrompt } from '../models/Prompts';
import { COLORS } from '../constants/Colors';
import { useTheme } from '@react-navigation/native';
import { Fit, RiveRef } from 'rive-react-native';
import { RiveAnimation } from './RiveAnimation';


//TODO when calculating valence, compare it to the emotion as ground truth - what does this prove? im not testing for the model accuracy. MAYBE for the greeting prompt?

const emotionalStates = [
    { label: '😢', value: -5 }, 
    { label: '😞', value: -3 }, 
    { label: '😐', value: 0 },  
    { label: '😊', value: 3 },  
    { label: '😁', value: 5 },
];

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

    const colors = useTheme().colors;
    const styles = useMemo(() => makeStyles(colors), [colors]);

    const riveRef = useRef<RiveRef | null>(null);

    useFocusEffect(
        useCallback(() => {
            setTitle('');
            setContent('');
            setEmotionValue(0);
            setSliderTouched(false);
            setEntryType(null);
            setIsTyping(false);
            selectedPromptRef.current = "";
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

            const createdAt = new Date(); // Format: YYYY-MM-DDTHH:mm:ss.sssZ

            await createEntry(title, content, sentimentScore, sentimentWord, emotionSliderScore, emotionSliderWord, selectedPromptRef.current, createdAt);

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

        // if (!selectedPromptRef.current && entryType === 'emotion') {
        //     selectedPromptRef.current = getRandomPrompt(emotionValue);
        // }

        setIsTyping(true);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <ScrollView style={[{ flexGrow: 1 }, styles.container]}>
                {!isTyping && (
                    <View>
                        {/* Slider for emotion input */}
                        <Text style={styles.sliderLabel}>How are you feeling today ?</Text>

                        <Slider
                            style={styles.slider}
                            minimumValue={-5}
                            maximumValue={5}
                            step={1}
                            value={emotionValue}
                            minimumTrackTintColor={colors.text}
                            maximumTrackTintColor={colors.primary}
                            thumbTintColor="#000000"
                            onSlidingStart={() => setSliderTouched(true)}
                            onValueChange={(value) => {
                                setEmotionValue(value);
                                selectedPromptRef.current = "";
                            }} />

                        {/* Emotion labels */}
                        <View style={styles.labelContainer}>
                            {emotionalStates.map((state) => (
                                <Text key={state.value} style={styles.emotionLabel}>
                                    {state.label}
                                </Text>
                            ))}
                        </View>
                        
                        {sliderTouched && (
                            <View style={styles.promptSelection}>
                                <Button text="Write about this emotion" onPress={() => {
                                    setEntryType('emotion');
                                    //setIsTyping(true);
                                    selectedPromptRef.current = getRandomPrompt(emotionValue); // Set the prompt immediately
                                    setContent(''); // Clear content if needed
                                }} />
                                <Button text="Freeform" onPress={() => setEntryType('freeform')} />
                            </View>
                        )}
                    </View>)}

                {entryType && (
                    <View style={{ flex: 1, }}>
                        {/* Avatar and Prompt */}
                        <View style={styles.avatarAndPromptContainer}>
                            <RiveAnimation
                                source={require('../../assets/animations/avatar_2.riv')}
                                artboardName="Artboard"
                                stateMachineName="State Machine 1"
                                style={styles.avatar}
                                ref={riveRef}
                                fit={Fit.FitHeight}
                            />
                            {entryType === 'emotion' && (
                                <Text style={styles.promptText}>{selectedPromptRef.current}</Text>
                            )}
                            {entryType === 'freeform' && (
                                <Text style={styles.promptText}>*positive psychology prompt (gratitude)*</Text>
                            )}
                        </View>

                        {/* Input Fields */}
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={title}
                            onChangeText={setTitle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                        <TextInput
                            style={[styles.input, { height: 150 }]}
                            placeholder=""
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

const makeStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.background,
    },
    avatarAndPromptContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        //marginBottom: 10,
    },
    promptText: {
        fontSize: 16,
        flexShrink: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        color: colors.text,
        margin: 10,
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
    avatar: {
        width: 150,
        height: 150,
        marginRight: 10,
    },
    promptSelection: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
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
