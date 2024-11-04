import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableWithoutFeedback, Keyboard, Modal, Alert, Pressable } from 'react-native';
import { createEntry } from '../../helpers/fileSystemCRUD';
import Button from '../../components/Button';
import { useFocusEffect, useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { analyzeSentiment } from '../../helpers/sentiment';
import { getRandomPrompt } from '../../models/Prompts';
import { useTheme } from '@react-navigation/native';
import { Fit, RiveRef } from 'rive-react-native';
import { RiveAnimation } from '../../components/RiveAnimation';
import { useAvatar } from '../../context/AvatarContext';
import EntryModal from '@/src/components/EntryModal';

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

const AddEntry: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emotionValue, setEmotionValue] = useState(0);
  const [sliderTouched, setSliderTouched] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const [entryType, setEntryType] = useState<'emotion' | 'freeform' | null>(null);
  const isEmotionEntry = (entryType === 'emotion');
  const [isModalVisible, setModalVisible] = useState(false);


  const [isTyping, setIsTyping] = useState(false);
  const selectedPromptRef = useRef<string>("null");
  const { color, eyeType } = useAvatar();

  const router = useRouter();

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

  //TODO check if this duplicates the prompt
  useEffect(() => {
    if (entryType === 'emotion' && !selectedPromptRef.current) {
      selectedPromptRef.current = getRandomPrompt(emotionValue);
    }
  }, [emotionValue, entryType]);

  useEffect(() => {
    //animate the opacity when sliderTouched changes
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000, 
        useNativeDriver: true,
      }).start();
  }, [sliderTouched, opacityAnim]);


  //load the avatar settings when the component mounts
  useEffect(() => {
    const fetchAvatarSettings = async () => {
      try {
        if(riveRef.current){
        await new Promise(resolve => setTimeout(resolve, 100));
          if (color !== null) riveRef.current.setInputState('State Machine 1', 'BodyColor', color);
          if (eyeType !== null) riveRef.current.setInputState('State Machine 1', 'EyeType', eyeType);
        }
      } catch (error) {
        console.error('Error loading avatar settings:', error);
      }
    };

    fetchAvatarSettings();
  }, [color, eyeType, isModalVisible]);

  const handleAvatarTouch = () => {
    try {
      if (riveRef.current) {
        riveRef.current?.setInputState('State Machine 1', 'StartTouch', true);
      }
    } catch (error) {
      console.error("Error triggering touch animation:", error);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

      <ScrollView style={[{ flexGrow: 1 }, styles.container]}>

        <View style={{ flex: 1 }}>
          <View style={styles.avatarAndPromptContainer}>
            <RiveAnimation
              source={require('../../../assets/animations/avatar_2.riv')}
              artboardName="Artboard"
              stateMachineName="State Machine 1"
              style={styles.avatar}
              ref={riveRef}
              fit={Fit.FitHeight}
            />

            <Animated.Text style={[styles.promptText, { opacity: opacityAnim }]}>
              {sliderTouched
                ? "Do you need some inspiration, or just wish to write freely?"
                : "How are you feeling today?"}
            </Animated.Text>

          </View>

          {/* Slider for emotion input */}
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
            <View style={{ flexDirection: "row", marginTop: 20, }}>

              <Button text="Help me reflect" onPress={() => {
                setEntryType('emotion');
                setModalVisible(true);
                selectedPromptRef.current = getRandomPrompt(emotionValue);
                setContent('');
              }} />

              <Button text="Write freely" onPress={() => {
                setEntryType('freeform'); setModalVisible(true);
              }} />

            </View>
          )}

        </View>


        {entryType && (
          <EntryModal
            isModalVisible={isModalVisible}
            key={isModalVisible ? 'visible' : 'hidden'}
            entryType={entryType}
            isEmotionEntry={isEmotionEntry}
            onClose={toggleModal}
            prompt={selectedPromptRef.current}
            emotionValue={emotionValue}
          />

        )}
      </ScrollView>
    </TouchableWithoutFeedback >

  );
};

export default AddEntry;

const makeStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarAndPromptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 200,
    marginBottom: 10,
  },
  avatarAndPromptContainerModal: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 150,
    marginBottom: 10
  },
  promptText: {
    fontSize: 18,
    flexShrink: 1,
    width: '60%',
    fontWeight:"bold"
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
    width: '40%',
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
