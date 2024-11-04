import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useTheme } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { Emotion, JournalEntry } from '../models/JournalEntry';
import { loadEntries } from '../helpers/fileSystemCRUD';
import EntryListItem from '../components/EntryListItem';
import { COLORS } from '../constants/Colors';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
    
const INITIAL_DATE = new Date().toISOString().split('T')[0];

export default function Overview() {
    const colors = useTheme().colors;
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [selectedDate, setSelectedDate] =useState(INITIAL_DATE);
    const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);


    useEffect(() => {
        const fetchEntries = async () => {
            const loadedEntries = await loadEntries();

            const entriesWithDate = loadedEntries.map(entry => ({
                ...entry,
                createdAt: typeof entry.createdAt === 'string' ? new Date(entry.createdAt) : entry.createdAt
            }));

            setEntries(entriesWithDate);

            const marked: { [key: string]: any } = {};

            entriesWithDate.forEach(entry => {
                const entryDate = entry.createdAt.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format

                if (!marked[entryDate]) {
                    marked[entryDate] = {
                        marked: true,
                        dots: [],
                    };
                }

                marked[entryDate].dots.push({
                    color: entry.emotionSliderWord ? getEmotionColor(entry.emotionSliderWord) : 'defaultColor',
                    key: entry.id,
                });
            });

            setMarkedDates(marked);
        };

        fetchEntries();
    }, []);

    const getEmotionColor = (emotion: Emotion) => {
        switch (emotion) {
            case 'Happy':
                return '#FFD855';
            case 'Neutral':
                return 'gray';
            case 'Sad':
                return '#76C7F6';
            default:
                return '#EBCBB0';
        }
    };


    
const onDayPress = (day: { dateString: string }) => {
    
    setSelectedDate(day.dateString);
    //console.log("date in selected date: ",selectedDate)
    
    //entries for that date
    const entriesForSelectedDate = entries.filter(entry => {
        const entryDate = entry.createdAt.toISOString().split('T')[0];
        return entryDate === day.dateString;
    });

    setFilteredEntries(entriesForSelectedDate);

     const updatedMarkedDates = {
        ...markedDates, // Keep all existing marked dates
        [selectedDate]: { // Unmark the previous selected date
            ...markedDates[selectedDate],
            selected: false,
        },
        //selected day
        [day.dateString]: { 
            ...markedDates[day.dateString],
            selected: true,
            selectedColor: colors.card,
            selectedTextColor: colors.text
        },
    };

    setMarkedDates(updatedMarkedDates);
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
};

    return (
        <SafeAreaView style={styles.container}>
            <Calendar
                markedDates={markedDates}
                enableSwipeMonths
                markingType={'multi-dot'}
                onDayPress={onDayPress}
                theme={{
                    selectedDayBackgroundColor: colors.primary,
                    todayTextColor: colors.primary,
                    arrowColor: colors.text,
                    selectedDayTextColor: colors.text
                }}
            />

            {selectedDate && (
                <View style={{flex:1}}>
                    <View style={styles.separator} />
                    <Text style={styles.dateText}>{`Journal entries on ${formatDate(selectedDate)}`}</Text>
                    <FlatList
                        data={filteredEntries}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ gap: 10 }}
                        contentInset={{ bottom: 10 }}
                        renderItem={({ item }) => <EntryListItem entry={item} />}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

const makeStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: colors.background,
    },
    listContainer: {
        //...StyleSheet.absoluteFillObject,
        backgroundColor: colors.card,
        opacity: 1,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderTopColor: colors.border,
        //borderTopWidth: 2,
    },
    dateText: {
        fontSize: 18,
        //fontWeight: 'bold',
        marginBottom: 10,
        color: colors.text
    },
    separator: {
        marginVertical: 20,
        height: 1,
        width: '100%',
        backgroundColor: colors.border
      },
})