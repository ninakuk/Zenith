export interface JournalEntry {
    id: string; 
    title: string; 
    content?: string; 
    //createdAt?: string; 
    //updatedAt?: string;
    emotion?: Emotion,
    image?: string,
    valence?: string
}


export type Emotion = 'Happy' | 'Sad' | 'Neutral'