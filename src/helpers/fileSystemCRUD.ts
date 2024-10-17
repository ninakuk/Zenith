// src/services/journalService.ts
import * as FileSystem from 'expo-file-system';
import { Emotion, JournalEntry } from '../models/JournalEntry';
import { AvatarSettings } from '../models/Avatar';

const ENTRIES_FILE_PATH = `${FileSystem.documentDirectory}journalEntries.json`;
const AVATAR_SETTINGS_FILE_PATH = `${FileSystem.documentDirectory}avatarSettings.json`;

const defaultAvatarSettings: AvatarSettings = {
    name: 'Avatar',
    color: 1, // Default color
    eyeType: 0, // Default eye type
  };

export const loadAvatarSettings = async (): Promise<AvatarSettings | null> => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(AVATAR_SETTINGS_FILE_PATH);
        
        if (!fileInfo.exists) {
            await FileSystem.writeAsStringAsync(AVATAR_SETTINGS_FILE_PATH, JSON.stringify(defaultAvatarSettings));
            return defaultAvatarSettings;
        }

        const jsonString = await FileSystem.readAsStringAsync(AVATAR_SETTINGS_FILE_PATH);
        const avatarSettings = JSON.parse(jsonString) as AvatarSettings;
        return avatarSettings;

    } catch (error) {
        console.error('Error loading avatar settings:', error);
        throw error;
    }
};

// Avatar Settings: Save avatar settings
export const saveAvatarSettings = async (settings: AvatarSettings): Promise<void> => {
    try {
        await FileSystem.writeAsStringAsync(AVATAR_SETTINGS_FILE_PATH, JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving avatar settings:', error);
        throw error;
    }
};

// Avatar Settings: Update specific fields of avatar settings
export const updateAvatarSettings = async (updatedData: Partial<AvatarSettings>): Promise<void> => {
    try {
        const currentSettings = await loadAvatarSettings();
        
        if (currentSettings) {
            const updatedSettings = { ...currentSettings, ...updatedData };
            await saveAvatarSettings(updatedSettings);
        } else {
            console.error("No avatar settings found to update.");
        }
    } catch (error) {
        console.error('Error updating avatar settings:', error);
        throw error;
    }
};
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
export const createEntry = async (
    title: string, 
    content: string, 
    sentimentScore: number, 
    sentimentWord: Emotion, 
    emotionSliderScore: number, 
    emotionSliderWord: Emotion,
    selectedPrompt: string,
    createdAt: Date,

): Promise<void> => {
    const newEntry: JournalEntry = {
        id: Date.now().toString(), //generate an ID
        title: title,
        content: content,
        sentimentScore: sentimentScore,  
        sentimentWord: sentimentWord,  
        emotionSliderScore: emotionSliderScore, 
        emotionSliderWord: emotionSliderWord, 
        selectedPrompt: selectedPrompt,
        createdAt: createdAt,
    };

    const entries = await loadEntries(); // Load existing entries
    entries.push(newEntry); // Add the new entry to the list

    console.log(newEntry)
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
