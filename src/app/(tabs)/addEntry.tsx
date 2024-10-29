import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { createEntry } from '../../helpers/fileSystemCRUD';
import Button from '../../components/Button';
import { useFocusEffect, useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { analyzeSentiment } from '../../helpers/sentiment';
import { getRandomPrompt } from '../../models/Prompts';
import { useTheme } from '@react-navigation/native';
import { Fit, RiveRef } from 'rive-react-native';
import { RiveAnimation } from '../../components/RiveAnimation';
import { AvatarContext, useAvatar } from '../../context/AvatarContext';

//TODO avatar is not taken from context apparently!!!!!!

const emotionalStates = [
  { label: '😢', value: -5 },
  { label: '😞', value: -3 },
  { label: '😐', value: 0 },
  { label: '😊', value: 3 },
  { label: '😁', value: 5 },
];


export default function AddEntryScreen() {
  //const editorRef = useRef<RichEditor>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emotionValue, setEmotionValue] = useState(0);
  const [sliderTouched, setSliderTouched] = useState(false);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);
  const [entryType, setEntryType] = useState<'emotion' | 'freeform' | null>(null);
  const isEmotionEntry = (entryType === 'emotion');

  const [isTyping, setIsTyping] = useState(false); // New state to track if the user is typing
  const selectedPromptRef = useRef<string>("null");
  const { color, eyeType } = useAvatar();

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

  useEffect(() => {
      try{
      if (riveRef.current) {
          console.log('Rive ref:', riveRef.current);
          // Proceed with setting input states
          if (color !== null) {
              riveRef.current.setInputState('State Machine 1', 'BodyColor', color);
          }
          if (eyeType !== null) {
              riveRef.current.setInputState('State Machine 1', 'EyeType', eyeType);
          }
      } else {
          console.log('Rive ref not ready yet.');
      }} catch (error) {
          console.error('error loading avatar settings', error)
      }
  }, [riveRef.current, color, eyeType]);


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
                          minimumTrackTintColor='#76C7F6'
                          maximumTrackTintColor='#FFD855'
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
                      <Text>Avatar color: {color}</Text>

                      {sliderTouched && (
                          <View style={styles.promptSelection}>
                              <Button text="Write about this emotion" onPress={() => {
                                  setEntryType('emotion');
                                  setIsAvatarVisible(true);
                                  selectedPromptRef.current = getRandomPrompt(emotionValue); // Set the prompt immediately
                                  setContent('');
                              }} />
                              <Button text="Freeform" onPress={() => {setEntryType('freeform'); setIsAvatarVisible(true);}} />
                          </View>
                      )}
                  </View>)}

              {entryType && (
                  <View style={{ flex: 1, }}>
                      {/* Avatar and Prompt */}
                      <View style={styles.avatarAndPromptContainer}>
                      {isAvatarVisible && (

                          <RiveAnimation
                              source={require('../../../assets/animations/avatar_2.riv')}
                              artboardName="Artboard"
                              stateMachineName="State Machine 1"
                              style={styles.avatar}
                              ref={riveRef}
                              fit={Fit.FitHeight}
                          />)}
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
