import { StyleSheet, FlatList, View, Button, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import EntryListItem from '@/src/components/EntryListItem';
import { deleteEntry, loadAvatarSettings, loadEntries } from '../../../helpers/fileSystemCRUD';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import Rive, { Fit, RiveRef } from 'rive-react-native';
import { Pressable, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RiveAnimation } from '@/src/components/RiveAnimation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAvatar } from '@/src/context/AvatarContext';
import { useTheme } from '@react-navigation/native';
import { JournalEntry } from '@/src/models/JournalEntry';

export default function HomeScreen() {

  const colors = useTheme().colors;
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const riveRef = useRef<RiveRef | null>(null);
  const { name, color, eyeType, setName, setColor, setEyeType } = useAvatar();
  //const [avatarSize, setAvatarSize] = useState(300); // Initial size of the avatar

  useEffect(() => {
    // Load the avatar settings when the component mounts
    const fetchAvatarSettings = async () => {
      try {
        if (riveRef.current) {
          console.log('riveref:', riveRef.current)
          if (color !== null) riveRef.current.setInputState('State Machine 1', 'BodyColor', color);
          if (eyeType !== null) riveRef.current.setInputState('State Machine 1', 'EyeType', eyeType);
        }else{
          console.log('rive ref not ready')
        }
      } catch (error) {
        console.error('Error loading avatar settings:', error);
      }
    };

    fetchAvatarSettings();
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

  const handleAvatarTouch = () => {
    try {
      if (riveRef.current) {
        riveRef.current?.setInputState('State Machine 1', 'StartTouch', true);
      }
    } catch (error) {
      console.error("Error triggering touch animation:", error);
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
        //activeOpacity={1} // Makes the touchable area respond to touches only within the avatar
        >
        </Pressable>
        <Text style={styles.text}>{name}</Text>

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
  text:{
    //margin:20,
    fontSize: 16,
    marginTop:20,
    marginBottom:15,
    fontWeight: "bold"
  },
});


