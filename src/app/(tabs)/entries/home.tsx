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

export default function HomeScreen() {

  const colors = useTheme().colors;
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [entries, setEntries] = useState<any[]>([]);
  const riveRef = useRef<RiveRef | null>(null);
  const { name, color, eyeType, setName, setColor, setEyeType } = useAvatar();
  //const [avatarSize, setAvatarSize] = useState(300); // Initial size of the avatar

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
  }, [color, eyeType]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchEntries = async () => {
        const loadedEntries = await loadEntries();
        setEntries(loadedEntries);
      };

      fetchEntries();
    }, [])
  );

  const handleDeleteEntry = async (id: string) => {
    await deleteEntry(id);
    const updatedEntries = await loadEntries(); // Re-fetch entries after deletion
    setEntries(updatedEntries);
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

  // const onScroll = (event: any) => {
  //   const scrollY = event.nativeEvent.contentOffset.y;
  //   const newSize = Math.max(100, 300 - scrollY / 2); // Shrink avatar size with scroll
  //   setAvatarSize(newSize);
  // };

  return (
    <SafeAreaView style={styles.main}>
      {/* List with Avatar in Header */}
      <View style={styles.avatarContainer}>
        {/* Limit touchable area to avatar */}
        <Text>Name</Text>

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
      </View>


      {/* List of Journal Entries */}
      <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
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
    backgroundColor: 'white',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  pressableAvatar: {
    width: 150, 
    height: 250, 
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor:"red"
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    //padding: 10,
    backgroundColor: 'white',
    width: '100%',
    //paddingVertical:20,
  },
  avatar: {
    width: '100%', 
    height: '100%', 
    position: 'absolute', 
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    color: 'white',
    borderRadius: 5,
  },
  listContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.card,
    opacity: 0.2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  }
});


