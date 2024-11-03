import { ActivityIndicator, Alert, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { RiveAnimation } from '@/src/components/RiveAnimation';
import { useEffect, useMemo, useRef, useState } from 'react';
import Rive, { Fit, RiveRef } from 'rive-react-native';
import { loadAvatarSettings, loadEntries, saveAvatarSettings, updateAvatarSettings } from '@/src/helpers/fileSystemCRUD';
import { useAvatar } from '@/src/context/AvatarContext';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

//TODO: add info about study

const ids = [
  "12345",
  "58740",
  "20176",
  "76435",
  "91852",
  "47061",
  "83674",
  "39205",
  "14839",
  "27560",
  "60384",
  "95472",
  "18267",
  "43715",
  "68092",
  "52984",
  "79120",
  "41635",
  "20497",
  "83714",
  "61038",
  "42579",
  "59301",
  "78026",
  "35894"
];

export default function SettingsScreen() {
  const colors = useTheme().colors;
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [journalId, setJournalId] = useState<string>('');
  const [validIds, setValidIds] = useState<string[]>(ids);
  const isValidId = validIds.includes(journalId);
  const [loading, setLoading] = useState(false)
  const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbylsXberqgbO-Xfsu5STPJznZNzTv1lMnHp0YyfOC6K2eDOtCwcA5yxxA5btuig2__W3w/exec';

  const riveRef = useRef<RiveRef | null>(null);
  const { name, color, eyeType, setName, setColor, setEyeType } = useAvatar();

  const [isCustomising, setIsCustomising] = useState<boolean>(false);

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
  }, [setName, setColor, setEyeType]);

  const handleAvatarEyePicker = (eyeOption: number) => {
    setEyeType(eyeOption);
    updateAvatarSettings({ eyeType: eyeOption });
    setIsCustomising(true)
    if (riveRef.current) {
      riveRef.current?.setInputState('State Machine 1', 'EyeType', eyeOption);
    }
  };

  const handleAvatarColorPicker = (colorOption: number) => {
    setColor(colorOption);
    updateAvatarSettings({ color: colorOption });
    setIsCustomising(true)

    if (riveRef.current) {
      riveRef.current?.setInputState('State Machine 1', 'BodyColor', colorOption);
    }
  };

  const handleNameChange = (inputName: string) => {
    setName(inputName);
    updateAvatarSettings({ name: inputName });
    setIsCustomising(true)

  };

  const handleAvatarSave = async () => {
    try {
      // Load current settings
      const currentSettings = await loadAvatarSettings();

      if (currentSettings) {
        //increment customization count
        const updatedSettings = {
          ...currentSettings,
          customisationCount: currentSettings.customisationCount + 1
        };

        // Save the updated settings
        await saveAvatarSettings(updatedSettings);
        setIsCustomising(false)
      } else {
        console.error('No avatar settings found to save.');
      }
    } catch (error) {
      console.error('Error saving avatar:', error);
    }
  };

  const handleAvatarTouch = async () => {
    try {
      //trigger animation
      if (riveRef.current) {
        riveRef.current?.setInputState('State Machine 1', 'StartTouch', true);
      }

      //load current settings
      const currentSettings = await loadAvatarSettings();

      if (currentSettings) {
        //increment interaction count
        const updatedSettings = {
          ...currentSettings,
          interactionCounter: (currentSettings.interactionCounter || 0) + 1
        };

        // Save the updated settings
        await saveAvatarSettings(updatedSettings);

      }
    } catch (error) {
      console.error("Error triggering touch animation or saving interaction count:", error);
    }
  };


  const getColorForOption = (colorOption: number) => {
    switch (colorOption) {
      case 1:
        return '#F69176';
      case 2:
        return '#B4FF7B';
      case 3:
        return '#76C7F6';
      case 4:
        return '#FFD855';
      default:
        return '#EBCBB0';
    }
  };

  const handleSendData = async () => {
    try {
      if (!journalId) {
        Alert.alert('Enter User ID', 'Please enter your assigned User ID before sending the data.');
        return;
      }

      if (!isValidId) {
        Alert.alert('Invalid User ID', 'The User ID entered is not valid. Please check and try again.');
        return;
      }
      setLoading(true);

      const allEntries = await loadEntries();
      const avatarSettings = await loadAvatarSettings();

      const bodyData = {
        userId: journalId,
        entries: allEntries.map(entry => ({
          id: entry.id,
          sentimentScore: entry.sentimentScore,
          sentimentWord: entry.sentimentWord,
          emotionSliderScore: entry.emotionSliderScore,
          emotionSliderWord: entry.emotionSliderWord,
          selectedPrompt: entry.selectedPrompt,
          createdAt: entry.createdAt,
          isEmotionEntry: entry.isEmotionEntry,
          sentimentHappyW: entry.sentimentHappyW,
          sentimentSadW: entry.sentimentSadW,
          sentimentAllW: entry.sentimentAllW,
        })),
        avatarSettings: {
          name: avatarSettings.name,
          color: avatarSettings.color,
          eyeType: avatarSettings.eyeType,
          customisationCount: avatarSettings.customisationCount,
          interactionCounter: avatarSettings.interactionCounter,
        }
      };

      const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      const result = await response.text(); // Get the response as text for better debugging

      if (response.ok) {
        Alert.alert('Success', 'Data has been successfully sent!');
      } else {
        console.error('Google Sheets response error:', result);
        Alert.alert('Error', 'Failed to send data. Please try again.');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      Alert.alert('Error', 'Failed to send data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
          />
        </View>

        {/* Eye Selection Buttons */}
        <Text style={{ marginVertical: 10, marginLeft: 10 }}>Select Eye Type:</Text>
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
                Option {eyeOption + 1}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Color Selection Buttons */}
        <Text style={{ marginVertical: 10, marginLeft: 10 }}>Select Body Color:</Text>
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
            />
          ))}
        </View>

        <Pressable onPress={handleAvatarSave} style={[styles.button, !isCustomising && styles.disabledButton]} disabled={!isCustomising}>
          <Text style={styles.buttonText}>Save Avatar</Text>
        </Pressable>

        {/* Data sending */}
        <View style={styles.separator} />

        <Text style={{ fontSize:16 ,marginVertical: 10, marginLeft: 10 }}>At the end of the week long testing period, please press the below 'Send Data' button</Text>
        <Text style={{ fontSize:16, marginVertical: 10, marginLeft: 10 }}>All your journal entries and personal information stay completely private and are <Text style={{ fontWeight: 'bold' }}>NOT</Text> sent as data, or ever leave your device.</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your User ID"
          value={journalId}
          onChangeText={setJournalId}
          keyboardType='numeric'
        />
        <Pressable style={styles.button} onPress={handleSendData} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.text} />
          ) : (
            <Text style={styles.buttonText}>Send Data</Text>
          )}
        </Pressable>

      </ScrollView>
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
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: colors.text,
  },
  disabledButton: {
    opacity: 0.5
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
  text: {
    marginLeft: 10,
    fontSize: 16,
    marginTop: 10,
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
