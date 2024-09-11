// src/services/journalService.ts
import * as FileSystem from 'expo-file-system';
import { JournalEntry } from '../models/JournalEntry';

const ENTRIES_FILE_PATH = `${FileSystem.documentDirectory}journalEntries.json`;

// Load all journal entries
export const loadEntries = async (): Promise<JournalEntry[]> => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(ENTRIES_FILE_PATH);
        
        if (!fileInfo.exists) {
            await FileSystem.writeAsStringAsync(ENTRIES_FILE_PATH, '[]');
            return [];
        }

        const jsonString = await FileSystem.readAsStringAsync(ENTRIES_FILE_PATH);
        const entries = JSON.parse(jsonString) as JournalEntry[];

        console.log('Journal Entries:', entries); // Log the entries to the console
        return entries;  // Use the model here
    } catch (error) {
        console.error('Error loading journal entries:', error);
        throw error;
    }
};

// Fetch a single journal entry by ID
export const fetchEntryById = async (id: string): Promise<JournalEntry | null> => {
    const entries = await loadEntries(); // Load all entries
    const entry = entries.find(e => e.id === id); // Find the entry by ID
    return entry || null; // Return the entry or null if not found
};

// Create a new journal entry
export const createEntry = async (title: string, content: string, valence: string): Promise<void> => {
    const newEntry: JournalEntry = {
        id: Date.now().toString(), // Generate a unique ID
        title: title,
        content: content,
        valence: valence,
        //createdAt: new Date().toISOString(), // Optional field for the creation date
    };

    const entries = await loadEntries();
    entries.push(newEntry); // Add the new entry to the list

    await FileSystem.writeAsStringAsync(ENTRIES_FILE_PATH, JSON.stringify(entries)); // Save the updated list
};

// Update an existing journal entry
export const updateEntry = async (id: string, updatedData: Partial<JournalEntry>): Promise<void> => {
    const entries = await loadEntries();
    const index = entries.findIndex(entry => entry.id === id);

    if (index !== -1) {
        const updatedEntry = { ...entries[index], ...updatedData }; // Merge existing entry with updated data
        entries[index] = updatedEntry; // Update the entry in the array

        await FileSystem.writeAsStringAsync(ENTRIES_FILE_PATH, JSON.stringify(entries)); // Save the updated list
    } else {
        console.error(`Entry with id ${id} not found.`);
    }
};

// Delete a journal entry
export const deleteEntry = async (id: string): Promise<void> => {
    const entries = await loadEntries();
    const updatedEntries = entries.filter(entry => entry.id !== id); // Filter out the entry to delete

    await FileSystem.writeAsStringAsync(ENTRIES_FILE_PATH, JSON.stringify(updatedEntries)); // Save the updated list
};
