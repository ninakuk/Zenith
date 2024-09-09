import { StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { Entry } from '../types';
import { Link } from 'expo-router';

type EntryListItemProps = {
    entry: Entry,
};

const EntryListItem = ({entry} : EntryListItemProps) => {
  return(
    <Link href={`/entries/${entry.id}`} asChild>
    <Pressable style={styles.container}>
      
      <Image source={{ uri: entry.image}} style={styles.image}></Image>
      <Text style={styles.title}>{entry.title}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.entryText} numberOfLines={4} ellipsizeMode='tail'>{entry.entry_text}</Text>

    </Pressable>
    </Link>
  );
};

export default EntryListItem;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#B3EBF2',
    padding: 20,
    margin:10,
  },
  image: {
    width: '50%',
    aspectRatio:1,
    margin:10,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  entryText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
