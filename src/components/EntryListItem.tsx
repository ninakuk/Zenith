import { StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { Link } from 'expo-router';
import { JournalEntry } from '../models/JournalEntry';
import { useTheme } from '@react-navigation/native';
import { useMemo } from 'react';

type EntryListItemProps = {
  entry: JournalEntry,
};

const EntryListItem = ({ entry }: EntryListItemProps) => {
  const colors = useTheme().colors;
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const formatDate = (date: Date | string) => {
    const formattedDate = typeof date === 'string' ? new Date(date) : date;

    // Check if the date is valid
    if (isNaN(formattedDate.getTime())) {
      return "Unknown Date"; // Fallback text if the date is invalid
    }

    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(formattedDate);
  };

  return (
    <Link href={`/entries/${entry.id}`} asChild>
      <Pressable style={styles.container}>

        {/* <Image source={{ uri: entry.image}} style={styles.image}></Image> */}
        <Text style={styles.title}>{entry.title} </Text>
        <Text style={styles.dataText}>{formatDate(entry.createdAt)}</Text>
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
    margin: 10,
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  entryText: {
    fontSize: 18,
    marginVertical: 10,
    paddingRight:10,
  },
  dataText: {
    fontSize: 14,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '90%',
    backgroundColor: colors.border
  },
});
