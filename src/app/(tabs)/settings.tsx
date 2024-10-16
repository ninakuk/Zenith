import { Pressable, StyleSheet, TextInput } from 'react-native';
import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import { RiveAnimation } from '@/src/components/RiveAnimation';
import { useEffect, useRef, useState } from 'react';
import Rive, { Fit, RiveRef } from 'rive-react-native';
import { loadAvatarSettings, updateAvatarSettings } from '@/src/helpers/fileSystemCRUD';
import { useAvatar } from '@/src/context/AvatarContext';

export default function SettingsScreen() {
  const riveRef = useRef<RiveRef | null>(null);
  const { name, color, eyeType, setName, setColor, setEyeType } = useAvatar();

  useEffect(() => {
    // Load the avatar settings when the component mounts
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
  }, [setName, setColor, setEyeType]);

  const handleAvatarEyePicker = (eyeOption: number) => {
    setEyeType(eyeOption);
    updateAvatarSettings({ eyeType: eyeOption });
    if (riveRef.current) {
      riveRef.current?.setInputState('State Machine 1', 'EyeType', eyeOption);
    }
  };

  const handleAvatarColorPicker = (colorOption: number) => {
    setColor(colorOption);
    updateAvatarSettings({ color: colorOption });
    if (riveRef.current) {
      riveRef.current?.setInputState('State Machine 1', 'BodyColor', colorOption);
    }
  };

  const handleNameChange = (inputName: string) => {
    setName(inputName);
    updateAvatarSettings({ name: inputName });
  };

  const handleAvatarTouch = () => {
    try {
      if (riveRef.current) {
        // Trigger the animation by its name or state
        riveRef.current?.setInputState('State Machine 1', 'StartTouch', true);
      }
    } catch (error) {
      console.error("Error triggering touch animation:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Customise Your Avatar ! </Text>


      {/* Avatar Name Input */}
      <View>
        <TextInput
          //style={styles.input}
          value={name}
          onChangeText={handleNameChange}
          placeholder="Enter avatar name"
        />
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <RiveAnimation
          source={require('../../../assets/animations/avatar_2.riv')}
          artboardName="Artboard"
          stateMachineName="State Machine 1"
          style={styles.avatar}
          ref={riveRef}
          fit={Fit.FitHeight}
        />
        <Pressable
          onPress={handleAvatarTouch}
          style={styles.pressableAvatar}
        ></Pressable>
      </View>

      {/* Eye Selection Buttons */}
      <View style={styles.buttonContainer}>
        <Text>Select Eye Type:</Text>
        {[0, 1, 2, 3].map((eyeOption) => (
          <Pressable
            key={eyeOption}
            onPress={() => handleAvatarEyePicker(eyeOption)}
            style={[
              styles.button,
              eyeType === eyeOption && styles.selectedButton // Apply selected style if this option is chosen
            ]}
          >
            <Text style={eyeType === eyeOption ? styles.selectedText : styles.buttonText}>
              Eye {eyeOption}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Color Selection Buttons */}
      <View style={styles.buttonContainer}>
        <Text>Select Body Color:</Text>
        {[1, 2, 3, 4].map((colorOption) => (
          <Pressable
            key={colorOption}
            onPress={() => handleAvatarColorPicker(colorOption)}
            style={[
              styles.button,
              color === colorOption && styles.selectedButton // Apply selected style if this option is chosen
            ]}
          >
            <Text style={color === colorOption ? styles.selectedText : styles.buttonText}>
              Color {colorOption}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
  },
  avatar: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  pressableAvatar: {
    width: 150,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    color: 'white',
    borderRadius: 5,
  },
  buttonText: {
    color: '#333',
  },
  selectedButton: {
    backgroundColor: '#87CEFA', // Highlight color for selected option
    borderColor: '#1E90FF',
  },
  selectedText: {
    color: '#fff',
  },
});
