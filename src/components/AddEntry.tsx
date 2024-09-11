import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { createEntry } from '../helpers/fileSystemCRUD';
import Button from './Button';
import { useRouter } from 'expo-router';
import { Basic } from './RichTextEditor';
import Sentiment from 'sentiment';

//TODO when calculating valence, compare it to the emotion as ground truth

const AddEntry: React.FC = () => {
    //const editorRef = useRef<RichEditor>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();

    const analyzeSentiment = (text: string) => {
        const sentiment = new Sentiment();
        const result = sentiment.analyze(text);
        const score = result.score;
        const happyW = result.positive;
        const sadW = result.negative;
        console.log("sad words: ", sadW, "happy words ", happyW)
    
        // Determine valence based on score
        if (score > 0) return 'happy';
        if (score < 0) return 'sad';
        return 'neutral';
    };

    const handleCreateEntry = async () => {
        if (title && content) {
            const valence = analyzeSentiment(content);
            await createEntry(title, content, valence); // Update your createEntry function to accept valence
            setTitle('');
            setContent('');
            router.push('/(tabs)/entries/home');
        } else {
            alert('Please enter both a title and content.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <View style={{ flex: 1 }}>
            <Text style={styles.header}>Add New Entry</Text>

            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                style={[styles.input, { height: Math.max(40, content.length * 1) }]} // Dynamic height
                placeholder="Content"
                value={content}
                onChangeText={setContent}
                multiline={true}
            />


            {/* <View style={{ height: 100 }}>
                <Basic></Basic>
            </View> */}

            <Button text="Save" onPress={handleCreateEntry}></Button>
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
});
