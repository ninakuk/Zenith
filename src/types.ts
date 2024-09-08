export type Entry = {
    id: string;
    title: string,
    date?: Date,
    emotion?: Emotion,
    entry_text: string,
    image?: string

};

export type Emotion = 'Happy' | 'Sad' | 'Neutral'