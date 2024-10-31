import Sentiment from "sentiment";
import { Emotion } from "../models/JournalEntry";

export const analyzeSentiment = (text: string) => {
    const sentiment = new Sentiment();
    const result = sentiment.analyze(text);
    const score = result.score;

    // Convert score to emotion word
    let emotion: Emotion;
    if (score > 0) {
        emotion = 'Happy';
    } else if (score < 0) {
        emotion = 'Sad';
    } else {
        emotion = 'Neutral';
    }

    const happyW = result.positive
    const sadW = result.negative
    const allW = result.words

    //console.log("happy: ", happyW," sad: ", sadW, " word? : ",allW, "result: ", result)

    return { score, emotion, happyW, sadW, allW };
};