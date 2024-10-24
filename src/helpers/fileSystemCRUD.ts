// src/services/journalService.ts
import * as FileSystem from 'expo-file-system';
import { Emotion, JournalEntry } from '../models/JournalEntry';
import { AvatarSettings } from '../models/Avatar';

const ENTRIES_FILE_PATH = `${FileSystem.documentDirectory}journalEntries.json`;
const AVATAR_SETTINGS_FILE_PATH = `${FileSystem.documentDirectory}avatarSettings.json`;

// AVATAR

const defaultAvatarSettings: AvatarSettings = {
    name: 'Avatar',
    color: 1,
    eyeType: 0,
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



// JOURNAL ENTRIES CRUD

//load all journal entries
export const loadEntries = async (): Promise<JournalEntry[]> => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(ENTRIES_FILE_PATH);

        if (!fileInfo.exists) {
            await FileSystem.writeAsStringAsync(ENTRIES_FILE_PATH, '[]');
            return [];
        }

        const jsonString = await FileSystem.readAsStringAsync(ENTRIES_FILE_PATH);
        const entries = JSON.parse(jsonString) as JournalEntry[];
        return entries;
    } catch (error) {
        console.error('Error loading journal entries:', error);
        throw error;
    }
};

//fetch a single journal entry by ID
export const fetchEntryById = async (id: string): Promise<JournalEntry | null> => {
    const entries = await loadEntries();
    const entry = entries.find(e => e.id === id);
    console.log("entry: ", entry)
    return entry || null;
};

//create a new journal entry
export const createEntry = async (
    title: string,
    content: string,
    sentimentScore: number,
    sentimentWord: Emotion,
    emotionSliderScore: number,
    emotionSliderWord: Emotion,
    selectedPrompt: string,
    createdAt: Date,
    sentimentHappyW: string[],
    sentimentSadW: string[],
    sentimentAllW: string[],
    isEmotionEntry: boolean,

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
        sentimentHappyW: sentimentHappyW,
        sentimentSadW: sentimentSadW,
        sentimentAllW: sentimentAllW,
        isEmotionEntry: isEmotionEntry,
    };

    const entries = await loadEntries();
    entries.push(newEntry);

    await FileSystem.writeAsStringAsync(ENTRIES_FILE_PATH, JSON.stringify(entries));
};

// Update an existing journal entry
export const updateEntry = async (id: string, updatedData: Partial<JournalEntry>): Promise<void> => {
    const entries = await loadEntries();
    const index = entries.findIndex(entry => entry.id === id);

    if (index !== -1) {
        const updatedEntry = { ...entries[index], ...updatedData };
        entries[index] = updatedEntry;

        await FileSystem.writeAsStringAsync(ENTRIES_FILE_PATH, JSON.stringify(entries));
    } else {
        console.error(`Entry with id ${id} not found.`);
    }
};

// Delete a journal entry
export const deleteEntry = async (id: string): Promise<void> => {
    const entries = await loadEntries();
    const updatedEntries = entries.filter(entry => entry.id !== id);

    await FileSystem.writeAsStringAsync(ENTRIES_FILE_PATH, JSON.stringify(updatedEntries));
};
