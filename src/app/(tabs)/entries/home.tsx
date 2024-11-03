import { StyleSheet, FlatList, View, Button, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import EntryListItem from '@/src/components/EntryListItem';
import { deleteEntry, loadAvatarSettings, loadEntries, saveAvatarSettings } from '../../../helpers/fileSystemCRUD';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import Rive, { Fit, RiveRef } from 'rive-react-native';
import { Pressable, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RiveAnimation } from '@/src/components/RiveAnimation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAvatar } from '@/src/context/AvatarContext';
import { useTheme } from '@react-navigation/native';
import { JournalEntry } from '@/src/models/JournalEntry';
import ModalScreen from '../../modal';
import { getRandomPrompt } from '@/src/models/Prompts';

export default function HomeScreen() {

  const colors = useTheme().colors;
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [greetingPrompt, setGreetingPrompt] = useState('');


  const [entries, setEntries] = useState<JournalEntry[]>([]);
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

    const initialGreeting = getRandomPrompt(10);
    setGreetingPrompt(initialGreeting);

  }, [color, eyeType]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchEntries = async () => {
        const loadedEntries = await loadEntries();
        //sort by createAt date in decending
        const sortedEntries = loadedEntries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by createdAt

        setEntries(sortedEntries);
      };

      fetchEntries();
    }, [])
  );

  const handleDeleteEntry = async (id: string) => {
    await deleteEntry(id);
    const updatedEntries = await loadEntries(); // Re-fetch entries after deletion
    setEntries(updatedEntries);
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

        //console.log("counter",currentSettings.interactionCounter)
        // Save the updated settings
        await saveAvatarSettings(updatedSettings);

      }
     } catch (error) {
        console.error("Error triggering touch animation or saving interaction count:", error);
      }
    };

    return (
      <SafeAreaView style={styles.main}>
        {/* List with Avatar in Header */}
        <View style={styles.avatarContainer}>
          {/* Limit touchable area to avatar */}

          <RiveAnimation
            source={require('../../../../assets/animations/avatar_2.riv')}
            artboardName="Artboard"
            stateMachineName="State Machine 1"
            style={styles.avatar}
            ref={riveRef}
            fit={Fit.FitHeight}
          />
          <Pressable
            onPress={handleAvatarTouch}
            style={styles.pressableAvatar}
          >
          </Pressable>
          
          {/* <Text style={styles.text}>{name}</Text> */}
          <Text style={styles.greetingText}>{greetingPrompt}</Text>

        </View>

        {/* List of Journal Entries */}
        <View style={styles.outerListContainer}>
          <View style={styles.listContainer} />
          <FlatList
            data={entries}
            keyExtractor={item => item.id}
            contentContainerStyle={{ gap: 10, padding: 10 }}
            contentInset={{ bottom: 130 }}
            renderItem={({ item }) => <EntryListItem entry={item} />}
          />
        </View>

      </SafeAreaView>
    );
  }

  const makeStyles = (colors: any) => StyleSheet.create({
    main: {
      backgroundColor: colors.background,
      flex: 1,
    },
    pressableAvatar: {
      width: 150,
      height: 250,
      justifyContent: 'center',
      alignItems: 'center',
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
    listContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.card,
      opacity: 0.3,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      borderTopColor: colors.border,
      //borderTopWidth: 2,
    },
    outerListContainer: {
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      overflow: "hidden",
      flex: 1,
    },
    text: {
      //margin:20,
      fontSize: 16,
      marginTop: 20,
      marginBottom: 15,
      fontWeight: "bold"
    },
    greetingText: {
      fontSize: 16,
      color: colors.text,
      margin: 15,
    },
  });


