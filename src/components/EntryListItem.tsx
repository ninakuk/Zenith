import { StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { Link } from 'expo-router';
import { JournalEntry } from '../models/JournalEntry';
import { useTheme } from '@react-navigation/native';
import { useMemo } from 'react';

type EntryListItemProps = {
    entry: JournalEntry,
};

const EntryListItem = ({entry} : EntryListItemProps) => {
  const colors = useTheme().colors;
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return(
    <Link href={`/entries/${entry.id}`} asChild>
    <Pressable style={styles.container}>
      
      {/* <Image source={{ uri: entry.image}} style={styles.image}></Image> */}
      <Text style={styles.title}>{entry.title} </Text>
      {/* <Text style={{fontStyle: 'italic', fontSize: 12,}}>valence: {entry.sentimentWord}</Text> */}

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.entryText} numberOfLines={4} ellipsizeMode='tail'>{entry.content}</Text>

    </Pressable>
    </Link>
  );
};

export default EntryListItem;


const makeStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderRadius: 20,
    backgroundColor: colors.card,
    padding: 10,
    paddingLeft: 30,
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
    paddingLeft: 10,
    marginVertical: 10,
  },
  entryText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingLeft: 10,

  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
    backgroundColor: colors.border
  },
});
