import { Pressable, StyleSheet, TextInput } from 'react-native';
import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import { RiveAnimation } from '@/src/components/RiveAnimation';
import { useEffect, useMemo, useRef, useState } from 'react';
import Rive, { Fit, RiveRef } from 'rive-react-native';
import { loadAvatarSettings, updateAvatarSettings } from '@/src/helpers/fileSystemCRUD';
import { useAvatar } from '@/src/context/AvatarContext';
import Colors from '@/src/constants/Colors';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';


//TODO: make cuttons pretty
//TODO: add info about study
//TODO: add button to export data

export default function SettingsScreen() {
  const colors = useTheme().colors;
  const styles = useMemo(() => makeStyles(colors), [colors]);

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

  const getColorForOption = (colorOption: number) => {
    switch (colorOption) {
      case 1:
        return '#F69176'; // Example color (red)
      case 2:
        return '#B4FF7B'; // Example color (green)
      case 3:
        return '#76C7F6'; // Example color (blue)
      case 4:
        return '#FFD855'; // Example color (pink)
      default:
        return '#FFFFFF'; // Default color (white)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}> Customise Your Avatar ! </Text>
      <View style={styles.separator} />



      {/* Avatar Name Input */}
      <View>
        <Text style={styles.text}>Name: </Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={handleNameChange}
          placeholder="Enter the avatars name"
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
      <Text style={{marginVertical:10, marginLeft:10}}>Select Eye Type:</Text>
      <View style={styles.buttonContainer}>
        
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
              Option {eyeOption+1}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Color Selection Buttons */}
      <Text style={{marginVertical:10, marginLeft:10}}>Select Body Color:</Text>
      <View style={styles.buttonContainer}>
        {[1, 2, 3, 4].map((colorOption) => (
          <Pressable
            key={colorOption}
            onPress={() => handleAvatarColorPicker(colorOption)}
            style={[
              styles.colorCircle,
              color === colorOption && styles.selectedColorCircle,
              { backgroundColor: getColorForOption(colorOption) },
            ]}
          >
            {/* <Text style={color === colorOption ? styles.selectedText : styles.buttonText}>
              Color {colorOption.valueOf()}
            </Text> */}
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
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
    backgroundColor: colors.card,
    padding: 14,
    alignItems: 'center',
    borderRadius: 100,
    marginVertical: 5,
    flex:1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: colors.text,
  },
  selectedButton: {
    backgroundColor: colors.border,
    borderColor: colors.text,
    borderWidth: 2,          
  },
  selectedText: {
    color: colors.text,
  },
  input: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: colors.text,
    margin: 10,
    //width: '70%'
},
text:{
  marginLeft:10,
  fontSize: 16,
  marginTop:10,
  fontWeight: "bold"
},
separator: {
  marginVertical: 20,
  height: 1,
  width: '100%',
  backgroundColor: colors.border
},

colorCircle: {
  width: 40,               
  height: 40,              
  borderRadius: 20,        
  borderWidth: 2,          
  borderColor: '#FFFFFF',  
  justifyContent: 'center',
  alignItems: 'center',
  marginHorizontal: 10,
},
selectedColorCircle: {
  borderColor: colors.text,  
  borderWidth: 3,          
},
});
