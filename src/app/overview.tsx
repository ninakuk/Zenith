import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useTheme } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { Emotion, JournalEntry } from '../models/JournalEntry';
import { loadEntries } from '../helpers/fileSystemCRUD';
import EntryListItem from '../components/EntryListItem';
import { COLORS } from '../constants/Colors';
    
const INITIAL_DATE = '2022-07-06'
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
                return 'green';
            case 'Neutral':
                return 'blue';
            case 'Sad':
                return 'red';
            default:
                return 'gray';
        }
    };


    
const onDayPress = (day: { dateString: string }) => {
    
    setSelectedDate(day.dateString);
    console.log("date in selected date: ",selectedDate)
    
    //entries for that date
    const entriesForSelectedDate = entries.filter(entry => {
        const entryDate = entry.createdAt.toISOString().split('T')[0];
        return entryDate === day.dateString;
    });

    setFilteredEntries(entriesForSelectedDate);
};

    return (
        <View style={styles.container}>
            <Calendar
                markedDates={markedDates}
                enableSwipeMonths
                markingType={'multi-dot'}
                onDayPress={onDayPress}
                theme={{
                    selectedDayBackgroundColor: 'orange',
                    todayTextColor: colors.primary,
                    arrowColor: colors.text,
                    indicatorColor: "red"
                }}
            />

            {selectedDate && (
                <View style={styles.listContainer}>
                    <Text style={styles.dateText}>{`Entries for ${selectedDate}`}</Text>
                    <FlatList
                        data={filteredEntries}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ gap: 10, padding: 10 }}
                        contentInset={{ bottom: 130 }}
                        renderItem={({ item }) => <EntryListItem entry={item} />}
                    />
                </View>
            )}
        </View>
    );
};

const makeStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    listContainer: {
        //...StyleSheet.absoluteFillObject,
        backgroundColor: colors.card,
        opacity: 0.3,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderTopColor: colors.border,
        //borderTopWidth: 2,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
})