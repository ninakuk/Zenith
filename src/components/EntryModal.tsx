import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput } from 'react-native';

import { Text, View } from '@/src/components/Themed';
import { RiveAnimation } from './RiveAnimation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAvatar } from '../context/AvatarContext';
import { Fit, RiveRef } from 'rive-react-native';
import Button from './Button';
import { useTheme } from '@react-navigation/native';
import { analyzeSentiment } from '../helpers/sentiment';
import { createEntry } from '../helpers/fileSystemCRUD';
import { useFocusEffect, useRouter } from 'expo-router';
import Modal from 'react-native-modal';


interface ModalProps {
    isModalVisible: boolean;
    entryType: 'emotion' | 'freeform' | null;
    onClose: () => void;
    isEmotionEntry: boolean;
    prompt: string;
    emotionValue: number;
}

const ModalScreen: React.FC<ModalProps> = ({ onClose, isModalVisible, entryType, isEmotionEntry, prompt, emotionValue}) => {

    const riveRef = useRef<RiveRef | null>(null);
    const router = useRouter();

    const { color, eyeType } = useAvatar();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    //const [emotionValue, setEmotionValue] = useState(0);
    //const [sliderTouched, setSliderTouched] = useState(false);


    //const [isModalVisible, setModalVisible] = useState(false);
    const colors = useTheme().colors;
    const styles = useMemo(() => makeStyles(colors), [colors]);

    // useFocusEffect(
    //     useCallback(() => {
    //         setTitle('');
    //         setContent('');
    //         //setEmotionValue(0);
    //         //setSliderTouched(false);
    //         selectedPromptRef.current = "";
    //     }, [])
    // )

    const handleCreateEntry = () => {
        if (title && content) {
            //analyze sentiment and get the score and word
            const sentimentResult = analyzeSentiment(content);
            const sentimentScore = sentimentResult.score;
            const sentimentWord = sentimentResult.emotion;
            const sentimentHappyW = sentimentResult.happyW;
            const sentimentSadW = sentimentResult.sadW;
            const sentimentAllW = sentimentResult.allW;

            //get emotion value and map it to the Emotion value same as sentiment
            //console.log("emotion value in modal?", emotionValue)
            const emotionSliderScore = emotionValue
            const emotionSliderWord = emotionSliderScore > 0 ? 'Happy' : emotionSliderScore < 0 ? 'Sad' : 'Neutral';

            const createdAt = new Date(); // Format: YYYY-MM-DDTHH:mm:ss.sssZ

             createEntry(
                title,
                content,
                sentimentScore,
                sentimentWord,
                emotionSliderScore,
                emotionSliderWord,
                prompt,
                createdAt,
                sentimentHappyW,
                sentimentSadW,
                sentimentAllW,
                isEmotionEntry
            );

            //clear input fields and navigate back
            setTitle('');
            setContent('');
            //setEntryType(null);
            //setSliderTouched(false);
            //setIsTyping(false);

            router.push('/(tabs)/entries/home');
        } else {
            alert('Please enter both a title and content.');
        }


    };

    const toggleModal = () => {
        onClose();
    };

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
      
    return (
        <Modal
            isVisible={isModalVisible}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropOpacity={0.5}
            onBackdropPress={toggleModal}
            style={{ justifyContent: 'flex-end', margin: 0}}
        >
        <View style={styles.modalContent}>
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
                {entryType === 'emotion' && prompt && (
                    <Text style={styles.promptText}>{prompt}</Text>
                )}
                {entryType === 'freeform' && (
                    <Text style={styles.promptText}>Im here for you!</Text>
                )}
            </View>

            {/* Input Fields */}
            <View style={{flexDirection: "column", width:"100%"}}>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={[styles.input, { height: 150 }]}
                placeholder=""
                value={content}
                onChangeText={setContent}
                multiline={true}
            />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignContent: "flex-end" }}>
                <Button text="Save" onPress={() => { 
                    handleCreateEntry(); 
                    //toggleModal();
                     }} />
                <Button text="Cancel" onPress={() => {
                    toggleModal();
                }} />
            </View>

        </View>
        </Modal>
    );
}

const makeStyles = (colors: any) => StyleSheet.create({
    modalContent: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 8,
        paddingBottom: 40,
        alignItems: 'center',
        flexDirection: 'column',
        height: '95%'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
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
      promptText: {
        fontSize: 16,
        flexShrink: 1,
        margin: 10,
        width: '50%'
      },
      avatar: {
        width: '50%',
        marginRight: 0,
      },
      avatarAndPromptContainerModal: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 200,
        marginBottom: 10
      },
});

export default ModalScreen;
