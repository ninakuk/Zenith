import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard, Modal, Alert } from 'react-native';
import { createEntry } from '../helpers/fileSystemCRUD';
import Button from './Button';
import { useFocusEffect, useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { analyzeSentiment } from '../helpers/sentiment';
import { getRandomPrompt } from '../models/Prompts';
import { useTheme } from '@react-navigation/native';
import { Fit, RiveRef } from 'rive-react-native';
import { RiveAnimation } from './RiveAnimation';
import { useAvatar } from '../context/AvatarContext';

////TODO title is useless? maybe remove - not now
////TODO when calculating valence, compare it to the emotion as ground truth - what does this prove? im not testing for the model accuracy. MAYBE for the greeting prompt?

//TODO avatar is not taken from context apparently!!!!!!

const emotionalStates = [
    { label: '😢', value: -5 },
    { label: '😞', value: -3 },
    { label: '😐', value: 0 },
    { label: '😊', value: 3 },
    { label: '😁', value: 5 },
];

const AddEntryyy: React.FC = () => {
    //const editorRef = useRef<RichEditor>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [emotionValue, setEmotionValue] = useState(0);
    const [sliderTouched, setSliderTouched] = useState(false);
    const [entryType, setEntryType] = useState<'emotion' | 'freeform' | null>(null);
    const isEmotionEntry = (entryType === 'emotion');
    const [isModalVisible, setModalVisible] = useState(false);


    const [isTyping, setIsTyping] = useState(false);
    const selectedPromptRef = useRef<string>("null");
    const { color, eyeType } = useAvatar();

    const router = useRouter();
    let blurTimeout: NodeJS.Timeout;

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

    useEffect(() => {
        //load the avatar settings when the component mounts
        const fetchAvatarSettings = async () => {
            try {
                if (riveRef.current) {
                    if (color !== null) riveRef.current.setInputState('State Machine 1', 'BodyColor', color);
                    if (eyeType !== null) riveRef.current.setInputState('State Machine 1', 'EyeType', eyeType);
                }
            } catch (error) {
                console.error('Error loading avatar settings:', error);
            }
        };

        fetchAvatarSettings();
    }, [color, eyeType]);

    const handleCreateEntry = async () => {
        if (title && content) {
            //analyze sentiment and get the score and word
            const sentimentResult = analyzeSentiment(content);
            const sentimentScore = sentimentResult.score;
            const sentimentWord = sentimentResult.emotion;
            const sentimentHappyW = sentimentResult.happyW;
            const sentimentSadW = sentimentResult.sadW;
            const sentimentAllW = sentimentResult.allW;

            //get emotion value and map it to the Emotion value same as sentiment
            const emotionSliderScore = emotionValue
            const emotionSliderWord = emotionSliderScore > 0 ? 'Happy' : emotionSliderScore < 0 ? 'Sad' : 'Neutral';

            const createdAt = new Date(); // Format: YYYY-MM-DDTHH:mm:ss.sssZ

            await createEntry(
                title,
                content,
                sentimentScore,
                sentimentWord,
                emotionSliderScore,
                emotionSliderWord,
                selectedPromptRef.current,
                createdAt,
                sentimentHappyW,
                sentimentSadW,
                sentimentAllW,
                isEmotionEntry
            );

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

                <View>
                    {/* Slider for emotion input */}
                    <Text style={styles.sliderLabel}>How are you feeling today ?</Text>

                    <Slider
                        style={styles.slider}
                        minimumValue={-5}
                        maximumValue={5}
                        step={1}
                        value={emotionValue}
                        minimumTrackTintColor='#76C7F6'
                        maximumTrackTintColor='#FFD855'
                        thumbTintColor="#000000"
                        onSlidingStart={() => setSliderTouched(true)}
                        onValueChange={(value) => {
                            setEmotionValue(value);
                            selectedPromptRef.current = "";
                        }} />

                    <View style={styles.labelContainer}>
                        {emotionalStates.map((state) => (
                            <Text key={state.value} style={styles.emotionLabel}>
                                {state.label}
                            </Text>
                        ))}
                    </View>

                    {/* When emotion picked: */}
                    {sliderTouched && (
                        <View style={styles.promptSelection}>

                            <View style={styles.avatarAndPromptContainer}>
                                <RiveAnimation
                                    source={require('../../assets/animations/avatar_2.riv')}
                                    artboardName="Artboard"
                                    stateMachineName="State Machine 1"
                                    style={styles.avatar}
                                    ref={riveRef}
                                    fit={Fit.FitHeight}
                                />
                                <Text style={styles.promptText}>Do you want to explore this feeling, or just write freely?</Text>
                            </View>

                            <View style={{ flexDirection: "row" }}>
                                <Button text="Explore this emotion" onPress={() => {
                                    setEntryType('emotion');
                                    setModalVisible(true);
                                    //setIsTyping(true);
                                    selectedPromptRef.current = getRandomPrompt(emotionValue); // Set the prompt immediately
                                    setContent(''); // Clear content if needed
                                }} />
                                <Button text="Freeform" onPress={() => {
                                    setEntryType('freeform'); setModalVisible(true);
                                }} />
                            </View>
                        </View>
                    )}
                </View>


                {entryType && (
                    <Modal
                        visible={isModalVisible}
                        //onRequestClose={closeModal}
                        animationType="slide"
                        onRequestClose={() => {
                            setModalVisible(!isModalVisible);
                        }}>
                        <View>
                            {/* Avatar and Prompt */}
                            <View style={styles.avatarAndPromptContainerModal}>
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
                                {entryType === 'freeform' && isTyping && (
                                    <Text style={styles.promptText}>Need Inspiration?</Text>
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

                            <View style={{ flexDirection: "row" }}>
                                <Button text="Save" onPress={() => {handleCreateEntry; setModalVisible(false)}} />
                                <Button text="Cancel" onPress={() => {
                                    setModalVisible(false);
                                }} />
                            </View>

                        </View>
                    </Modal>
                )}
            </ScrollView>
        </TouchableWithoutFeedback >

    );
};

export default AddEntryyy;

const makeStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.background,
    },
    avatarAndPromptContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        height: 300,
        marginBottom: 10,
    },
    avatarAndPromptContainerModal: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 200,
        marginBottom: 10
    },
    promptText: {
        fontSize: 16,
        flexShrink: 1,
        //margin: 10,
        fontWeight:"bold",
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
        textAlignVertical: 'top'
    },
    sliderLabel: {
        fontSize: 16,
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        height: 50,
        marginBottom: 10,
    },
    sliderValue: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 200,
        height: 200,
        marginRight: 0,
    },
    promptSelection: {
        flexDirection: "column",
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
