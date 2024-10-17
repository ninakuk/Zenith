export interface JournalEntry {
    id: string; 
    title: string; 
    content: string; 
    emotionSliderScore: number; 
    emotionSliderWord?: Emotion; 
    sentimentScore?: number; 
    sentimentWord?: Emotion;
    image?: string;
    selectedPrompt: string;
    createdAt: Date; 
    updatedAt?: Date;
}

export type Emotion = 'Happy' | 'Sad' | 'Neutral';
