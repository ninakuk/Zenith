export interface JournalEntry {
    id: string; 
    title: string; 
    content: string; 
    emotionSliderScore: number; 
    emotionSliderWord?: Emotion; 
    sentimentScore?: number; 
    sentimentWord?: Emotion;
    sentimentHappyW: string[];
    sentimentSadW: string[];
    sentimentAllW: string[];
    image?: string;
    selectedPrompt: string;
    createdAt: Date; 
    updatedAt?: Date;
    isEmotionEntry: boolean;
}

export type Emotion = 'Happy' | 'Sad' | 'Neutral';
