import { StyleSheet, Image, FlatList, View, Button, Text, ScrollView, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import EntryListItem from '@/src/components/EntryListItem';
import { deleteEntry, loadEntries, updateEntry } from '../../../helpers/fileSystemCRUD';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import Rive, { Fit, RiveRef } from 'rive-react-native';


export default function HomeScreen() {
  const [entries, setEntries] = useState<any[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current; // Create animated value

  const riveRef = useRef<RiveRef | null>(null);

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

  // Interpolating styles for the image and container based on scroll position
  const imageContainerHeight = scrollY.interpolate({
    inputRange: [0, 100], // Adjust these values to control the effect
    outputRange: [200, 100], // Start height and shrunk height
    extrapolate: 'clamp',
  });

  const imageHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 100], // Start image height and shrunk image height
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.main}>
      {/* Animated Container for avatar image */}
      {/* <Animated.View style={[styles.avatarImageContainer, { height: imageContainerHeight }]}>
        <Animated.Image
          source={require('../../../../assets/images/2024-09-08 11_54_50-Untitled.png')}
          style={[styles.image, { height: imageHeight }]} // Apply animated height to image
          resizeMode="contain"
        />
      </Animated.View> */}

      <Rive
      url="https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv"
      artboardName="Avatar 1"
      stateMachineName="avatar"
      autoplay={true}
      style={{width: 400, height: 400}}
      ref={riveRef}
      fit={Fit.FitHeight}
  />

      {/* List of Journal Entries */}
      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        contentInset={{ bottom: 130 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } // Set to true for better performance, but won't work with some styles
        )}
        renderItem={({ item }) => <EntryListItem entry={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'white',
    paddingBottom:100,
  },
  avatarImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    width: '100%',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 5,
    marginTop: 30
  },
});
