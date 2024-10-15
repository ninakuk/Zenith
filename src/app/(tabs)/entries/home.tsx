import { StyleSheet, FlatList, View, Button, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import EntryListItem from '@/src/components/EntryListItem';
import { deleteEntry, loadEntries } from '../../../helpers/fileSystemCRUD';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import Rive, { Fit, RiveRef } from 'rive-react-native';
import { Pressable, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RiveAnimation } from '@/src/components/RiveAnimation';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [entries, setEntries] = useState<any[]>([]);
  const riveRef = useRef<RiveRef | null>(null);
  //const [avatarSize, setAvatarSize] = useState(300); // Initial size of the avatar

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
  
  const handleAvatarEyePicker = (eyeOption: number) => {
    try {
      if (riveRef.current) {
        // Trigger the animation by its name or state
        riveRef.current?.setInputState('State Machine 1', 'EyeType', eyeOption);
      }
    } catch (error) {
      console.error("Error changing eye state:", error);
    }
  };

  const handleAvatarColorPicker = (colorOption: number) => {
    try {
      if (riveRef.current) {
        // Trigger the animation by its name or state
        riveRef.current?.setInputState('State Machine 1', 'BodyColor', colorOption);
      }
    } catch (error) {
      console.error("Error changing color state:", error);
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
      {/* Eye Selection Buttons 
      <View style={styles.buttonContainer}>
        <Text>Select Eye:</Text>
        {[0, 1, 2, 3].map((eyeOption) => (
          <TouchableOpacity key={eyeOption} onPress={() => handleAvatarEyePicker(eyeOption)}>
            <Text style={styles.button}>Eye {eyeOption}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Color Selection Buttons 
      <View style={styles.buttonContainer}>
        <Text>Select Color:</Text>
        {[1, 2, 3, 4].map((colorOption) => (
          <TouchableOpacity key={colorOption} onPress={() => handleAvatarColorPicker(colorOption)}>
            <Text style={styles.button}>Color {colorOption}</Text>
          </TouchableOpacity>
        ))}
      </View>*/}

      {/* List of Journal Entries */}
      <View style={{backgroundColor:"gray", borderTopLeftRadius:200, borderTopRightRadius:200}}>
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

const styles = StyleSheet.create({
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
    width: 150, // Match the width of the Rive animation
    height: 250, // Match the height of the Rive animation
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
    width: '100%', // Full width of the pressable
    height: '100%', // Full height of the pressable
    position: 'absolute', // Ensure the avatar is positioned inside the pressable
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    color: 'white',
    borderRadius: 5,
  },
});
