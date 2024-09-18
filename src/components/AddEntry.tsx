import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { createEntry } from '../helpers/fileSystemCRUD';
import Button from './Button';
import { useFocusEffect, useRouter } from 'expo-router';
import { Basic } from './RichTextEditor';
import Sentiment from 'sentiment';
import Slider from '@react-native-community/slider';
import { Emotion } from '../models/JournalEntry';


//TODO when calculating valence, compare it to the emotion as ground truth

const AddEntry: React.FC = () => {
    //const editorRef = useRef<RichEditor>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [emotionValue, setEmotionValue] = useState(0);
    const [sliderTouched, setSliderTouched] = useState(false); // State to check if slider is touched

    const [entryType, setEntryType] = useState<'emotion' | 'freeform' | null>(null);

    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            setTitle('');
            setContent('');
            setEmotionValue(0);
            setSliderTouched(false);
            setEntryType(null);
        }, []) 
    )

    const analyzeSentiment = (text: string) => {
        const sentiment = new Sentiment();
        const result = sentiment.analyze(text);
        const score = result.score;

        // Convert score to emotion word
        let emotion: Emotion;
        if (score > 0) {
            emotion = 'Happy';
        } else if (score < 0) {
            emotion = 'Sad';
        } else {
            emotion = 'Neutral';
        }

        return { score, emotion };
    };


    const handleCreateEntry = async () => {
        if (title && content) {
            //analyze sentiment and get the score and word
            const sentimentResult = analyzeSentiment(content);
            const sentimentScore = sentimentResult.score;
            const sentimentWord = sentimentResult.emotion;

            //get emotion value and map it to the Emotion value same as sentiment
            const emotionSliderScore = emotionValue
            const emotionSliderWord = emotionSliderScore > 0 ? 'Happy' : emotionSliderScore < 0 ? 'Sad' : 'Neutral';

            await createEntry(title, content, sentimentScore, sentimentWord, emotionSliderScore, emotionSliderWord);

            //clear input fields and navigate back
            setTitle('');
            setContent('');
            setEntryType(null);
            setSliderTouched(false);

            router.push('/(tabs)/entries/home');
        } else {
            alert('Please enter both a title and content.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <View style={{ flex: 1 }}>
                <Text style={styles.header}>Add New Entry</Text>

                {/* Slider for emotion input */}
                <Text style={styles.sliderLabel}>How are you feeling? (Sad - Happy)</Text>
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
                    onValueChange={setEmotionValue} // Update the emotion value continuously while sliding
                    onSlidingComplete={(value) => {
                        console.log('Final slider value:', value); // Handle the final value if needed
                    }}
                />
                <Text style={styles.sliderValue}>Emotion: {emotionValue.toFixed(1)}</Text>



                {sliderTouched && (
                    <View>
                        <Button text="Write about this emotion" onPress={() => setEntryType('emotion')} />
                        <Button text="Free form entry" onPress={() => setEntryType('freeform')} />
                    </View>
                )}

                {entryType && (
                    <View>
                        {entryType === 'emotion' && (
                        <Text style={styles.sliderValue}>*prompt for this emotion* {emotionValue.toFixed(1)}</Text>
                        )}
                        {entryType === 'freeform' && (
                        <Text style={styles.sliderValue}>*generic positive prompt* {emotionValue.toFixed(1)}</Text>
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            style={[styles.input, { height: Math.max(40, content.length * 1) }]}
                            placeholder="Content"
                            value={content}
                            onChangeText={setContent}
                            multiline={true}
                        />
                        <Button text="Save" onPress={handleCreateEntry} />
                    </View>
                )}
            </View>
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
        marginBottom: 20,
        fontSize: 16,
        color: 'black',
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
        marginBottom: 20,
    },
    sliderValue: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
});
