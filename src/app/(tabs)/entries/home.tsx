import { StyleSheet, Image, Animated, FlatList, View } from 'react-native';
import { useRef } from 'react';
import { journalEntries } from '@/assets/data/journalEntries';
import EntryListItem from '@/src/components/EntryListItem';

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Shrinking the container as you scroll
  const imageContainerHeight = scrollY.interpolate({
    inputRange: [0, 100],  // Adjust for how far you scroll
    outputRange: [250, 130], // Initial and shrunk container height
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.main}>
      {/* Animated Container for Image */}
      <Animated.View style={[styles.imageContainer, { height: imageContainerHeight }]}>
        <Image 
          source={require('../../../../assets/images/2024-09-08 11_54_50-Untitled.png')}
          style={styles.image}
          resizeMode="contain" // Ensures image scales proportionally
        />
      </Animated.View>

      {/* List of Journal Entries */}
      <Animated.FlatList
        data={journalEntries}
        contentContainerStyle={{ gap: 10, padding: 10}}
        contentInset={{ bottom: 130 }}
        renderItem={({ item }) => <EntryListItem entry={item} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor:'white'
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    width: '100%', 
  },
  image: {
    flex:1,
    width: '100%',  
    //maxWidth: 300, 
    height: '100%',
    aspectRatio: 1, 
    marginBottom: 5,
    marginTop: 30
  },
});
