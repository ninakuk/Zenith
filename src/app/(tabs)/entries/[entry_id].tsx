import { StyleSheet, Text, View , Image, Pressable, ScrollView} from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { journalEntries } from '@/assets/data/journalEntries';
import Button from '@/src/components/Button';

//TODO make emotions be part of entry object, not jus added here
const emotions = ['sad', 'happy', 'neutral']

export default function EntryDetailScreen() {
  const { entry_id } = useLocalSearchParams();

  const [selectedEmotion, setSelectedEmotion] = useState('happy');

  const entry = journalEntries.find((e) => e.id === entry_id);
  const saveEntry = () => {
    console.log("saved entry")
  }

  if(!entry) {
    return <Text>Entry not found</Text>
  }

  return (
    <ScrollView>
      <Stack.Screen options={{ title: entry.title}}/>
      <Image source={{uri: entry.image}} style={styles.image} />
      <Text>Entry text :</Text>
      <Text>{entry.entry_text}</Text>

      <Text>Emotions: </Text>
      <View style={styles.emotions}>
        {emotions.map((emotion => (
          <Pressable onPress={() => {setSelectedEmotion(emotion)}} style={[styles.emotion,{backgroundColor: selectedEmotion === emotion ? '#B3EBF2' : '#779ca1'} ]} key={emotion}>
          <Text style={[styles.emotionText, {color: selectedEmotion === emotion ? 'black': '#becbcc'}]}>{emotion}</Text>
          </Pressable>
        )))}
      </View>

      <Button onPress={saveEntry} text="Save entry"></Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  image: {
    width: '50%',
    aspectRatio:1,
    margin:10,
  },
  emotions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    

  },
  emotion: {
    backgroundColor: '#B3EBF2',
    width:80,
    aspectRatio:1,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emotionText: {
    fontSize: 20,
  }

})